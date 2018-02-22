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

func GetAllCwizStaticList(c *middleware.Context) Response {
	query := m.GetCwizStaticListQuery{}
  if err := bus.Dispatch(&query); err != nil {
		return ApiError(500, "Failed to get template", err)
  }
  return Json(200, query.Result)
}

func GetCwizStaticListByType(c *middleware.Context) Response {
	query := m.GetCwizStaticListQuery{Type: c.Params(":type")}
  if err := bus.Dispatch(&query); err != nil {
		return ApiError(500, "Failed to get template", err)
  }
  return Json(200, query.Result)
}

func GetCwizStaticById(c *middleware.Context) Response {
	query := m.GetCwizStaticByIdQuery{Id: c.ParamsInt64(":id")}
  if err := bus.Dispatch(&query); err != nil {
		return ApiError(500, "Failed to get template", err)
  }
  return Json(200, query.Result)
}

// POST /:type/:name
