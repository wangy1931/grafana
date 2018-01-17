import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import { coreModule } from 'app/core/core';
import 'app/plugins/datasource/opentsdb/queryCtrl';

export class AlertEditCtrl {
  // datasource: any;
  current: any;
  target: any;
  errors: any;
  isNew: any;
  oldTarget: any;
  editForm: any;
  addTagMode: boolean;
  expression: any = ">";
  metricExpression: any;
  alertTypeRange: Array<any>;
  alertTypeSelected: any;
  logType: string;
  logAggregator: string = "SUM";
  logQueries: Array<any> = [{
    key: "",
    keyType: "",
    condition: ""
  }];
  logQueriesOutput: string;
  servicelist: Array<any>;
  metricQueries: Array<any>;
  private prefix: string;
  private opentsdbUrl: string;
  private state: any = {
    SINGLE_ALERT: { value: "SINGLE_ALERT", ref: "alertSingleQuery" },
    MUTI_ALERT: { value: "MUTI_ALERT", ref: "alertMutiQuery" },
    LOG_ALERT: { value: "LOG_ALERT", ref: "alertLogQuery" }
  }
  private currentState: string;

  private alertDef: any = {
    org: "",
    service: "",
    name: "",
    description: "",
    alertDetails: {
      cluster: "cluster1",
      hosts: null,
      membership: "*",
      monitoringScope: "HOST",
      clusterwideAggregator: "AVG",
      tags: [],
      crit: {
        durarionMinutes: "",
        threshold: ""
      },
      warn: {
        durarionMinutes: "",
        threshold: ""
      }
    }
  };

  private alertLogQuery: any = {
    alertType: "LOG_ALERT",
    alertLogQuery: {
      aggregator: "SUM",
      expression: ">",
      logQueries: [  //日志类型 _TYPE只能有一个 
        {
          "key": "",
          "keyType": "_TYPE", //"_TYPE" or "MESSAGE" or "HOST"
          "condition": "AND"  //"OR" or "AND" or "NOT"
        }
      ]
    }
  };

  private alertSingleQuery: any = {
    alertType: "SINGLE_ALERT",
    alertSingleQuery: {
      expression: ">",
      metricQueries: [
        {
          "metric": "",
          "aggregator": "AVG",
          "transform": null,
          "fillPolicy": {
            "policy": "nan",
            "value": "NaN"
          },
          "filter": "f1"
        }
      ]
    }
  };

  private alertMutiQuery: any = {
    alertType: "MUTI_ALERT",
    alertMutiQuery: {
      expression: ">", // '>' or '>;(a+b)'
      metricQueries: [
        {
          "id": "a",
          "metric": "",
          "aggregator": "AVG",
          "transform": null,
          "fillPolicy": {
            "policy": "nan",
            "value": "NaN"
          },
          "filter": "f1"
        },
      ],
      filters: [
        {
          tags: [{ "type": "WILDCARD", "tagk": "host", "filter": "*", "groupBy": true }],
          id : "f1"
        }
      ],
    }
  };

  private panelMeta: any = {
    "collapse": false,
    "editable": false,
    "height": "260px",
    "panels": [
      {
        "aliasColors": {
          "test_health": "#EAB839"
        },
        "bars": false,
        "datasource": null,
        "editable": true,
        "error": false,
        "fill": 0,
        "id": 2,
        "lines": true,
        "linewidth": 2,
        "nullPointMode": "connected",
        "percentage": false,
        "renderer": "flot",
        "seriesOverrides": [],
        "span": 12,
        "stack": false,
        "steppedLine": false,
        "targets": [{
          "aggregator": "",
          "currentTagKey": "",
          "currentTagValue": "",
          "downsampleAggregator": "avg",
          "downsampleInterval": "5m",
          "errors": {},
          "hide": false,
          "isCounter": false,
          "metric": "",
          "shouldComputeRate": false,
          "tags": { "host": "*" }
        }],
        "grid": {
            "threshold1": "",
            "threshold1Color": "rgba(251, 0, 0, 0.57)",
            "threshold2": "" ,
            "threshold2Color": "rgba(216, 169, 27, 0.61)",
            "thresholdLine": true
        },
        "tooltip": {
          "shared": true,
          "value_type": "cumulative"
        },
        "type": "graph",
        "x-axis": true,
        "y-axis": true,
        "y_formats": [
          "short",
          "short"
        ],
        "transparent": false,
        "thresholds": []
      }
    ],
    "showTitle": false,
    "title": "New row"
  };

