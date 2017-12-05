package setting

type DataSourceSettings struct {
	DataSourceUrlRoot string
}

func readDataSourceSettings() {
	ds := Cfg.Section("datasource")
  DataSource.DataSourceUrlRoot = ds.Key("datasource_urlroot").String()
}

type ElkSourceSettings struct {
  ElkSourceUrlRoot string
}

func readElkSourceSettings() {
  elk := Cfg.Section("elk")
  ElkSource.ElkSourceUrlRoot = elk.Key("elk_source_url").String()
}

type AgentSettings struct {
	AgentUrlRoot string
}

func readAgentSettings() {
	agent := Cfg.Section("agent")
  Agent.AgentUrlRoot = agent.Key("agent_urlroot").String()
}
