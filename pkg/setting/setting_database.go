package setting

import (
	"encoding/base64"
)

type DatabaseSettings struct {
	Type    string
	Host    string
	Name    string
	User    string
	Pwd     string
	SslMode string
	Path    string
}

func readDatabaseSettings() {
	db := Cfg.Section("database")
	Database.Type = db.Key("type").String()
	Database.Host = db.Key("host").String()
	Database.Name = db.Key("name").String()
	Database.User = db.Key("user").String()

	if len(Database.Pwd) == 0 {
		b, err := base64.StdEncoding.DecodeString(db.Key("password").String())
		if err != nil {
			return
		}
		Database.Pwd = string(b)
	}

	Database.SslMode = db.Key("ssl_mode").String()
	Database.Path = db.Key("path").MustString("data/grafana.db")
}