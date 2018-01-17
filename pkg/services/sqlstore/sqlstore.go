package sqlstore

import (
	"fmt"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	"github.com/wangy1931/grafana/pkg/bus"
	"github.com/wangy1931/grafana/pkg/log"
	m "github.com/wangy1931/grafana/pkg/models"
	"github.com/wangy1931/grafana/pkg/services/sqlstore/migrations"
	"github.com/wangy1931/grafana/pkg/services/sqlstore/migrator"
	"github.com/wangy1931/grafana/pkg/setting"

	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
	"github.com/wangy1931/grafana/pkg/components/simplejson"
)

type MySQLConfig struct {
	SslMode        string
	CaCertPath     string
	ClientKeyPath  string
	ClientCertPath string
	ServerCertName string
}

var (
	x       *xorm.Engine
	dialect migrator.Dialect

	HasEngine bool

	DbCfg struct {
		Type, Host, Name, User, Pwd, Path, SslMode string
	}

	mysqlConfig MySQLConfig

	UseSQLite3 bool
)

const (
	MAINORG_ID = 1
)

func EnsureAdminUser() {
	statsQuery := m.GetSystemStatsQuery{}

	if err := bus.Dispatch(&statsQuery); err != nil {
		log.Fatal(3, "Could not determine if admin user exists: %v", err)
		return
	}

	if statsQuery.Result.UserCount > 0 {
		return
	}

	cmd := m.CreateUserCommand{}
	cmd.Login = setting.AdminUser
	cmd.Email = setting.AdminUser + "@localhost"
	cmd.Password = setting.AdminPassword
	cmd.IsAdmin = true

	if err := bus.Dispatch(&cmd); err != nil {
		log.Error(3, "Failed to create default admin user", err)
		return
	}

  system := m.AddSystemsCommand{}
  system.OrgId = cmd.Result.OrgId
  system.SystemsName = []string{"Cloudwiz"}
  if err := bus.Dispatch(&system); err != nil {
    log.Error(3, "Failed to create defalut system for admin", err)
    return
  }
  log.Info("Created default Cloudwiz system")
	log.Info("Created default admin user: %v", setting.AdminUser)
}

func AddDatasourceFromConfig() {

	// Read datasource from OrgId 1 and compare with the current setting:
	// If same, do nothing

	// Read data source from OrgId 1 (default Main.org)
	query := m.GetDataSourceByNameQuery{
		OrgId: MAINORG_ID,
		Name:  "opentsdb",
	}

	if err := bus.Dispatch(&query); err != nil {
		log.Info("Could not find data source with OrgId = 1: %v", err)
	} else {
		log.Info("Data source read from OrgId 1 (MAINORG_ID) is %s", query.Result.Url)

		if setting.DataSource.DataSourceUrlRoot == query.Result.Url {
			return
		}
	}

	// If initially OrgId 1 does not have data source defined in data_source table, add it.
	// This should only happen when the system runs at the first time.
	if query.Result.Url == "" {
		log.Info("Add default data source for OrgId = 1 from config: %v", setting.DataSource.DataSourceUrlRoot)
		if err := bus.Dispatch(&m.AddDataSourceCommand{
			OrgId:     MAINORG_ID,
			Name:      "opentsdb",
			Type:      m.DS_OPENTSDB,
			Access:    m.DS_ACCESS_DIRECT,
			Url:       setting.DataSource.DataSourceUrlRoot,
			IsDefault: true,
		}); err != nil {
			log.Fatal(3, "Could not add default datasource for OrgId 1 from config: %v", err)
			return
		}

		if err := bus.Dispatch(&m.AddDataSourceCommand{
			OrgId:     MAINORG_ID,
			Name:      "elk",
			Type:      m.DS_ES,
			Access:    m.DS_ACCESS_PROXY,
			Url:       setting.ElkSource.ElkSourceUrlRoot,
			IsDefault: false,
			Database:  "[$_token-logstash-]YYYY.MM.DD",
			JsonData:  simplejson.NewFromAny(map[string]interface{}{
				"interval"  : "Daily",
				"timeField" : "@timestamp",
			}),
		}); err != nil {
			log.Fatal(3, "Could not add default datasource for OrgId 1 from config: %v", err)
			return
		}

		if err := bus.Dispatch(&m.AddDataSourceCommand{
			OrgId:     MAINORG_ID,
			Name:      "alert",
			Type:      m.DS_ALERT,
			Access:    m.DS_ACCESS_DIRECT,
			Url:       setting.Alert.AlertUrlRoot,
			IsDefault: false,
		}); err != nil {
			log.Fatal(3, "Could not add default datasource for OrgId 1 from config: %v", err)
			return
		}

		if err := bus.Dispatch(&m.AddDataSourceCommand{
			OrgId:     MAINORG_ID,
			Name:      "download",
			Type:      m.DS_DOWNLOAD,
			Access:    m.DS_ACCESS_DIRECT,
			Url:       setting.Download.DownloadUrlRoot,
			IsDefault: false,
		}); err != nil {
			log.Fatal(3, "Could not add default datasource for OrgId 1 from config: %v", err)
			return
		}

	}
}

