import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import GlobalHeader from 'app/core/components/GlobalHeader/GlobalHeader';
import SiderMenu from 'app/core/components/SiderMenu/SiderMenu';
import { contextSrv } from 'app/core/services/context_srv';

const { Content } = Layout;

export interface BasicLayoutProps {
  location?: any
  context?: any
}

@inject('context')
@observer
export class BasicLayout extends React.Component<BasicLayoutProps, any> {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  getChildContext() {
    const { location } = this.props;
    return {
      location,
    };
  }

  componentDidMount() {
  }

  handleMenuCollapse = (collapsed) => {
    // const { context } = this.props;
    // context.toggleSideMenu(collapsed);
    contextSrv.toggleSideMenu(null);
  }

  render() {
    const {
      location = window.location, children, context
    } = this.props;

    // const MainView = React.createElement('<div className="main-view" ng-view></div>')

    const menuData = {
      "menusTop": [
        {
          "id": 2,
          "text": "i18n_menu_monitor",
          "icon": "fa fa-fw fa-tachometer",
          "url": "2",
          "children": [
            {
              "id": 1,
              "text": "i18n_menu_dashboardlist",
              "url": "/dashboardlist"
            },
            {
              "id": 2,
              "text": "i18n_menu_logs",
              "url": "/logs"
            },
            {
              "id": 3,
              "text": "i18n_menu_host",
              "url": "/host_topology"
            },
            {
              "id": 4,
              "text": "i18n_menu_service",
              "url": "/service_topology"
            }
          ]
        },
        {
          "id": 3,
          "text": "i18n_menu_alert",
          "icon": "fa fa-fw fa-bell",
          "url": "3",
          "children": [
            {
              "id": 1,
              "text": "i18n_menu_alert_rule",
              "url": "/alerts/status"
            },
            {
              "id": 2,
              "text": "i18n_menu_alert_auto",
              "url": "/anomaly"
            }
          ]
        },
        {
          "id": 4,
          "text": "i18n_menu_diagnosis",
          "icon": "fa fa-fw fa-bar-chart",
          "url": "4",
          "children": [
            {
              "id": 1,
              "text": "i18n_menu_diagnostic_assistant",
              "url": "/rca?guide"
            },
            {
              "id": 2,
              "text": "i18n_menu_report",
              "url": "/report"
            }
          ]
        },
        {
          "id": 5,
          "text": "i18n_menu_cmdb",
          "icon": "fa fa-fw fa-cubes",
          "url": "5",
          "children": [
            {
              "id": 1,
              "text": "i18n_menu_cmdb_config",
              "url": "/cmdb/config?serviceName=collector"
            },
            {
              "id": 2,
              "text": "i18n_menu_logs_parse",
              "url": "/logs/rules"
            },
            {
              "id": 3,
              "text": "i18n_menu_cmdb_metrics",
              "url": "/cmdb/metrics"
            }
          ]
        }
      ],
      "menusBottom": [
        {
          "id": 101,
          "text": "安装指南",
          "icon": "fa fa-fw fa-cloud-download",
          "url": "/setting/agent",
        },
        {
          "id": 102,
          "text": '运维轮班',
          "icon": "fa fa-fw fa-calendar",
          "url": "/oncallerschedule"
        },
        {
          "id": 103,
          "text": '运维知识库',
          "icon": "fa fa-fw fa-book",
          "url": "/knowledgebase"
        }
      ]
    }

    return (
      <Layout>
        {/* <SiderMenu
          menuData={menuData}
          collapsed={contextSrv.pinned}
          location={location}
          onCollapse={this.handleMenuCollapse}
        /> */}
        {/* <Layout> */}
          <GlobalHeader
          // collapsed={context.collapsed}
          collapsed={contextSrv.pinned}
          onCollapse={this.handleMenuCollapse}
          />
          <Content style={{ height: '100%' }}>
            {children ? children : null}
          </Content>
        {/* </Layout> */}
      </Layout>
    );
  }
}
