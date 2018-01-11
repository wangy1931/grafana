package api

import (
	"fmt"

	"github.com/wangy1931/grafana/pkg/api/dtos"
	"github.com/wangy1931/grafana/pkg/bus"
	"github.com/wangy1931/grafana/pkg/events"
	"github.com/wangy1931/grafana/pkg/log"
	"github.com/wangy1931/grafana/pkg/metrics"
	"github.com/wangy1931/grafana/pkg/middleware"
	m "github.com/wangy1931/grafana/pkg/models"
	"github.com/wangy1931/grafana/pkg/services/sqlstore"
	"github.com/wangy1931/grafana/pkg/setting"
	"github.com/wangy1931/grafana/pkg/util"
)

// GET /api/user/signup/options
func GetSignUpOptions(c *middleware.Context) Response {
	return Json(200, util.DynMap{
		"verifyEmailEnabled": setting.VerifyEmailEnabled,
		"autoAssignOrg":      setting.AutoAssignOrg,
	})
}

// POST /api/user/signup
func SignUp(c *middleware.Context, form dtos.SignUpForm) Response {
	if !setting.AllowUserSignUp {
		return ApiError(401, "User signup is disabled", nil)
	}

	existing := m.GetUserByLoginQuery{LoginOrEmail: form.Email}
	if err := bus.Dispatch(&existing); err == nil {
		return ApiError(422, "User with same email address already exists", nil)
	}

	cmd := m.CreateTempUserCommand{}
	cmd.OrgId = -1
	cmd.Email = form.Email
	cmd.Status = m.TmpUserSignUpStarted
	cmd.InvitedByUserId = c.UserId
	cmd.Code = util.GetRandomString(20)
	cmd.RemoteAddr = c.Req.RemoteAddr

	if err := bus.Dispatch(&cmd); err != nil {
		return ApiError(500, "Failed to create signup", err)
	}

	bus.Publish(&events.SignUpStarted{
		Email: form.Email,
		Code:  cmd.Code,
	})

	metrics.M_Api_User_SignUpStarted.Inc(1)

	return Json(200, util.DynMap{"status": "SignUpCreated"})
}

func SignUpStep2(c *middleware.Context, form dtos.SignUpStep2Form) Response {
	if !setting.AllowUserSignUp {
		return ApiError(401, "User signup is disabled", nil)
	}

	createUserCmd := m.CreateUserCommand{
		Email:    form.Email,
		Login:    form.Username,
		Name:     form.Name,
		Password: form.Password,
		OrgName:  form.OrgName,
	}

	// verify email
	if setting.VerifyEmailEnabled {
		if ok, rsp := verifyUserSignUpEmail(form.Email, form.Code); !ok {
			return rsp
		}
		createUserCmd.EmailVerified = true
	}

	// check if user exists
	existing_user := m.GetUserByLoginQuery{LoginOrEmail: form.Email}
	if err := bus.Dispatch(&existing_user); err == nil {
		return ApiError(401, "User with same email address already exists", nil)
	}

	// check if org exists
	existing_org := m.GetOrgByNameQuery{Name: form.OrgName}
	if err := bus.Dispatch(&existing_org); err == nil {
		return ApiError(500, "Organization with same name already exists", nil)
	}

	// Note that: the new org is also created together with this signup user (auto_assign_org = false)
	// dispatch create command
	if err := bus.Dispatch(&createUserCmd); err != nil {
		return ApiError(500, "Failed to create user", err)
	}

	// publish signup event
	user := &createUserCmd.Result
	bus.Publish(&events.SignUpCompleted{
		Email: user.Email,
		Name:  user.NameOrFallback(),
	})

	// add first system
	systems := m.AddSystemsCommand{
		OrgId:       user.OrgId,
		SystemsName: []string{"默认系统"},
	}

	if err := sqlstore.AddSystem(&systems); err != nil {
		return ApiError(500, fmt.Sprintf("Failed to add system for organization %v", user.OrgId), nil)
	}

	// mark temp user as completed
	if ok, rsp := updateTempUserStatus(form.Code, m.TmpUserCompleted); !ok {
		return rsp
	}

	// check for pending invites
	invitesQuery := m.GetTempUsersQuery{Email: form.Email, Status: m.TmpUserInvitePending}
	if err := bus.Dispatch(&invitesQuery); err != nil {
		return ApiError(500, "Failed to query database for invites", err)
	}

	apiResponse := util.DynMap{"message": "User sign up completed successfully", "code": "redirect-to-landing-page"}
	for _, invite := range invitesQuery.Result {
		if ok, rsp := applyUserInvite(user, invite, false); !ok {
			return rsp
		}
		apiResponse["code"] = "redirect-to-select-org"
	}

	loginUserWithUser(user, c)
	metrics.M_Api_User_SignUpCompleted.Inc(1)

	// We need to add the data source defined in config for this org to data_source table
	if err := sqlstore.AddDatasourceForOrg(user.OrgId); err != nil {
		return ApiError(500, fmt.Sprintf("Failed to add data source for organization %v", user.OrgId), err)
	}

	// add grafana admin
	admin := m.SearchUsersQuery{}
	if err := sqlstore.SearchGrafanaAdmin(&admin); err != nil {
		return ApiError(500, "Failed to get propose users", err)
	}

	c.OrgId = user.OrgId
	for key, grafanaAdmin := range admin.Result {
		inviteDto := dtos.AddInviteForm{
			LoginOrEmail: grafanaAdmin.Email,
			Name:         grafanaAdmin.Name,
			Role:         "Admin",
			SkipEmails:   true,
			Systems:      systems.SystemsName,
		}

		AddOrgInvite(c, inviteDto)
		log.Info("Add %d grafanaAdmin %s into organization %s", key, grafanaAdmin.Email, form.OrgName)
	}

	return Json(200, apiResponse)
}

func verifyUserSignUpEmail(email string, code string) (bool, Response) {
	query := m.GetTempUserByCodeQuery{Code: code}

	if err := bus.Dispatch(&query); err != nil {
		if err == m.ErrTempUserNotFound {
			return false, ApiError(404, "Invalid email verification code", nil)
		}
		return false, ApiError(500, "Failed to read temp user", err)
	}

	tempUser := query.Result
	if tempUser.Email != email {
		return false, ApiError(404, "Email verification code does not match email", nil)
	}

	return true, nil
}

func ProposeToUse(c *middleware.Context, form dtos.ProposeUsers) Response {

	createUserCmd := m.CreateProposeUserCommand{
		Email: form.Email,
		Name:  form.Username,
		Phone: form.Phone,
		Org:   form.OrgName,
		Scale: form.Scale,
	}

	if err := bus.Dispatch(&createUserCmd); err != nil {
		return ApiError(500, "Failed to create propose user", err)
	}

	bus.Dispatch(&m.SendProposeUserEmail{
		UserMeta: createUserCmd,
	})

	return Json(200, util.DynMap{
		"created": "success",
	})
}

func GetAllCustomerUsers(c *middleware.Context) Response {
	customersCmd := m.GetAllProposeUsers{}
	if err := bus.Dispatch(&customersCmd); err != nil {
		return ApiError(500, "Failed to get propose users", err)
	}

	return Json(200, &customersCmd.Result)
}
