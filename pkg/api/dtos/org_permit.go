package dtos

import (
	// "time"
  // m "github.com/wangy1931/grafana/pkg/models"
)
type UpdateOrgPermit struct {
  Id 				int64 			`json:"Id"`
  OrgId 		int64 	`json:"OrgId"`
  // Deadline 	time.Time 	`json:"Deadline"`
	// Level 		string 	`json:"Level"`
	DataSource string			`json:"DataSource"`
}