package migrations

import . "github.com/wangy1931/grafana/pkg/services/sqlstore/migrator"

func addOrgPermitMigrations(mg *Migrator) {
	permitV1 := Table{
		Name: "org_permit",
		Columns: []*Column{
			{Name: "id", Type: DB_BigInt, IsPrimaryKey: true, IsAutoIncrement: true},
			{Name: "org_id", Type: DB_BigInt, Length: 255, Nullable: false},
			{Name: "data_center", Type: DB_NVarchar, Length: 255, Nullable: false},
			{Name: "level", Type: DB_NVarchar, Length: 255, Nullable: false},
			{Name: "deadline", Type: DB_DateTime, Nullable: false},
		},
	}

	// create table
	mg.AddMigration("create org_permit table", NewAddTableMigration(permitV1))
	addTableIndicesMigrations(mg, "v1", permitV1)

	//-------  copy data from old table-------------------
	mg.AddMigration("copy data account to org_permit", NewCopyTableDataMigration("org_permit", "account_org_permit", map[string]string{
		"id":      			"id",
		"org_id": 			"org_id",
		"data_center":  "data_center",
		"level": 				"level",
		"deadline": 		"deadline",
	}).IfTableExists("account_org_permit"))
	mg.AddMigration("Drop old table account", NewDropTableMigration("account_org_permit"))
}