func AddDatasourceForOrg(orgId int64) (err error) {
	log.Info("AddDatasourceForOrg: orgId=%v", orgId)
	if err = bus.Dispatch(&m.AddDataSourceCommand{
		OrgId:     orgId,
		Name:      "opentsdb",
		Type:      m.DS_OPENTSDB,
		Access:    m.DS_ACCESS_DIRECT,
		Url:       setting.DataSource.DataSourceUrlRoot,
		IsDefault: true,
	}); err != nil {
		log.Error(3, "Could not add default datasource from config: %v", err)
		return err
	}

	if err := bus.Dispatch(&m.AddDataSourceCommand{
		OrgId:     orgId,
		Name:      "elk",
		Type:      m.DS_ES,
		Access:    m.DS_ACCESS_PROXY,
		Url:       setting.ElkSource.ElkSourceUrlRoot,
		IsDefault: false,
		Database:  "[$_token-logstash-]YYYY.MM.DD",
		JsonData:  simplejson.NewFromAny(map[string]interface{}{
			"interval"  : "Daily",
			"timeField" : "@timestamp",
		}),
	}); err != nil {
		log.Error(3, "Could not add default datasource from config: %v", err)
		return err
	}

	if err := bus.Dispatch(&m.AddDataSourceCommand{
		OrgId:     orgId,
		Name:      "alert",
		Type:      m.DS_ALERT,
		Access:    m.DS_ACCESS_DIRECT,
		Url:       setting.Alert.AlertUrlRoot,
		IsDefault: false,
	}); err != nil {
		log.Fatal(3, "Could not add default datasource from config: %v", err)
		return err
	}

	if err := bus.Dispatch(&m.AddDataSourceCommand{
		OrgId:     orgId,
		Name:      "download",
		Type:      m.DS_DOWNLOAD,
		Access:    m.DS_ACCESS_DIRECT,
		Url:       setting.Download.DownloadUrlRoot,
		IsDefault: false,
	}); err != nil {
		log.Fatal(3, "Could not add default datasource from config: %v", err)
		return err
	}
	return nil
}

func DeleteDatasourceForOrg(orgId int64) (err error) {
	log.Info("DeleteDatasourceForOrg: orgId=%v", orgId)
	if err = bus.Dispatch(&m.DeleteAllDataSourceInOrgCommand{
		OrgId: orgId,
	}); err != nil {
		log.Error(3, "Could not delete data source with OrgId = %v: %v", orgId, err)
		return err
	}

	return nil
}

func NewEngine() {
	x, err := getEngine()

	if err != nil {
		log.Fatal(3, "Sqlstore: Fail to connect to database: %v", err)
	}

	err = SetEngine(x, setting.Env == setting.DEV)

	if err != nil {
		log.Fatal(3, "fail to initialize orm engine: %v", err)
	}
}

func SetEngine(engine *xorm.Engine, enableLog bool) (err error) {
	x = engine
	dialect = migrator.NewDialect(x.DriverName())

	migrator := migrator.NewMigrator(x)
	migrator.LogLevel = log.INFO
	migrations.AddMigrations(migrator)

	if err := migrator.Start(); err != nil {
		return fmt.Errorf("Sqlstore::Migration failed err: %v\n", err)
	}

	if enableLog {
		logPath := path.Join(setting.LogsPath, "xorm.log")
		os.MkdirAll(path.Dir(logPath), os.ModePerm)

		f, err := os.Create(logPath)
		if err != nil {
			return fmt.Errorf("sqlstore.init(fail to create xorm.log): %v", err)
		}
		x.Logger = xorm.NewSimpleLogger(f)
	}

	return nil
}

