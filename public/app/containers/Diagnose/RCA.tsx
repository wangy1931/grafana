import _ from 'lodash';
import $ from 'jquery';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider, List, Avatar, Tag } from 'antd';
import moment from 'moment';
import Graph from 'app/core/components/Charts/Graph/index';
import Dependency from 'app/core/components/Dependency/Dependency';
import IContainerProps from 'app/containers/IContainerProps';
import { DashboardGrid } from 'app/features/dashboard/dashgrid/DashboardGrid';

@inject('view', 'rca2', 'alerting', 'topn', 'graph')
@observer
export class RCA extends React.Component<IContainerProps, any> {
  constructor(props) {
    super(props);
    this.loadStore();
  }

  loadStore() {
    const { rca2, alerting, topn, graph, view } = this.props;
    const rowKey = view.routeParams.get('key');

    return alerting.load(rowKey).then(res => {
      const data = _.find(toJS(res), { rowKey: rowKey }) || {};
      const range = {
        from: moment(data.levelChangedTime).add(-6, 'hour'),
        to  : moment(data.levelChangedTime).add(+6, 'hour')
      };
      const host = data.monitoredEntity;

      // 根据指标 决定资源消耗topn排序方式 默认:memPercent
      let orderBy = 'memPercent';
      /df\.bytes/.test(data.metric) && (orderBy = 'disk_io_read');
      /proc\.meminfo/.test(data.metric) && (orderBy = 'memPercent');
      /cpu/.test(data.metric) && (orderBy = 'cpuPercent');

      alerting.setRowKey(data.rowKey);

      rca2.load({ metric: data.metric, host: host });
      // rca2.load({ metric: 'nginx.active_connections', host: 'centos24'});
      rca2.loadEvents({ hostname: host, range: { start: range.from.valueOf(), end: range.to.valueOf() } });

      topn.load({ hostname: host, from: range.from.valueOf(), to: range.to.valueOf() });
      topn.setOrderBy(orderBy);

      var targets = [
        {
          "aggregator": "avg",
          "currentTagKey": "",
          "currentTagValue": "",
          "downsampleAggregator": "avg",
          "downsampleInterval": "5m",
          "errors": {},
          "hide": false,
          "isCounter": false,
          "metric": data.metric,
          "refID": "A",
          "shouldComputeRate": false,
          "tags": {
            "host": host
          }
        }
      ];
      var metricsQuery = {
        panelId: 11,
        range: range,
        rangeRaw: range,
        interval: null,
        targets: targets,
        format: 'json',
        maxDataPoints: Math.ceil($(window).width()),
        scopedVars: null,
        cacheTimeout: null
      };
      graph.issueQueries(metricsQuery);
    });
  }

