package sqlstore

import (
	"testing"
	. "github.com/smartystreets/goconvey/convey"

	"time"
	m "github.com/wangy1931/grafana/pkg/models"
	"github.com/wangy1931/grafana/pkg/setting"
)

func TestGetTemplateCommand(t *testing.T) {
	Convey("Testing CwizStatic DB Access", t, func() {
		InitTestDB(t)
	})
}