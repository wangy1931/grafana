import _ from 'lodash';
import $ from 'jquery';
import React, { createElement } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider, List, Avatar, Tag, Layout } from 'antd';
import { Bar, TimelineChart } from 'app/core/components/Charts';
import PageHeaderLayout from 'app/core/components/PageHeaderLayout/PageHeaderLayout';
import PageHeader from 'app/core/components/PageHeader/PageHeader';
import DescriptionList from 'app/core/components/DescriptionList/DescriptionList';
import Description from 'app/core/components/DescriptionList/Description';
import Dependency from 'app/core/components/Dependency/Dependency';
import IContainerProps from 'app/containers/IContainerProps';
import moment from 'moment';
import Graph from 'app/core/components/Charts/Graph/index';
import './index.less';
import { RCA } from './RCA';
import { Correlation } from './Correlation';
import { Log } from 'app/containers/Logs/Log';
import GlobalHeader from 'app/core/components/GlobalHeader/GlobalHeader';
import SiderMenu from 'app/core/components/SiderMenu/SiderMenu';

const ButtonGroup = Button.Group;
const { Header, Sider, Content } = Layout;

const action = (
  <div>
    {/* <ButtonGroup>
      <Button>暂缓报警</Button>
    </ButtonGroup>
    <Button type="primary">处理报警</Button> */}
  </div>
);

const wrapInNode = (Component, props) => {
  return (
    <Component {...props} />
  )
};

@inject('view', 'alerting')
@observer
export class Diagnose extends React.Component<IContainerProps, any> {
  constructor(props) {
    super(props);
    const { view, alerting } = this.props;
    const rowKey = view.routeParams.get('key');
    alerting.load(null);
    alerting.setRowKey(rowKey);
  }

  state = {
    activeTab: 'rca',
  };

  onTabChange(key) {
    this.setState({ activeTab: key });
  }

  render() {
    const { alerting } = this.props;
    const loading = false;

    const tabList = [
      {
        key: 'rca',
        tab: '诊断报告',
        component: wrapInNode(RCA, this.props)
      },
      // {
      //   key: 'correlation',
      //   tab: '关联分析',
      //   component: wrapInNode(Correlation)
      // },
      // {
      //   key: 'logs',
      //   tab: '日志分析',
      //   component: wrapInNode(Log)
      // }
    ];

    const description = (
      <DescriptionList className="headerList" size="large" col={1} title="">
        <Description term="报警内容">{alerting.detail.metric}</Description>
        <Description term="报警时间">{alerting.detail.levelChangedTime}</Description>
        <Description term="报警描述">{alerting.detail.description}</Description>
      </DescriptionList>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className="textSecondary">主机名</div>
          <div className="heading text-overflow" style={{ width: '100%' }}>{alerting.detail.monitoredEntity}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="textSecondary">状态</div>
          <div className="heading status-yellow">{alerting.detail.levelType}</div>
        </Col>
      </Row>
    );

    const breadcrumbNameMap = {
      '/diagnose': {
        name: '诊断助手'
      }
    };

    return (
      <div className="rca2">
        <PageHeaderLayout
          breadcrumbNameMap={breadcrumbNameMap}
          title={alerting.detail.name}
          logo={<i className="fa fa-bell system-legend-warning" style={{ fontSize: 20 }}></i>}
          action={action}
          content={description}
          extraContent={extra}
          tabList={tabList}
          onTabChange={this.onTabChange.bind(this)}
        >
        {
          _.find(tabList, { key: this.state.activeTab }).component || null
        }
        </PageHeaderLayout>
      </div>
    );
  }
}
