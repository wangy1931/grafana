package migrations

import (
	. "github.com/wangy1931/grafana/pkg/services/sqlstore/migrator"

	"path/filepath"
	"github.com/wangy1931/grafana/pkg/setting"
	"github.com/go-xorm/xorm"
	m "github.com/wangy1931/grafana/pkg/models"
	"github.com/wangy1931/grafana/pkg/log"
)

func addCwizStaticMigrations(mg *Migrator) {
	cwizStaticV1 := Table{
		Name: "cwiz_static",
		Columns: []*Column{
			{Name: "id", Type: DB_BigInt, IsPrimaryKey: true, IsAutoIncrement: true},
			{Name: "org_id", Type: DB_BigInt, Length: 255, Nullable: false},
			{Name: "type", Type: DB_NVarchar, Length: 255, Nullable: false},
			{Name: "name", Type: DB_NVarchar, Length: 255, Nullable: false},
			{Name: "json_data", Type: DB_MediumText, Nullable: false},
			{Name: "created", Type: DB_DateTime, Nullable: false},
			{Name: "updated", Type: DB_DateTime, Nullable: false},
		},
	}

	// create table
	mg.AddMigration("create cwiz_static table", NewAddTableMigration(cwizStaticV1))
	addTableIndicesMigrations(mg, "v1", cwizStaticV1)
}

func importCwizStaticMigrations(engine *xorm.Engine) {
	// import cwiz_static.sql
	x := engine
	isEmpty, err := x.IsTableEmpty(m.CwizStatic{})
	if err != nil {
		log.Info("Error for check empty %v", err)
	}
	if isEmpty {
		path := filepath.Join(setting.DataPath, "sql/cwiz_static.sql")
		x.ImportFile(path)
		log.Info("Import cwiz_static data")
	}
}