  private logPanel: any = {
    "collapse": false,
    "editable": false,
    "height": "260px",
    "panels": [
      {
        "aliasColors": {},
        "bars": true,
        "datasource": "elk",
        "editable": true,
        "error": false,
        "fill": 1,
        "grid": {
          "leftLogBase": 1,
          "leftMax": null,
          "leftMin": null,
          "rightLogBase": 1,
          "rightMax": null,
          "rightMin": null,
          "threshold1": null,
          "threshold1Color": "rgba(216, 200, 27, 0.27)",
          "threshold2": null,
          "threshold2Color": "rgba(234, 112, 112, 0.22)"
        },
        "id": 4,
        "legend": {
          "avg": false,
          "current": false,
          "max": false,
          "min": false,
          "show": false,
          "total": false,
          "values": false
        },
        "lines": false,
        "linewidth": 2,
        "nullPointMode": "connected",
        "percentage": false,
        "pointradius": 5,
        "points": false,
        "renderer": "flot",
        "seriesOverrides": [],
        "span": 12,
        "stack": false,
        "steppedLine": false,
        "targets": [
          {
            "aggregator": "sum",
            "bucketAggs": [
              {
                "field": "@timestamp",
                "id": "2",
                "settings": {
                  "interval": "auto",
                  "min_doc_count": 0
                },
                "type": "date_histogram"
              }
            ],
            "downsampleAggregator": "avg",
            "dsType": "elasticsearch",
            "errors": {},
            "metric": "internal.alert.state",
            "metrics": [
              {
                "field": "select field",
                "id": "1",
                "type": "count"
              }
            ],
            "query": "",
            "refId": "A",
            "timeField": "@timestamp"
          }
        ],
        "timeFrom": null,
        "timeShift": null,
        "title": "日志总数",
        "tooltip": {
          "shared": true,
          "value_type": "cumulative"
        },
        "transparent": true,
        "type": "graph",
        "x-axis": true,
        "y-axis": true,
        "y_formats": [
          "short",
          "short"
        ],
        "links": [],
        "helpInfo": {
          "info": false,
          "title": "",
          "context": ""
        }
      }
    ],
    "showTitle": false,
    "title": "New row"
  };

  /** @ngInject */
  constructor (
    private $scope, private $routeParams, private $controller, private $location,
    private $timeout, private $rootScope,
    private alertMgrSrv, private alertSrv, private contextSrv, private datasourceSrv,
    private backendSrv, private timeSrv
  ) {
    $controller('OpenTSDBQueryCtrl', { $scope: $scope });
    datasourceSrv.get('opentsdb').then(datasource => {
      $scope.datasource = datasource;
      this.opentsdbUrl = datasource.url;
    });
    this.prefix = contextSrv.user.orgId + "." + contextSrv.user.systemId + ".";

    this.current = { name: '', status: true };
    this.target = { tags: {} };
    this.errors = this.validateTarget();

    this.alertTypeRange = [
      { 'name': '指标', 'value': 'metric', 'ref': 'METRIC_ALERT' },
      { 'name': '日志', 'value': 'log', 'ref': 'LOG_ALERT' }
    ];

    // new or modify
    var alertDef = alertMgrSrv.get($routeParams.id);
    this.isNew = !alertDef;

    this.currentState = (alertDef && alertDef.alertDetails.alertType) || this.state.SINGLE_ALERT.value;

    const index = this.currentState === this.state.LOG_ALERT.value ? 1 : 0;
    this.alertTypeSelected = this.alertTypeRange[index];

    if (this.isNew) {
      this.alertDef.org = contextSrv.user.orgId;
      this.alertDef.service = contextSrv.user.systemId;
      this.alertDef.alertDetails.alertSingleQuery
      _.each(this.state, (obj, key) => {
        _.extend(this.alertDef.alertDetails, this[obj.ref]);
      });
    } else {
      this.alertDef = alertDef;
      // TO FIX
      this.alertDef.alertDetails.hosts = this.alertDef.alertDetails.hosts ? this.alertDef.alertDetails.hosts.toString() : null;

      // transform query expression
      if (this.currentState === 'MUTI_ALERT') {
        var expression = this.alertDef.alertDetails.alertMutiQuery.expression.split(';');
        this.expression = expression[0];
        this.metricExpression = expression[1].substring(1, expression[1].length - 1);
      } else {
        this.expression = this.alertDef.alertDetails[this.state[this.currentState].ref].expression;
      }

      this.current = { name: this.alertDef.name, status: false }

      // set dashboard threshold
      this.setCritThreshold(this.panelMeta, this.alertDef);
      this.setWarnThreshold(this.panelMeta, this.alertDef);
    }

    if (this.currentState === 'LOG_ALERT') {
      this.logType = this.alertDef.alertDetails.alertLogQuery.logQueries[0].key;
      this.logQueries = this.alertDef.alertDetails.alertLogQuery.logQueries.slice(1);
    } else {
      this.metricQueries = this.alertDef.alertDetails[this.state[this.currentState].ref].metricQueries;
    }

    $rootScope.onAppEvent('time-range-changed', this.refreshPreview.bind(this), $scope);
    $scope.$watchCollection('ctrl.metricQueries', (newValue, oldValue) => {
      if (_.isEmpty(newValue)) { return; }
      if (_.isEqual(newValue, oldValue)) { return; }

      this.currentState = newValue.length > 1 ? this.state.MUTI_ALERT.value : this.state.SINGLE_ALERT.value;
      this.refreshPreview();
    });
  }