func getEngine() (*xorm.Engine, error) {
	LoadConfig()

	cnnstr := ""
	switch DbCfg.Type {
	case "mysql":
		protocol := "tcp"
		if strings.HasPrefix(DbCfg.Host, "/") {
			protocol = "unix"
		}

		cnnstr = fmt.Sprintf("%s:%s@%s(%s)/%s?charset=utf8",
			DbCfg.User, DbCfg.Pwd, protocol, DbCfg.Host, DbCfg.Name)

		if mysqlConfig.SslMode == "true" || mysqlConfig.SslMode == "skip-verify" {
			tlsCert, err := makeCert("custom", mysqlConfig)
			if err != nil {
				return nil, err
			}
			mysql.RegisterTLSConfig("custom", tlsCert)
			cnnstr += "&tls=custom"
		}
	case "postgres":
		var host, port = "127.0.0.1", "5432"
		fields := strings.Split(DbCfg.Host, ":")
		if len(fields) > 0 && len(strings.TrimSpace(fields[0])) > 0 {
			host = fields[0]
		}
		if len(fields) > 1 && len(strings.TrimSpace(fields[1])) > 0 {
			port = fields[1]
		}
		if DbCfg.Pwd == "" {
			DbCfg.Pwd = "''"
		}
		if DbCfg.User == "" {
			DbCfg.User = "''"
		}
		cnnstr = fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s sslmode=%s", DbCfg.User, DbCfg.Pwd, host, port, DbCfg.Name, DbCfg.SslMode)
	case "sqlite3":
		if !filepath.IsAbs(DbCfg.Path) {
			DbCfg.Path = filepath.Join(setting.DataPath, DbCfg.Path)
		}
		os.MkdirAll(path.Dir(DbCfg.Path), os.ModePerm)
		cnnstr = "file:" + DbCfg.Path + "?cache=shared&mode=rwc&_loc=Local"
	default:
		return nil, fmt.Errorf("Unknown database type: %s", DbCfg.Type)
	}

	log.Info("Database: %v", DbCfg.Type)

	return xorm.NewEngine(DbCfg.Type, cnnstr)
}

func LoadConfig() {
	sec := setting.Cfg.Section("database")

	DbCfg.Type = setting.Database.Type
	if DbCfg.Type == "sqlite3" {
		UseSQLite3 = true
	}

	DbCfg.Host = setting.Database.Host
	DbCfg.Name = setting.Database.Name
	DbCfg.User = setting.Database.User
	DbCfg.Pwd  = setting.Database.Pwd
	DbCfg.SslMode = setting.Database.SslMode
	DbCfg.Path = setting.Database.Path

	if DbCfg.Type == "mysql" {
		mysqlConfig.SslMode = DbCfg.SslMode
		mysqlConfig.CaCertPath = sec.Key("ca_cert_path").String()
		mysqlConfig.ClientKeyPath = sec.Key("client_key_path").String()
		mysqlConfig.ClientCertPath = sec.Key("client_cert_path").String()
		mysqlConfig.ServerCertName = sec.Key("server_cert_name").String()
	}
}

func AddDatacenterFromConfig() {
	// data_center in table org_permit
	// Read datacenter from OrgId 1 and compare with the current setting:
	// If none, insert
	// If has, do nothing

	// Read datacenter from OrgId 1 (default Main.org)
	query := m.GetOrgPermitByOrgIdQuery{OrgId: MAINORG_ID}

	if err := bus.Dispatch(&query); err != nil {
		log.Info("Could not find data center with OrgId = 1: %v", err)
	} else {
		log.Info("Data center read from OrgId 1 (MAINORG_ID) is %s", query.Result.DataCenter)
		return
	}

	// If initially OrgId 1 does not have data center defined in org_permit table, add it.
	// This should only happen when the system runs at the first time.
	if query.Result.DataCenter == "" {
		log.Info("Add default data center for OrgId = 1 from config: %v", setting.DataCenter.DataCenterRoot)
		now := time.Now()
		day, _ := time.ParseDuration("24h")  
		if err := bus.Dispatch(&m.AddOrgPermitCommand{
			OrgId:     	MAINORG_ID,
			DataCenter: setting.DataCenter.DataCenterRoot,
			Deadline:		now.Add(30 * day),
			Level:			m.LEVEL_FREE,
		}); err != nil {
			log.Fatal(3, "Could not add default datacenter for OrgId 1 from config: %v", err)
			return
		}
	}
}

func AddDatacenterForOrg(orgId int64) (err error) {
	log.Info("Add default data center for OrgId = %v from config: %v", orgId, setting.DataCenter.DataCenterRoot)
	now := time.Now()
	day, _ := time.ParseDuration("24h")  
	if err := bus.Dispatch(&m.AddOrgPermitCommand{
		OrgId:     	orgId,
		DataCenter: setting.DataCenter.DataCenterRoot,
		Deadline:		now.Add(30 * day),
		Level:			m.LEVEL_FREE,
	}); err != nil {
		log.Fatal(3, "Could not add default datacenter for OrgId %v from config: %v", orgId, err)
		return err
	}
	return nil
}
