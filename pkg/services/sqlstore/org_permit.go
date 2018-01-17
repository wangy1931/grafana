package sqlstore

import (
	"github.com/go-xorm/xorm"
	"github.com/wangy1931/grafana/pkg/bus"
	m "github.com/wangy1931/grafana/pkg/models"
)

func init() {
	bus.AddHandler("sql", AddOrgPermit)
	bus.AddHandler("sql", UpdateOrgPermit)
	bus.AddHandler("sql", GetOrgPermitByOrgId)
}

func GetOrgPermitByOrgId(query *m.GetOrgPermitByOrgIdQuery) error {
	permit := m.OrgPermit{OrgId: query.OrgId}
	sess := x.Table("org_permit")
	_, err := sess.Get(&permit)
	query.Result = &permit
	if err != nil {
		return err
	}

  return err
}

func AddOrgPermit(cmd *m.AddOrgPermitCommand) error {
	return inTransaction(func(sess *xorm.Session) error {
		// check if org_permit exists
		if res, err := sess.Query("SELECT 1 from org_permit WHERE org_id=?", cmd.OrgId); err != nil {
			return err
		} else if len(res) == 1 {
			return m.ErrOrgAlreadyAdded
		}

		permit := m.OrgPermit{
			OrgId: 			cmd.OrgId,
			DataSource: cmd.DataSource,
			Deadline:		cmd.Deadline,
			Level:			cmd.Level,
		}

		if _, err := sess.Insert(permit); err != nil {
			return err
		}

		return nil
 	})
}

func UpdateOrgPermit(permit *m.OrgPermit) error {
	return inTransaction2(func(sess *session) error {
		if _, err := sess.Id(permit.Id).Update(permit); err != nil {
			return err
		}
    return nil
	})
}
