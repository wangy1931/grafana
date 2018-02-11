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

// ---------------------
// QUERIES
type GetCwizStaticQuery struct {
	OrgId		int64
	Type		string
	Name		string
	Result 	*CwizStatic
}

// ---------------------
// COMMANDS

type AddTemplateCommand struct {
	OrgId			int64
	Type			string
	Name			string
	JsonData	*simplejson.Json
}