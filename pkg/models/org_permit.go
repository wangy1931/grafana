package models

import(
	"errors"
	"time"
)

// Typed errors
var (
	ErrAddOrgPermit			= errors.New("Cannot creat new OrgPermit")
	ErrOrgAlreadyExist	= errors.New("Organization is exist org_permit")
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
	DataCenter	string
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
	DataCenter	string		`json:"data_center" binding:"Required"`
	Deadline		time.Time	`json:"deadline" binding:"Required"`
}
