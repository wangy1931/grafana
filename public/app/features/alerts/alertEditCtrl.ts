import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import { coreModule } from 'app/core/core';
import 'app/plugins/datasource/opentsdb/queryCtrl';

export class AlertEditCtrl {
  // datasource: any;
  current: any;
  alertDef: any;
  target: any;
  errors: any;
  isNew: any;
  oldTarget: any;
  editForm: any;
  addTagMode: boolean;
  metricExpression: any;
  private prefix: string;
  private opentsdbUrl: string;

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

    // new or modify
    this.alertDef = alertMgrSrv.get($routeParams.id);
    this.isNew = !this.alertDef;

    if (this.isNew) {
      this.alertDef = {
        org: contextSrv.user.orgId,
        service: contextSrv.user.systemId,
        name: "",
        description: "",
        alertDetails: {
          alertType: "SIGLE_ALERT", // alert: SIGLE_ALERT | MUTI_ALERT
          cluster: "cluster1",
          hosts: null,
          membership: "*",
          monitoringScope: "HOST",
          clusterwideAggregator: "AVG",
          filters: [
            {
              tags: [{ "type": "WILDCARD", "tagk": "host", "filter": "*", "groupBy": true }],
              id : "f1"
            }
          ],
          hostQuery: {
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
            ]
          },
          tags: [],
          crit: {
            durarionMinutes: "",
            threshold: ""
          },
          warn: {
            durarionMinutes: "",
            threshold: ""
          }
        },
      };
    } else {
      // transform query expression
      if (this.alertDef.alertDetails.alertType === 'MUTI_ALERT') {
        var expression = this.alertDef.alertDetails.hostQuery.expression.split(';');
        this.alertDef.alertDetails.hostQuery.expression = expression[0];
        this.metricExpression = expression[1].substring(1, expression[1].length - 1);
      }

      this.alertDef.alertDetails.hosts = this.alertDef.alertDetails.hosts ? this.alertDef.alertDetails.hosts.toString() : null;

      this.current = {
        name: this.alertDef.name,
        status: false
      }

      // set dashboard threshold
      this.setCritThreshold(this.panelMeta, this.alertDef);
      this.setWarnThreshold(this.panelMeta, this.alertDef);
    }

    $rootScope.onAppEvent('time-range-changed', this.refreshPreview.bind(this), $scope);
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

  // Part2: 报警指标设置
  convertDataToQuery() {
    // handle metric name with prefix
    var metrics = angular.copy(this.alertDef.alertDetails.hostQuery.metricQueries);
    metrics.forEach(metric => {
      metric.metric = this.prefix + metric.metric;
      metric.aggregator = metric.aggregator.toLowerCase();
    });
    // get dahsboard time
    var time = this.$scope.dashboard ? moment(this.timeSrv.timeRange(true).from).valueOf() : '12h-ago';

    var tmpl = {
      "time": {
        "start": time,
        "aggregator": "sum",
        "downsampler": {
          "interval": "5m",
          "aggregator": "avg"
        }
      },
      "filters": [
        {
          "tags": [
            {
              "type": "wildcard",
              "tagk": "host",
              "filter": "*",
              "groupBy": true
            }
          ],
          "id": "f1"
        }
      ],
      "metrics": metrics,
      "expressions": [
        {
          "id": "e",
          "expr": this.metricExpression, // "a + b"
          "join": {
            "operator": "intersection",
            "useQueryTags": true,
            "includeAggTags": false
          }
        }
      ],
      "outputs": [
        { "id": "e", "alias": "Mega expression" }
      ]
    };
    return tmpl;
  }

  addMetricQuery() {
    var newId = String.fromCharCode(97 + this.alertDef.alertDetails.hostQuery.metricQueries.length);
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
    this.alertDef.alertDetails.hostQuery.metricQueries.push(metricQueryTemp);
  }

  removeMetricQuery(metricDef) {
    _.remove(this.alertDef.alertDetails.hostQuery.metricQueries, metricDef);
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
    if ((this.alertDef.alertDetails.hostQuery.metricQueries.length > 1) && this.metricExpression) {
      var data = this.convertDataToQuery();
      this.backendSrv.datasourceRequest({
        method: 'POST',
        url: this.opentsdbUrl + '/api/query/exp',
        data: data
      }).then(response => {
        // transform response's data structure
        var handledData = this.transformResponseData(response.data.outputs[0]);
        this.$scope.dashboard.rows[0].panels[0].externalDatasource = {data: handledData};
        this.$scope.broadcastRefresh();
      }, err => this.appEventError);
    }

    // when single metrics, set panel's externalDatasource to be null
    if (this.alertDef.alertDetails.hostQuery.metricQueries.length === 1) {
      // when time exists, timeSrv will execute broadcastRefresh
      if (time) { return; }
      this.$scope.dashboard.rows[0].panels[0].externalDatasource = null;
      this.setDashboardTarget(this.$scope.dashboard.rows[0], this.alertDef);
      this.$scope.broadcastRefresh();
    }
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
              target: `${data.meta[itemIndex].metrics.join(',')}${tagString}`,
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
    detail.alertDetails.hostQuery.metricQueries.forEach((metricDef, i) => {
      row.panels[0].targets[i].aggregator && (row.panels[0].targets[i].aggregator = metricDef.aggregator.toLowerCase());
      row.panels[0].targets[i].metric = metricDef.metric;
    });
    detail.alertDetails.tags.forEach(tag => {
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
    if (this.alertDef.alertDetails.hostQuery.expression === '?') {
      this.addThreshold(0);
      this.addThreshold(1);

      // set threshold in alert definition
      this.alertDef.alertDetails.crit.threshold = 0;
      this.alertDef.alertDetails.warn.threshold = 0;
    } else {
      var value = _.escape(this.alertDef.alertDetails.hostQuery.expression).replace(/^&|;$/gi, '');
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

      var value = _.escape(detail.alertDetails.hostQuery.expression).replace(/^&|;$/gi, '');
      this.updateThreshold(panel.panels[0], value, 'critical', 'op');
    }
  }

  setWarnThreshold(panel, detail) {
    if (detail.alertDetails.warn.threshold) {
      var thresholdVal = Number(detail.alertDetails.warn.threshold);
      this.updateThreshold(panel.panels[0], thresholdVal, 'warning', 'value');

      var value = _.escape(detail.alertDetails.hostQuery.expression).replace(/^&|;$/gi, '');
      this.updateThreshold(panel.panels[0], value, 'warning', 'op');
    }
  }

  // Part5: 保存 or 更新
  saveChanges() {
    var metricQueries = this.alertDef.alertDetails.hostQuery.metricQueries;
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
      return;
    }
    if (!this.editForm.$valid || metricQueries.length === 0) {
      this.appEventInvalid();
      return;
    }

    var milliseconds = (new Date).getTime();

    // if it is new, we need to fill in some hard-coded value for now.
    this.isNew && (this.alertDef.creationTime = milliseconds);
    this.alertDef.modificationTime = milliseconds;

    // set metricExpression
    if (metricQueries.length > 1) {
      if (!this.metricExpression) {
        this.appEventInvalid();
        return;
      }
      this.alertDef.alertDetails.alertType = 'MUTI_ALERT';
      this.alertDef.alertDetails.hostQuery.expression += `;(${this.metricExpression})`;
    } else {
      this.alertDef.alertDetails.alertType = 'SIGLE_ALERT';
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