  init() {
    this.$scope.initDashboard({
      meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
      dashboard: {
        title: "报警预览",
        id: "name",
        rows: [_.cloneDeep(this.panelMeta)],
        time: { from: "now-12h", to: "now" }
      }
    }, this.$scope);

    this.$timeout(this.refreshPreview.bind(this), 200);
  }

  // Part1: 报警基本信息
  checkName() {
    if (this.current.name === this.alertDef.name) {
      this.current.status = false;
    } else {
      this.alertMgrSrv.checkName(this.alertDef.name).then(response => {
        if (response.data.exist) {
          this.alertSrv.set("已存在该报警", "请修改报警名称", "error", 5000);
        }
      });
    }
  }

  // Part2: 报警内容设置
  changeAlertType(alertType) {
    if (alertType.value === 'metric') {
      this.currentState = this.metricQueries.length > 1 ? this.state.MUTI_ALERT.value : this.state.SINGLE_ALERT.value;
      this.$scope.dashboard.rows[0] = _.cloneDeep(this.panelMeta);
      this.refreshPreview();
    }
    if (alertType.value === 'log') {
      this.currentState = 'LOG_ALERT';
      _.isEmpty(this.servicelist) && this.backendSrv.alertD({url: '/cmdb/service'}).then((response) => {
        this.servicelist = _.map(response.data, 'name');
      });
    }
  }
  addMetricQuery() {
    this.metricQueries[0] && (this.metricQueries[0].id = "a");
    var newId = String.fromCharCode(97 + this.metricQueries.length);
    if (newId > 'z') { return; }

    // alert rule
    var metricQueryTemp = {
      "id": newId,
      "metric": "",
      "aggregator": "AVG",
      "transform": null,
      "fillPolicy": {
        "policy": "nan",
        "value": "NaN"
      },
      "filter": "f1"
    };
    this.metricQueries.push(metricQueryTemp);
  }
  removeMetricQuery(metricDef) {
    _.remove(this.metricQueries, metricDef);
  }
  addLogQuery() {
    this.logQueries.push({
      "key": "",
      "keyType": "message",
      "condition": "AND"
    });
  }
  removeLogQuery(logDef) {
    _.remove(this.logQueries, logDef);
    this.refreshPreview();
  }

  // Part3: 报警条件设置
  addTags() {
    if (!this.addTagMode) {
      this.addTagMode = true;
      return;
    }

    if (!this.target.tags) {
      this.target.tags = {};
    }

    this.errors = this.validateTarget();

    if (!this.errors.tags) {
      this.target.tags[this.target.currentTagKey] = this.target.currentTagValue;
      this.target.currentTagKey = '';
      this.target.currentTagValue = '';
      this.targetBlur();
    }

    this.addTagMode = false;
  }

  closeAddTagMode() {
    this.addTagMode = false;
    return;
  }

  editTag(key, value) {
    this.removeTag(key);
    this.target.currentTagKey = key;
    this.target.currentTagValue = value;
    this.addTags();
  }

  removeTag(key) {
    delete this.target.tags[key];
    this.targetBlur();
  }

  targetBlur() {
    this.errors = this.validateTarget();

    if (!_.isEqual(this.oldTarget, this.target) && _.isEmpty(this.errors)) {
      this.oldTarget = angular.copy(this.target);
      this.$scope.dashboard.rows[0].panels[0].targets[0].tags = this.target.tags;
      this.$scope.broadcastRefresh();
    }
  }

  validateTarget() {
    var errs: any = {};

    if (this.target.tags && _.has(this.target.tags, this.target.currentTagKey)) {
      errs.tags = "Duplicate tag key '" + this.target.currentTagKey + "'.";
    }
    return errs;
  }

