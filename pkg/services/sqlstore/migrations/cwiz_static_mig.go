package migrations

import . "github.com/wangy1931/grafana/pkg/services/sqlstore/migrator"

func addCwizStaticMigrations(mg *Migrator) {
	cwizStaticV1 := Table{
		Name: "cwiz_static",
		Columns: []*Column{
			{Name: "id", Type: DB_BigInt, IsPrimaryKey: true, IsAutoIncrement: true},
			{Name: "org_id", Type: DB_BigInt, Length: 255, Nullable: false},
			{Name: "type", Type: DB_NVarchar, Length: 255, Nullable: false},
			{Name: "name", Type: DB_NVarchar, Length: 255, Nullable: false},
			{Name: "json_data", Type: DB_Text, Nullable: false},
			{Name: "created", Type: DB_DateTime, Nullable: false},
			{Name: "updated", Type: DB_DateTime, Nullable: false},
		},
	}

	// create table
	mg.AddMigration("create cwiz_static table v1", NewAddTableMigration(cwizStaticV1))
	addTableIndicesMigrations(mg, "v1", cwizStaticV1)

	//-------  copy data from old table-------------------
	mg.AddMigration("copy data account to cwiz_static", NewCopyTableDataMigration("cwiz_static", "account_cwiz_static", map[string]string{
		"id":      			"id",
		"org_id": 			"org_id",
		"type": 				"type",
		"name": 				"name",
		"json_data": 		"json_data",
		"created": 			"created",
		"updated": 			"updated",
	}).IfTableExists("account_cwiz_static"))
	mg.AddMigration("Drop old table account", NewDropTableMigration("account_cwiz_static"))
}