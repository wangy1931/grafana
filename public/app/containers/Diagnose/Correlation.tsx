import $ from 'jquery';
import moment from 'moment';
import React from 'react';
import { Row, Col, Card } from 'antd';
import Graph from 'app/core/components/Charts/Graph/index';
import { inject, observer } from 'mobx-react';
import IContainerProps from 'app/containers/IContainerProps';
import TreeMenu from './TreeMenu';
import createTreeMenu from './tree';
//import { DashboardGrid } from 'app/features/dashboard/dashgrid/DashboardGrid';

const treeData = {
  "Cpu" : {
    "2.2.cpu.usr" : {
      "hosts" : [ "centos24" ]
    }
  }
};

const treeData2 = [
  {
    name: "Cpu",
    child: [
      {
        name: "2.2.cpu.usr",
        child: ["centos24", "centos25"]
      }
    ]
  }
];

const dashboard = {
  "title": "相关联指标",
  "id": 1,
  "rows": [
    {
      "title": "associationGraph",
      "height": "300px",
      "panels": [
        {
          "title": "",
          "error": false,
          "span": 12,
          "id": 1,
          "editable": false,
          "linewidth": 2,
          "height": "500px",
          "type": "graph",
          "targets": [
            {
              "aggregator": "avg",
              "metric": "",
              "downsampleAggregator": "avg",
              "downsampleInterval": "15m",
              "tags": { "host": "" }
            }
          ],
          "y-axis": false,
          "yaxes": [
              {
                  "label": null,
                  "show": false,
                  "logBase": 1,
                  "min": null,
                  "max": null,
                  "format": "short"
              },
              {
                  "label": null,
                  "show": false,
                  "logBase": 1,
                  "min": null,
                  "max": null,
                  "format": "short"
              }
          ],
          "legend": {
            "alignAsTable": true,
            "avg": true,
            "min": true,
            "max": true,
            "current": true,
            "total": true,
            "show": false,
            "values": true
          },
          "grid": {
            "leftLogBase": 1,
            "leftMax": null,
            "leftMin": null,
            "rightLogBase": 1,
            "rightMax": null,
            "rightMin": null,
            "threshold1": "",
            "threshold1Color": "rgba(216, 169, 27, 0.61)",
            "threshold2": "",
            "threshold2Color": "rgba(251, 0, 0, 0.57)",
            "thresholdLine": true
          },
          "thresholds": [
            {
              "value": "",
              "colorMode": "critical",
              "op": "gt",
              "fill": false,
              "line": true
            },
            {
              "value": "",
              "colorMode": "warning",
              "op": "gt",
              "fill": false,
              "line": true
            }
          ],
          "downsample": "15m",
          "downsamples": ["1m", "15m"]
        }
      ]
    },
    {
      "title": "serviceEvents",
      "height": "150px",
      "collapse": false,
      "showTitle": true,
      "panels": [
        {}
      ]
    },
    {
      "title": "logs",
      "height": "300px",
      "collapse": true,
      "showTitle": true,
      "panels": [
        {
          "columns": [
            {
              "text": "@timestamp",
              "value": "@timestamp"
            },
            {
              "text": "host",
              "value": "host"
            },
            {
              "text": "_type",
              "value": "_type"
            },
            {
              "text": "message",
              "value": "message"
            }
          ],
          "operator": {
            "hide": true,
            "type": "checkbox"
          },
          "datasource": "elk",
          "editable": true,
          "error": false,
          "fontSize": "100%",
          "height": "500",
          "helpInfo": {
            "context": "",
            "info": false,
            "title": ""
          },
          "hideTimeOverride": false,
          "id": "logSearch",
          "isNew": true,
          "links": [],
          "pageSize": null,
          "scroll": false,
          "showHeader": true,
          "sort": {
            "col": 0,
            "desc": true
          },
          "span": 12,
          "styles": [
            {
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "pattern": "@timestamp",
              "type": "date"
            },
            {
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "decimals": 2,
              "pattern": "/.*/",
              "thresholds": [],
              "type": "number",
              "unit": "short"
            }
          ],
          "targets": [
            {
              "aggregator": "sum",
              "bucketAggs": [],
              "downsampleAggregator": "avg",
              "dsType": "elasticsearch",
              "errors": {},
              "query": "",
              "metrics": [
                {
                  "field": "select field",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "raw_document"
                }
              ],
              "refId": "A",
              "timeField": "@timestamp"
            }
          ],
          "tab": 1,
          "title": "$TABLOG",
          "transform": "json",
          "transparent": false,
          "type": "cwtable"
        },
        {
          "columns": [
            {
              "text": "count",
              "value": "count"
            },
            {
              "text": "message",
              "value": "message"
            }
          ],
          "operator": {
            "hide": true,
            "type": "expand"
          },
          "datasource": "elk",
          "editable": true,
          "error": false,
          "fontSize": "100%",
          "height": "500",
          "helpInfo": {
            "context": "",
            "info": false,
            "title": ""
          },
          "hideTimeOverride": false,
          "id": "logCluster",
          "isNew": true,
          "links": [],
          "pageSize": null,
          "scroll": false,
          "showHeader": true,
          "sort": {
            "col": 0,
            "desc": true
          },
          "span": 12,
          "styles": [
            {
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "pattern": "@timestamp",
              "type": "date"
            },
            {
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "decimals": 0,
              "pattern": "/.*/",
              "thresholds": [],
              "type": "number",
              "unit": "short"
            }
          ],
          "targets": [
            {
              "aggregator": "sum",
              "bucketAggs": [],
              "downsampleAggregator": "avg",
              "dsType": "elasticsearch",
              "errors": {},
              "query": "",
              "metrics": [
                {
                  "field": "select field",
                  "id": "Math.random()",
                  "meta": {},
                  "settings": {},
                  "type": "raw_document"
                }
              ],
              "refId": "A",
              "timeField": "@timestamp"
            }
          ],
          "title": "$TABCLUSTER",
          "transform": "json",
          "transparent": false,
          "type": "cwtable",
          "tab": 2,
          "scopedVars": {
            "logCluster": true
          }
        },
        {
          "columns": [
            {
              "text": "count",
              "value": "count"
            },
            {
              "text": "change",
              "value": "change"
            },
            {
              "text": "message",
              "value": "message"
            }
          ],
          "operator": {
            "hide": true,
            "type": ""
          },
          "datasource": "elk",
          "editable": true,
          "error": false,
          "fontSize": "100%",
          "helpInfo": {
            "context": "",
            "info": false,
            "title": ""
          },
          "id": "logCompare",
          "isNew": true,
          "links": [],
          "pageSize": null,
          "scroll": false,
          "showHeader": true,
          "sort": {
            "col": 0,
            "desc": true
          },
          "span": 12,
          "styles": [
            {
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "pattern": "Time",
              "type": "date"
            }
          ],
          "targets": [
            {
              "aggregator": "sum",
              "bucketAggs": [],
              "downsampleAggregator": "avg",
              "dsType": "elasticsearch",
              "errors": {},
              "metrics": [
                {
                  "field": "select field",
                  "id": "logCompare1",
                  "meta": {},
                  "settings": {},
                  "type": "raw_document"
                }
              ],
              "query": "",
              "refId": "A",
              "timeField": "@timestamp"
            },
            {
              "bucketAggs": [],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "select field",
                  "id": "logCompare2",
                  "meta": {},
                  "settings": {},
                  "type": "raw_document"
                }
              ],
              "query": "",
              "refId": "B",
              "timeField": "@timestamp",
              "timeShift": "-1d"
            }
          ],
          "tab": 3,
          "title": "$TABCOMPARE",
          "transform": "json",
          "type": "cwtable",
          "scopedVars": {
            "logCompare": true,
            "logFilter": ""
          }
        }
      ]
    }
  ],
  "time": { "from": "now-6h", "to": "now" },
  "manualAnnotation": [],
  "annotations": {
    "list": [
    ]
  }
}

