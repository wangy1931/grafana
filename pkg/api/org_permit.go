package api

import (
  "github.com/wangy1931/grafana/pkg/log"
  "github.com/wangy1931/grafana/pkg/bus"
  "github.com/wangy1931/grafana/pkg/middleware"
  m "github.com/wangy1931/grafana/pkg/models"
)

// GET /api/permit/:id
func GetOrgPermitByOrgId(c *middleware.Context) Response {
	query := m.GetOrgPermitByOrgIdQuery{OrgId: c.ParamsInt64(":id")}
  if err := bus.Dispatch(&query); err != nil {
    return ApiError(500, "Failed to get OrgPermit", err)
  }
  return Json(200, query.Result)
}

// POST /api/admin/permit
func UpdateOrgPermit(c *middleware.Context, permit m.OrgPermit) Response {
  log.Info("Request Permit time: %v", permit)
	if err := bus.Dispatch(&permit); err != nil {
		return ApiError(500, "Failed to update permit", err)
	}
	return ApiSuccess("Permit updated")
}