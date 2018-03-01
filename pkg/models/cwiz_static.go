package models

import(
	"errors"
	"time"

	"github.com/wangy1931/grafana/pkg/components/simplejson"
)

// Typed errors
var (
	ErrNoStaticTemplate	= errors.New("No such template")
	ErrAddStaticTemplate	= errors.New("Cannot creat new template")
	ErrTemplateAlreadyExist	= errors.New("Template is existed")
)


type CwizStatic struct {
	Id					int64
	OrgId				int64
	Type				string
	Name				string
	JsonData    *simplejson.Json
	Created			time.Time
	Updated			time.Time
}

type CwizStaticList struct {
	Id					int64
	OrgId				int64
	Type				string
	Name				string
}

// ---------------------
// QUERIES
type GetCwizStaticQuery struct {
	OrgId		int64
	Type		string
	Name		string
	Result 	*CwizStatic
}

type GetCwizStaticByIdQuery struct {
	Id			int64
	Result 	*CwizStatic
}

type GetCwizStaticListQuery struct {
	OrgId		int64
	Type		string
	Result 	[]*CwizStaticList
}

// ---------------------
// COMMANDS

type AddTemplateCommand struct {
	OrgId			int64
	Type			string
	Name			string
	JsonData	*simplejson.Json
}

type UpdateTemplateCommand struct {
	Id				int64
	JsonData	*simplejson.Json
}

type DeleteTemplateCommand struct {
	Id				int64
}