  // Part4: 报警 dashboard
  refreshPreview(time?) {
    // when multi metrics, need expression
    if ((this.currentState === 'MUTI_ALERT') && this.metricExpression) {
      // get dahsboard time
      var timeFrom = this.$scope.dashboard ? moment(this.timeSrv.timeRange(true).from).valueOf() : '12h-ago';
      var timeTo = this.$scope.dashboard ? moment(this.timeSrv.timeRange(true).to).valueOf() : 'now';
      // handle metric name with prefix
      var metrics = angular.copy(this.metricQueries);
      metrics.forEach(metric => {
        metric.metric = this.prefix + metric.metric;
        metric.aggregator = metric.aggregator.toLowerCase();
      });

      var query = {
        timeRange: { from: timeFrom, to: timeTo },
        metrics: metrics,
        metricExpression: this.metricExpression
      };

      this.backendSrv.getOpentsdbExpressionQuery(query, this.opentsdbUrl).then(response => {
        // transform response's data structure
        var handledData = this.transformResponseData(response.data.outputs[0]);
        this.$scope.dashboard.rows[0].panels[0].externalDatasource = {data: handledData};
        this.$scope.broadcastRefresh();
      }, err => this.appEventError);
    }

    // when single metrics, set panel's externalDatasource to be null
    if (this.currentState === 'SINGLE_ALERT') {
      // when time exists, timeSrv will execute broadcastRefresh
      if (time) { return; }
      this.$scope.dashboard.rows[0].panels[0].externalDatasource = null;
      this.setDashboardTarget(this.$scope.dashboard.rows[0], this.alertDef);
      this.$scope.broadcastRefresh();
    }

    // when log alert, ...
    if (this.currentState === 'LOG_ALERT') {
      this.logQueriesOutput = `type: ${this.logType} `;
      this.logQueries.forEach(query => {
        this.logQueriesOutput += `${query.condition} ${query.keyType.toLowerCase()}: ${query.key} `;
      });
    }
  }

  refreshLogPreview() {
    this.logPanel.panels[0].targets[0].query = this.logQueriesOutput;
    this.$scope.dashboard.rows[0] = this.logPanel;
    this.$scope.broadcastRefresh();
  }

  transformResponseData(data) {
    var newData = [];
    data.dps.forEach((dp, dpIndex) => {
      var timestamp;
      dp.forEach((item, itemIndex) => {
        // index === 0 => timestamp
        if (itemIndex === 0) {
          timestamp = item;
        } else {
          if (!newData[itemIndex]) {
            // remove metric name prefix
            data.meta[itemIndex].metrics.forEach((metric, i) => {
              data.meta[itemIndex].metrics[i] = _.getMetricName(metric);
            });
            var tagString = '';
            _.each(data.meta[itemIndex].commonTags, (value, key) => {
              tagString += `{${key}=${value}}`;
            });

            newData.push({
              target: `Exp(${data.meta[itemIndex].metrics.join(',')})${tagString}`,  // `${data.meta[itemIndex].metrics.join(',')}${tagString}`,
              datapoints: [[item, timestamp]]
            });
          } else {
            newData[itemIndex].datapoints.push([item, timestamp]);
          }
        }
      })
    });

    return newData;
  }

  setDashboardTarget(row, detail) {
    detail.alertDetails[this.state[this.currentState].ref].metricQueries.forEach((metricDef, i) => {
      row.panels[0].targets[i].aggregator && (row.panels[0].targets[i].aggregator = metricDef.aggregator.toLowerCase());
      row.panels[0].targets[i].metric = metricDef.metric;
    });
    (detail.alertDetails.tags || (detail.alertDetails.tags = [])).forEach(tag => {
      row.panels[0].targets[0].tags[tag.name] = tag.value;
      this.target.tags[tag.name] = tag.value;
    });
  }

  addThreshold(type) {
    if (type) {
      this.updateThreshold(this.$scope.dashboard.rows[0].panels[0], Number(this.alertDef.alertDetails.crit.threshold), 'critical', 'value');
    } else {
      this.updateThreshold(this.$scope.dashboard.rows[0].panels[0], Number(this.alertDef.alertDetails.warn.threshold), 'warning', 'value');
    }
    this.$scope.$broadcast('render');
  }

