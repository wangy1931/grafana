package dtos

import (
	"crypto/md5"
	"fmt"
	"strings"
	"time"

	"github.com/wangy1931/grafana/pkg/components/simplejson"
	m "github.com/wangy1931/grafana/pkg/models"
	"github.com/wangy1931/grafana/pkg/setting"
)

type AnyId struct {
	Id int64 `json:"id"`
}

type LoginCommand struct {
	User     string `json:"user" binding:"Required"`
	Password string `json:"password" binding:"Required"`
	Remember bool   `json:"remember"`
}

type CurrentUser struct {
	IsSignedIn     bool       `json:"isSignedIn"`
	Id             int64      `json:"id"`
	Login          string     `json:"login"`
	Email          string     `json:"email"`
	Name           string     `json:"name"`
	UserTheme      string     `json:"userTheme"`
	OrgId          int64      `json:"orgId"`
	OrgName        string     `json:"orgName"`
	OrgRole        m.RoleType `json:"orgRole"`
	IsGrafanaAdmin bool       `json:"isGrafanaAdmin"`
	GravatarUrl    string     `json:"gravatarUrl"`
  SystemId       int64      `json:"systemId"`
	Timezone       string     `json:"timezone"`
	Deadline			 time.Time	`json:"deadline"`
}

type DashboardMeta struct {
	IsStarred  bool      `json:"isStarred,omitempty"`
	IsHome     bool      `json:"isHome,omitempty"`
	IsSnapshot bool      `json:"isSnapshot,omitempty"`
	Type       string    `json:"type,omitempty"`
	CanSave    bool      `json:"canSave"`
	CanEdit    bool      `json:"canEdit"`
	CanStar    bool      `json:"canStar"`
	Slug       string    `json:"slug"`
	Expires    time.Time `json:"expires"`
	Created    time.Time `json:"created"`
	Updated    time.Time `json:"updated"`
	UpdatedBy  string    `json:"updatedBy"`
	CreatedBy  string    `json:"createdBy"`
	Version    int       `json:"version"`
}

type DashboardFullWithMeta struct {
	Meta      DashboardMeta    `json:"meta"`
	Dashboard *simplejson.Json `json:"dashboard"`
}

type DashboardRedirect struct {
	RedirectUri string `json:"redirectUri"`
}

type DataSource struct {
	Id                int64            `json:"id"`
	OrgId             int64            `json:"orgId"`
	Name              string           `json:"name"`
	Type              string           `json:"type"`
	TypeLogoUrl       string           `json:"typeLogoUrl"`
	Access            m.DsAccess       `json:"access"`
	Url               string           `json:"url"`
	Intranet          string           `json:"intranet"`
	Password          string           `json:"password"`
	User              string           `json:"user"`
	Database          string           `json:"database"`
	BasicAuth         bool             `json:"basicAuth"`
	BasicAuthUser     string           `json:"basicAuthUser"`
	BasicAuthPassword string           `json:"basicAuthPassword"`
	WithCredentials   bool             `json:"withCredentials"`
	IsDefault         bool             `json:"isDefault"`
	JsonData          *simplejson.Json `json:"jsonData,omitempty"`
}

type DataSourceList []DataSource

func (slice DataSourceList) Len() int {
	return len(slice)
}

func (slice DataSourceList) Less(i, j int) bool {
	return slice[i].Name < slice[j].Name
}

func (slice DataSourceList) Swap(i, j int) {
	slice[i], slice[j] = slice[j], slice[i]
}

type AlertSource struct {
	OrgId int64  `json:"orgId"`
	Url   string `json:"url"`
}

type MetricQueryResultDto struct {
	Data []MetricQueryResultDataDto `json:"data"`
}

type MetricQueryResultDataDto struct {
	Target     string       `json:"target"`
	DataPoints [][2]float64 `json:"datapoints"`
}

type UserStars struct {
	DashboardIds map[string]bool `json:"dashboardIds"`
}

func GetGravatarUrl(text string) string {
	if text == "" {
		return ""
	}

	hasher := md5.New()
	hasher.Write([]byte(strings.ToLower(text)))
	return fmt.Sprintf(setting.AppSubUrl+"/avatar/%x", hasher.Sum(nil))
}
