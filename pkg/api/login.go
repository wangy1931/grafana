package api

import (
	"net/url"
	"time"

	"github.com/wangy1931/grafana/pkg/api/dtos"
	"github.com/wangy1931/grafana/pkg/bus"
	"github.com/wangy1931/grafana/pkg/log"
	"github.com/wangy1931/grafana/pkg/login"
	"github.com/wangy1931/grafana/pkg/metrics"
	"github.com/wangy1931/grafana/pkg/middleware"
	m "github.com/wangy1931/grafana/pkg/models"
	"github.com/wangy1931/grafana/pkg/setting"
	"github.com/wangy1931/grafana/pkg/util"
)

const (
	VIEW_INDEX = "index"
)

func LoginView(c *middleware.Context) {
	viewData, err := setIndexViewData(c)
	if err != nil {
		c.Handle(500, "Failed to get settings", err)
		return
	}

	viewData.Settings["googleAuthEnabled"] = setting.OAuthService.Google
	viewData.Settings["githubAuthEnabled"] = setting.OAuthService.GitHub
	viewData.Settings["disableUserSignUp"] = !setting.AllowUserSignUp
	viewData.Settings["loginHint"] = setting.LoginHint

	if !tryLoginUsingRememberCookie(c) {
		c.HTML(200, VIEW_INDEX, viewData)
		return
	}

	if redirectTo, _ := url.QueryUnescape(c.GetCookie("redirect_to")); len(redirectTo) > 0 {
		c.SetCookie("redirect_to", "", -1, setting.AppSubUrl+"/")
		c.Redirect(redirectTo)
		return
	}

	c.Redirect(setting.AppSubUrl + "/")
}

func tryLoginUsingRememberCookie(c *middleware.Context) bool {
	// Check auto-login.
	uname := c.GetCookie(setting.CookieUserName)
	if len(uname) == 0 {
		return false
	}

	isSucceed := false
	defer func() {
		if !isSucceed {
			log.Trace("auto-login cookie cleared: %s", uname)
			c.SetCookie(setting.CookieUserName, "", -1, setting.AppSubUrl+"/")
			c.SetCookie(setting.CookieRememberName, "", -1, setting.AppSubUrl+"/")
			return
		}
	}()

	userQuery := m.GetUserByLoginQuery{LoginOrEmail: uname}
	if err := bus.Dispatch(&userQuery); err != nil {
		return false
	}

	user := userQuery.Result

	// validate remember me cookie
	if val, _ := c.GetSuperSecureCookie(
		util.EncodeMd5(user.Rands+user.Password), setting.CookieRememberName); val != user.Login {
		return false
	}

	isSucceed = !loginUserWithUser(user, c)
	return isSucceed
}

func LoginApiPing(c *middleware.Context) {
	if !tryLoginUsingRememberCookie(c) {
		return
	}

	c.JsonOK("Logged in")
}

func LoginPost(c *middleware.Context, cmd dtos.LoginCommand) Response {
	authQuery := login.LoginUserQuery{
		Username: cmd.User,
		Password: cmd.Password,
	}

	if err := bus.Dispatch(&authQuery); err != nil {
		if err == login.ErrInvalidCredentials {
			return ApiError(401, "Invalid username or password", err)
		}

		return ApiError(500, "Error while trying to authenticate user", err)
	}

	user := authQuery.User

	if loginUserWithUser(user, c) {
		return ApiError(401, "Expired user", nil)
	}

	result := map[string]interface{}{
		"message": "Logged in",
	}

	if redirectTo, _ := url.QueryUnescape(c.GetCookie("redirect_to")); len(redirectTo) > 0 {
		result["redirectUrl"] = redirectTo
		c.SetCookie("redirect_to", "", -1, setting.AppSubUrl+"/")
	}

	metrics.M_Api_Login_Post.Inc(1)

	return Json(200, result)
}

func loginUserWithUser(user *m.User, c *middleware.Context) bool {
	if user == nil {
		log.Error(3, "User login with nil user")
	}

	days := 86400 * setting.LogInRememberDays
	if days > 0 {
		c.SetCookie(setting.CookieUserName, user.Login, days, setting.AppSubUrl+"/", setting.CorssDomain)
		c.SetSuperSecureCookie(util.EncodeMd5(user.Rands+user.Password), setting.CookieRememberName, user.Login, days, setting.AppSubUrl+"/", setting.CorssDomain)
	}

	c.Session.Set(middleware.SESS_KEY_USERID, user.Id)

	if user.IsAdmin {
		return false
	}
	permit := m.GetOrgPermitByOrgIdQuery{OrgId: user.OrgId}
	if err := bus.Dispatch(&permit); err != nil {
		return false
	}

	if permit.Result.Deadline.Unix() <= time.Now().Unix() {
		return true
	}
	return false
}

func Logout(c *middleware.Context) {
	c.SetCookie(setting.CookieUserName, "", -1, setting.AppSubUrl+"/")
	c.SetCookie(setting.CookieRememberName, "", -1, setting.AppSubUrl+"/")
  	c.SetCookie(setting.CookieUserName, "", -1, setting.AppSubUrl+"/", setting.CorssDomain)
  	c.SetCookie(setting.CookieRememberName, "", -1, setting.AppSubUrl+"/", setting.CorssDomain)
	c.Session.Destory(c)
	c.Redirect(setting.AppSubUrl + "/login")
}
