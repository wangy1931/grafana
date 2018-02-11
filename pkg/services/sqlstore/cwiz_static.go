package sqlstore

import (
	"github.com/go-xorm/xorm"
	"github.com/wangy1931/grafana/pkg/bus"
	m "github.com/wangy1931/grafana/pkg/models"
)

func init() {
	bus.AddHandler("sql", GetCwizStatic)
	bus.AddHandler("sql", AddTemplate)
	bus.AddHandler("sql", UpdateTemplate)
}

func GetCwizStatic(query *m.GetCwizStaticQuery) error {
	tmp := make([]*m.CwizStatic, 0)
	sess := x.Table("cwiz_static")
	sess.Where("(org_id=? OR org_id=0) AND type=? AND name=?", query.OrgId, query.Type, query.Name)
	sess.Desc("org_id")
	err := sess.Find(&tmp)
	
	if len(tmp) == 0 {
		return m.ErrNoStaticTemplate
	}
	query.Result = tmp[0]
  return err
}

// TODO ADD TEMPLATE
func AddTemplate(cmd *m.AddTemplateCommand) error {
	return inTransaction(func(sess *xorm.Session) error {

		template := m.CwizStatic{
			OrgId: 	cmd.OrgId,
			Type:		cmd.Type,
			Name:		cmd.Name,
		}

		_, err := sess.Insert(template)
		return err
 	})
}

// TODO UPDATE TEMPLATE
func UpdateTemplate(template *m.CwizStatic) error {
	return inTransaction2(func(sess *session) error {
		if _, err := sess.Id(template.Id).Update(template); err != nil {
			return err
		}
    return nil
	})
}
