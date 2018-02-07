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
  alert["alert_intranet"] = setting.Alert.AlertUrlIntranet
  alert["elk"] = setting.ElkSource.ElkSourceUrlRoot
  alert["elk_intranet"] = setting.ElkSource.ElkSourceUrlIntranet
  alert["download"] = setting.Download.DownloadUrlRoot
  alert["download_intranet"] = setting.Download.DownloadUrlIntranet
  alert["opentsdb_intranet"] = setting.DataSource.DataSourceUrlIntranet
  
  query := m.GetDataSourcesQuery{OrgId: c.OrgId}
  sqlstore.GetDataSources(&query)
  for _, dataSource := range query.Result {
    alert[dataSource.Name] = dataSource.Url
    if dataSource.IntranetUrl == "" {
      alert[dataSource.Name + "_intranet"] = dataSource.Url
    } else {
      alert[dataSource.Name + "_intranet"] = dataSource.IntranetUrl
    }
  }
  log.Info("Alert Url: %v", alert["alert"])
  log.Info("Alert Intranet Url: %v", alert["alert_intranet"])
  log.Info("ELk Url : %v", alert["elk"])
  log.Info("ELk Intranet Url : %v", alert["elk_intranet"])
  log.Info("Download Url : %v", alert["download"])
  log.Info("Download Intranet Url : %v", alert["download_intranet"])
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
