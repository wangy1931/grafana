package sqlstore

import (
	"testing"
	. "github.com/smartystreets/goconvey/convey"

	"time"
	m "github.com/wangy1931/grafana/pkg/models"
	"github.com/wangy1931/grafana/pkg/setting"
)

func TestOrgPermitCommand(t *testing.T) {
	Convey("Testing OrgPermit DB Access", t, func() {
		InitTestDB(t)

		Convey("Given saved orgid", func() {
			now := time.Now()
			day, _ := time.ParseDuration("+24h")

			addOrgPermit := m.AddOrgPermitCommand{
				OrgId:"1",
				DataSource:"aws",
				Deadline:now.Add(30 * day),
				Level:"free",
			}
			err := AddOrgPermit(&addOrgPermit)
			So(err, ShouldBeNil)
			fmt.Println(addOrgPermit)
		})
	})
}