@inject('view', 'graph', 'alerting')
@observer
export class Correlation extends React.Component<IContainerProps, any> {
  constructor(props) {
    super(props);
    this.loadStore();
  }
  dashboard = dashboard;

  loadStore() {
    const { graph, alerting } = this.props;
    const range = {
      from: moment(alerting.detail.levelChangedTime).add(-6, 'hour'),
      to  : moment(alerting.detail.levelChangedTime).add(+6, 'hour')
    };
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
        "metric": alerting.detail.metric,
        "refID": "A",
        "shouldComputeRate": false,
        "tags": {
          "host": alerting.detail.monitoredEntity
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
  }

  onTreeCheck(checkedKeys) {
    console.log(checkedKeys);
  }

  componentDidMount() {
    // var elem = $('<div></div>').appendTo($('#test'));
    // createTreeMenu(elem, null);
    // $('#test').html('<cw-tree-menu></cw-tree-menu>');
  }

  render() {
    const { graph, alerting } = this.props;

    return (
      <div>
        <Card bordered={false} bodyStyle={{ padding: 0 }} title="指标关联" style={{ marginBottom: 16 }}>
          <div className="graph correlation-graph">
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div style={{ padding: '24px' }}>
                  <Graph data={graph.data} options={{}} range={{ from: moment().add(-1, 'day'), to  : moment() }} />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div style={{ padding: '0 24px' }}>
                  <TreeMenu data={treeData2} onTreeCheck={this.onTreeCheck.bind(this)} />
                </div>
              </Col>
            </Row>
          </div>
        </Card>
        <div id="test"></div>
      </div>
    )
  }
}
