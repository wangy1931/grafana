package migrations

import (
	"path/filepath"
	"github.com/wangy1931/grafana/pkg/setting"
	"github.com/go-xorm/xorm"
)

func importCwizStaticMigrations(engine *xorm.Engine) {
	// import cwiz_static.sql
	x := engine
	path := filepath.Join(setting.DataPath, "sql/cwiz_static.sql")
	x.ImportFile(path)
}