  addThresholdOp() {
    if (this.expression === '?') {
      // set threshold in alert definition
      this.alertDef.alertDetails.crit.threshold = 0;
      this.alertDef.alertDetails.warn.threshold = 0;
      this.addThreshold(0);
      this.addThreshold(1);
    } else {
      var value = _.escape(this.expression).replace(/^&|;$/gi, '');
      this.updateThreshold(this.$scope.dashboard.rows[0].panels[0], value, 'critical', 'op');
      this.updateThreshold(this.$scope.dashboard.rows[0].panels[0], value, 'warning', 'op');
      this.$scope.$broadcast('render');
    }
  }

  updateThreshold(panel, value, filterItem, type) {
    var defaults = {
      value: null,
      colorMode: filterItem,
      op: 'gt',
      fill: true,
      line: true
    };
    var thresholdVal = value;
    var threshold = _.find(panel.thresholds, { 'colorMode': filterItem });

    // special code: value === 0, threshold line should not exist
    (value === 0) && (defaults.value = null);

    threshold ? (threshold[type] = thresholdVal)
              : (((defaults[type] = thresholdVal) && panel.thresholds.push(defaults)));
  }

  setCritThreshold(panel, detail) {
    if (detail.alertDetails.crit.threshold) {
      var thresholdVal = Number(detail.alertDetails.crit.threshold);
      this.updateThreshold(panel.panels[0], thresholdVal, 'critical', 'value');

      var value = _.escape(detail.alertDetails[this.state[this.currentState].ref].expression).replace(/^&|;$/gi, '');
      this.updateThreshold(panel.panels[0], value, 'critical', 'op');
    }
  }

  setWarnThreshold(panel, detail) {
    if (detail.alertDetails.warn.threshold) {
      var thresholdVal = Number(detail.alertDetails.warn.threshold);
      this.updateThreshold(panel.panels[0], thresholdVal, 'warning', 'value');

      var value = _.escape(detail.alertDetails[this.state[this.currentState].ref].expression).replace(/^&|;$/gi, '');
      this.updateThreshold(panel.panels[0], value, 'warning', 'op');
    }
  }

  // Part5: 保存 or 更新
  saveChanges() {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
      return;
    }
    if (!this.editForm.$valid) {
      this.appEventInvalid();
      return;
    }
    if (this.currentState === 'LOG_ALERT') {
      if (!this.logType || !this.logAggregator || !this.logQueries.length) {
        this.appEventInvalid();
        return;
      }
    } else {
      if (this.metricQueries.length === 0) {
        this.appEventInvalid();
        return;
      }
    }

    var milliseconds = (new Date).getTime();

    // if it is new, we need to fill in some hard-coded value for now.
    this.isNew && (this.alertDef.creationTime = milliseconds);
    this.alertDef.modificationTime = milliseconds;

    // set metricExpression
    this.alertDef.alertDetails.alertType = this.currentState;
    this.alertDef.alertDetails[this.state[this.currentState].ref].expression = this.expression;

    if (this.currentState === 'SINGLE_ALERT') {
      this.alertDef.alertDetails.clusterwideAggregator = null;
      this.alertDef.alertDetails[this.state[this.currentState].ref].metricQueries = this.metricQueries;
    }
    if (this.currentState === 'MUTI_ALERT') {
      if (!this.metricExpression) {
        this.appEventInvalid();
        return;
      }
      this.alertDef.alertDetails[this.state[this.currentState].ref].expression += `;(${this.metricExpression})`;
      this.alertDef.alertDetails[this.state[this.currentState].ref].metricQueries = this.metricQueries;
    }
    if (this.currentState === 'LOG_ALERT') {
      var logQueries = [{
        keyType: "_TYPE",
        key: this.logType,
        condition: "AND"
      }].concat(this.logQueries);
      this.alertDef.alertDetails.alertLogQuery.logQueries = logQueries;
    }

    // get tags
    this.alertDef.alertDetails.tags = [];
    for (var i in this.target.tags) {
      this.alertDef.alertDetails.tags.push({
        name: i,
        value: this.target.tags[i]
      });
    }

    if (this.alertDef.alertDetails.hosts) {
      _.replace(this.alertDef.alertDetails.hosts, ';', ',');
      this.alertDef.alertDetails.hosts = this.alertDef.alertDetails.hosts.split(',');
    }

    console.log(this.alertDef);

    this.alertMgrSrv.save(this.alertDef).then(() => {
      this.$location.path("alerts");
    }, err => this.appEventError);
  }

  appEventInvalid() {
    this.alertSrv.set("信息不完整或信息格式错误", '请检查报警信息', 'warning', 2000);
  }

  appEventError(err) {
    this.alertSrv.set("error", err.status + " " + (err.data || "Request failed"), err.severity, 10000);
  }

}

coreModule.controller('AlertEditCtrl', AlertEditCtrl);
