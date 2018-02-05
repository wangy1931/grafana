package setting

type DataSourceSettings struct {
	DataSourceUrlRoot string
	DataSourceUrlIntranet string
}

func readDataSourceSettings() {
	ds := Cfg.Section("datasource")
  DataSource.DataSourceUrlRoot = ds.Key("datasource_urlroot").String()
  DataSource.DataSourceUrlIntranet = ds.Key("datasource_urlintranet").String()
}

type ElkSourceSettings struct {
  ElkSourceUrlRoot string
  ElkSourceUrlIntranet string
}

func readElkSourceSettings() {
  elk := Cfg.Section("elk")
  ElkSource.ElkSourceUrlRoot = elk.Key("elk_source_url").String()
  ElkSource.ElkSourceUrlIntranet = elk.Key("elk_source_urlintranet").String()
}

type DownloadSettings struct {
  DownloadUrlRoot string
  DownloadUrlIntranet string
}

func readDownloadSettings() {
  download := Cfg.Section("download")
  Download.DownloadUrlRoot = download.Key("download_urlroot").String()
  Download.DownloadUrlIntranet = download.Key("download_urlintranet").String()
}

type AlertSettings struct {
	AlertUrlRoot string
	AlertUrlIntranet string
}

func readAlertSettings() {
	alert := Cfg.Section("alert")
  Alert.AlertUrlRoot = alert.Key("alert_urlroot").String()
  Alert.AlertUrlIntranet = alert.Key("alert_urlintranet").String()
}

type DataCenterSettings struct {
  DataCenterRoot string
}

func readDataCenterSettings() {
  datacenter := Cfg.Section("datacenter")
  DataCenter.DataCenterRoot = datacenter.Key("data_center").String()
}