  render() {
    const { rca2, alerting, topn, graph } = this.props;
    const { rcaGraph, affectedSvcsText, rootCauseSvcsText } = rca2;
    const loading = false;

    // hard code: get high topn count
    const threshold = 75;
    let highTopnCount = 0;
    if (topn.orderedTopn[0] > threshold) {
      highTopnCount = 1;
    } else if (topn.orderedTopn[0] + topn.orderedTopn[1] > 75) {
      highTopnCount = 2;
    } else if (topn.orderedTopn[0] + topn.orderedTopn[1] + topn.orderedTopn[2] > 75) {
      highTopnCount = 3;
    }

    const Info = ({ title, value, bordered }) => (
      <div className="headerInfo text-overflow" style={{ width: '100%' }}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const ListContent = ({ data: { desc, solution } }) => (
      <div className="listContent">
        <div className="content-descrption">
          <p className="text-overflow" style={{ width: '100%' }}>
            概述：<span className="description">{desc}</span>
          </p>
        </div>
        <div className="content-solution">
          解决方案：<span className="solution">{solution}</span>
        </div>
        {/* <div className="extra">
          <Avatar src={avatar} size="small" /><a href={href}>{owner}</a> 发布在 <a href={href}>{href}</a>
          <em>{moment(updatedAt).format('YYYY-MM-DD HH:mm')}</em>
        </div> */}
      </div>
    );

    const topnUrl = `/topn?guide&metric=${alerting.detail.metric}&host=${alerting.detail.monitoredEntity}&start=${alerting.detail.alertTime}`;
    const correlationUrl = `/association?guide&metric=${alerting.detail.metric}&host=${alerting.detail.monitoredEntity}&start=${alerting.detail.alertTime}`;

    return (
      <div>
        {/* <DashboardGrid getPanelContainer={{}}></DashboardGrid> */}
        <Card bordered={false} className="rca-summary" style={{ marginBottom: 16 }}>
          <Row>
            <Col sm={8} xs={24}>
              <Info title="报警发生可能会影响的服务" value={affectedSvcsText} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="可能引起报警的原因" value={rootCauseSvcsText} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="高消耗进程" value={`${highTopnCount}个`} bordered={false} />
            </Col>
          </Row>
        </Card>

        <Card bordered={false}
          bodyStyle={{ padding: 0 }}
          title="报警指标及事件"
          style={{ marginBottom: 16 }}
          extra={<a href={correlationUrl}>进行关联分析</a>}
        >
          <div className="salesCard">
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div style={{ padding: '24px' }}>
                  <Graph data={graph.data} options={{}} range={{ from: moment().add(-1, 'day'), to  : moment() }} annotations={rca2.annotations} thresholds={[]} />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className="eventsRank">
                  <h4 className="rankingTitle"></h4>
                  <div className="rankingList">
                    {rca2.events.map((item, i) => (
                      <Row key={i}>
                        <Col span={3}>
                          <span className={i < 3 ? 'active label' : 'label'}>{i + 1}</span>
                        </Col>
                        <Col span={7}>
                          <span>{item.service}</span>
                        </Col>
                        <Col span={7}>
                          <span>{item.type}</span>
                        </Col>
                        <Col span={7}>
                          <span>{item.time}</span>
                        </Col>
                      </Row>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {
          toJS(rca2.rcaGraph) ?
          <Row gutter={24}>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <Card bordered={false} title="故障拓扑图">
                <Dependency data={rca2.rcaGraph}></Dependency>
              </Card>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <Card
                bordered={false}
                title="资源消耗"
                extra={<a href={topnUrl}>更多</a>}
              >
                <List
                  rowKey="id"
                  // loading={loading}
                  dataSource={topn.highTopn}
                  renderItem={(item, i) => (
                    <div className="rca-topn-item rankingList">
                      <Row>
                        <p key={i} className="text-overflow" style={{ width: '100%' }}>
                          <span className={i < 3 ? 'active label' : 'label'}>{i + 1}</span>
                          <span className="ant-card-meta-title">{item.name}</span>
                          {/* <span style={{ marginLeft: 30 }}>{item.command}</span> */}
                        </p>
                      </Row>
                      <Row>
                        <Col span={6}>
                          <Info title="CPU 使用率" value={_.percentFormatter(item.cpuPercent)} bordered={false} />
                        </Col>
                        <Col span={6}>
                          <Info title="内存使用率" value={_.percentFormatter(item.memPercent)} bordered={false} />
                        </Col>
                        <Col span={6}>
                          <Info title="读硬盘次数" value={_.valueFormats.Bps(item.disk_io_read)} bordered={false} />
                        </Col>
                        <Col span={6}>
                          <Info title="写硬盘次数" value={_.valueFormats.Bps(item.disk_io_write)} bordered={false} />
                        </Col>
                      </Row>
                    </div>
                  )}
                />
              </Card>
            </Col>
          </Row>
          :
          <Card
            bordered={false}
            title="资源消耗"
            extra={<a href={topnUrl}>更多</a>}
          >
            <List
              rowKey="id"
              // loading={loading}
              dataSource={topn.highTopn}
              renderItem={(item, i) => (
                <div className="rca-topn-item rankingList">
                  <Row>
                    <p key={i} className="text-overflow" style={{ width: '100%' }}>
                      <span className={i < 3 ? 'active label' : 'label'}>{i + 1}</span>
                      <span className="ant-card-meta-title">{item.name}</span>
                      {/* <span style={{ marginLeft: 30 }}>{item.command}</span> */}
                    </p>
                  </Row>
                  <Row>
                    <Col span={2}>
                      <Info title="进程 ID" value={item.pid} bordered={false} />
                    </Col>
                    <Col span={4}>
                      <Info title="CPU 使用率" value={_.percentFormatter(item.cpuPercent)} bordered={false} />
                    </Col>
                    <Col span={4}>
                      <Info title="内存使用率" value={_.percentFormatter(item.memPercent)} bordered={false} />
                    </Col>
                    <Col span={4}>
                      <Info title="读硬盘次数" value={_.valueFormats.Bps(item.disk_io_read)} bordered={false} />
                    </Col>
                    <Col span={4}>
                      <Info title="写硬盘次数" value={_.valueFormats.Bps(item.disk_io_write)} bordered={false} />
                    </Col>
                    <Col span={6}>
                      <Info title="命令" value={item.command} bordered={false} />
                    </Col>
                  </Row>
                </div>
              )}
            />
          </Card>
        }

        <Card
          title="故障推荐方案"
          style={{ marginTop: 16 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            rowKey="id"
            itemLayout="vertical"
            dataSource={rca2.suggested}
            renderItem={item => (
              <List.Item
                key={item.id}
                // actions={[
                //   <IconText type="star-o" text={item.star} />,
                //   <IconText type="like-o" text={item.like} />,
                //   <IconText type="message" text={item.message} />,
                // ]}
                extra={<div className="listItemExtra" />}
              >
                <List.Item.Meta
                  title={(
                    <a className="listItemMetaTitle" href={item.href}>{item.name}</a>
                  )}
                  description={
                    <span>
                      <Tag>{item.nodeType}</Tag>
                    </span>
                  }
                />
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </div>
    )
  }
}
