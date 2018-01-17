package models

import(
	"errors"
	"time"
)

// Typed errors
var (
	ErrAddOrgPermit			= errors.New("Cannot creat new OrgPermit")
	ErrOrgAlreadyAdded	= errors.New("Organization is already added to org_permit")
)

type OrgLevel string

const (
	LEVEL_PAY		OrgLevel = "pay"
	LEVEL_FREE	OrgLevel = "free"
)

func (l OrgLevel) IsValid() bool {
	return l == LEVEL_PAY || l == LEVEL_FREE
}

type OrgPermit struct {
	Id					int64
	OrgId				int64
	DataSource	string
	Deadline		time.Time
	Level				OrgLevel		
}

// ---------------------
// QUERIES
type GetOrgPermitByOrgIdQuery struct {
	OrgId		int64
	Result 	*OrgPermit
}

// ---------------------
// COMMANDS

type AddOrgPermitCommand struct {
	OrgId  			int64 		`json:"-"`
	Level				OrgLevel	`json:"level" binding:"Required"`
	DataSource	string		`json:"datasource" binding:"Required"`
	Deadline		time.Time	`json:"deadline" binding:"Required"`
}
