package api

import (
	"github.com/wangy1931/grafana/pkg/middleware"
  "github.com/wangy1931/grafana/pkg/setting"
  "github.com/wangy1931/grafana/pkg/log"
  m "github.com/wangy1931/grafana/pkg/models"
  "github.com/wangy1931/grafana/pkg/services/sqlstore"
)

func GetCustomizedSource(c *middleware.Context) {
  alert := make(map[string]interface{})
  alert["alert"] = setting.Alert.AlertUrlRoot
  alert["elk"] = setting.ElkSource.ElkSourceUrlRoot
  alert["download"] = setting.Download.DownloadUrlRoot
  
  query := m.GetDataSourcesQuery{OrgId: c.OrgId}
  sqlstore.GetDataSources(&query)
  for _, dataSource := range query.Result {
    alert[dataSource.Name] = dataSource.Url
  }
  log.Info("Alert Url: %v", alert["alert"])
  log.Info("ELk Url : %v", alert["elk"])
  log.Info("Download Url : %v", alert["download"])
  log.Info("Opentsdb Url : %v", alert["opentsdb"])

  c.JSON(200, alert)
}

/*
func GetAlertSource(c *middleware.Context) {
	query := m.GetAlertSourceQuery{OrgId: c.OrgId}

	if err := bus.Dispatch(&query); err != nil {
		c.JsonApiErr(500, "Failed to query alert source", err)
		return
	}

  ds := query.Result

  c.JSON(200, &dtos.AlertSource{
    OrgId:             ds.OrgId,
    Url:               ds.Url,
  })

}
*/
