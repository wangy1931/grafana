package api

import (
  "github.com/wangy1931/grafana/pkg/bus"
  "github.com/wangy1931/grafana/pkg/middleware"
	m "github.com/wangy1931/grafana/pkg/models"
)

// GET /:type/:name
func GetCwizStatic(c *middleware.Context) Response {
	query := m.GetCwizStaticQuery{
		OrgId: c.OrgId,
		Type: c.Params(":type"),
		Name: c.Params(":name"),
	}
  if err := bus.Dispatch(&query); err != nil {
		return ApiError(500, "Failed to get template", err)
  }
  return Json(200, query.Result)
}

// POST /:type/:name
