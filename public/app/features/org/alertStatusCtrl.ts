///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import moment from 'moment';
import _ from 'lodash';
import coreModule from '../../core/core_module';
import 'app/plugins/datasource/opentsdb/queryCtrl';

export class AlertStatusCtrl {
  annotation_tpl: any = {
    source: {
      datasource: "elk",
      enable: true,
      iconColor: "rgba(19, 21, 19, 0.7)",
      iconSize: 15,
      lineColor: "rgba(255, 96, 96, 0.592157)",
      name: "123",
      query: "*",
      showLine: true,
      textField: "123",
      timeField: ""
    },
    min: 1495032982939,
    max: 1495032982939,
    eventType: "123",
    title: ":",
    tags: "历史报警时间",
    text: "",
    scope: 1
  };
  alertHistoryRange: Array<any>;
  alertTimeSelected: any;
  alertSearch: string;
  alertWarningCount: number;
  alertCriticalCount: number;
  alertRows: Array<any>;
  alertHistory: Array<any>;
  alertStatusShow: boolean;
  prefix: string;
  opentsdbUrl: string;
  alertTypeMap: any;

  /** @ngInject */
  constructor(
    private $scope, private $controller, private $location, private associationSrv, private integrateSrv,
    private alertMgrSrv, private datasourceSrv, private contextSrv, private backendSrv
  ) {
    this.prefix = contextSrv.user.orgId + '.' + contextSrv.user.systemId + '.';
    this.alertHistoryRange = [
      { 'num': 0, 'type': 'now',  'value': '现在', },
      { 'num': 1, 'type': 'days',   'value': '过去一天' },
      { 'num': 1, 'type': 'weeks',  'value': '过去一周' },
      { 'num': 1, 'type': 'months', 'value': '过去一个月' },
      { 'num': 3, 'type': 'months', 'value': '过去三个月' },
    ];
    this.alertTimeSelected = this.alertHistoryRange[0];

    this.alertSearch = '';
    this.alertWarningCount = 0;
    this.alertCriticalCount = 0;

    this.alertTypeMap = {
      LOG_ALERT: "alertLogQuery",
      SINGLE_ALERT: "alertSingleQuery",
      MUTI_ALERT: "alertMutiQuery"
    }

    $scope.$watch('ctrl.$location.search().name', (newValue, oldValue) => {
      if ((newValue === oldValue)) { return; }

      this.getAlertStatus(newValue);
      this.getAlertHistory(this.alertTimeSelected);
    });
  }

  getDataSource() {
    this.$controller('OpenTSDBQueryCtrl', {$scope: this.$scope});
    return this.datasourceSrv.get('opentsdb').then(datasource => {
      this.$scope.datasource = datasource;
      this.opentsdbUrl = datasource.url;
    });
  }

  init() {
    var host = this.$location.search().name;
    this.getAlertStatus(host);
    this.getAlertHistory(this.alertTimeSelected);
  }

  getAlertStatus(host) {
    this.alertMgrSrv.loadTriggeredAlerts({ host: host }).then(response => {
      response.data.forEach(alert => {
        if (alert.status.level === "CRITICAL") {
          this.alertCriticalCount++;
          alert.definition.alertDetails.threshold = alert.definition.alertDetails.crit.threshold;
        } else {
          this.alertWarningCount++;
          alert.definition.alertDetails.threshold = alert.definition.alertDetails.warn.threshold;
        }
        // Only show 2 digits. +0.00001 is to avoid floating point weirdness on rounding number.
        alert.status.triggeredValue = Math.round((alert.status.triggeredValue + 0.00001) * 100) / 100;

        alert = this.handleAlertData(alert);
      });
      this.alertRows = response.data;
      this.getCurrentAlertValue();
    });
  }

  // 处理不同类型下的 metric & alertType
  handleAlertData(alert) {
    if (!alert.definition) { return; }

    alert.type = alert.definition.alertDetails.alertType;
    if (alert.definition.alertDetails.alertType === 'LOG_ALERT') {
      var output = '';
      alert.definition.alertDetails.alertLogQuery.logQueries.forEach((query, i) => {
        if (i === 0) {
          output = `type: ${query.key} `;
        } else {
          output += `${query.condition} ${query.keyType.toLowerCase()}: ${query.key} `;
        }
      });
      alert.metric = output;
    } else {
      !alert.metric && (alert.metric = alert.definition.alertDetails[this.alertTypeMap[alert.type]].metricQueries[0].metric);
    }
    return alert;
  }

  getCurrentAlertValue() {
    this.alertRows.forEach(alertItem => {
      if (alertItem.definition.alertDetails.alertType === 'LOG_ALERT') {
        alertItem.curAlertValue = alertItem.status.triggeredValue;
        return;
      }
      // when multi metrics, need expression
      if (alertItem.definition.alertDetails.alertType === 'MUTI_ALERT') {
        var metrics = angular.copy(alertItem.definition.alertDetails.alertMutiQuery.metricQueries);
        metrics.forEach(metric => {
          metric.metric = this.prefix + metric.metric;
          metric.aggregator = metric.aggregator.toLowerCase();
        });
        let queries = {
          timeRange: { from: '1m-ago', to: null },
          metrics: metrics,
          metricExpression: alertItem.definition.alertDetails.alertMutiQuery.expression.split(';')[1],
          tags: [{
            "type": "iliteral_or",
            "tagk": "host",
            "filter": alertItem.status.monitoredEntity,
            "groupBy": true
          }]
        };

        this.getDataSource().then(() => {
          this.backendSrv.getOpentsdbExpressionQuery(queries, this.opentsdbUrl).then(response => {
            var dps = 0;
            if (!response.data.outputs[0].dps[0] || isNaN(response.data.outputs[0].dps[0][1])) {
              dps = alertItem.status.triggeredValue;
            } else {
              dps = response.data.outputs[0].dps[0][1];
            }
            alertItem.curAlertValue = Math.floor(dps * 1000) / 1000;
          });
        });
      } else {
        var tags = { host: alertItem.status.monitoredEntity };
        alertItem.definition.alertDetails.tags && alertItem.definition.alertDetails.tags.forEach(tag => {
          tags[tag.name] = tag.value
        });

        var queries = [{
          "metric": alertItem.metric,
          "aggregator": alertItem.definition.alertDetails.alertSingleQuery.metricQueries[0].aggregator.toLowerCase(),
          "downsample": "1m-avg",
          "tags": tags
        }];
        this.datasourceSrv.getHostStatus(queries, 'now-2m').then(response => {
          alertItem.curAlertValue = Math.floor(response.status * 1000) / 1000;
          if (isNaN(alertItem.curAlertValue)) { alertItem.curAlertValue = "没有数据"; }
        });
      }
    });
  }

  getAlertHistory(time) {
    var host = this.$location.search().name;
    if (time.type === 'now') {
      this.alertStatusShow = true;
    } else {
      var timestemp = Date.parse(moment().subtract(time.num, time.type));
      this.alertMgrSrv.loadAlertHistory(timestemp, host).then(response => {
        response.data.forEach(alert => {
          alert = this.handleAlertData(alert);
        });
        this.alertHistory = response.data;
      });
      this.alertStatusShow = false;
    }
  }

  // 处理报警
  handleAlert(alertDetail) {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
    } else {
      var newScope = this.$scope.$new();
      newScope.alertData = alertDetail;
      newScope.alertRows = this.alertRows;
      this.$scope.appEvent('show-modal', {
        src: 'public/app/partials/handle_alert.html',
        modalClass: 'modal-no-header confirm-modal',
        scope: newScope
      });
    }
  }

  // 添加 RCA
  handleRCAFeedback(alertDetail) {
    this.$scope.appEvent('show-modal', {
      src: 'public/app/partials/rca_feedback_modal.html',
      modalClass: 'modal-no-header confirm-modal'
    });
  }

  // 延迟报警
  handleSnooze(alertDetails) {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
    } else {
      var newScope = this.$scope.$new();
      newScope.alertDetails = alertDetails;
      this.$scope.appEvent('show-modal', {
        src: 'public/app/partials/snooze_alert.html',
        modalClass: 'modal-no-header confirm-modal',
        scope: newScope
      });
    }
  }

  // 关联性分析
  associateAnalysis(host, metric, startTime, alertDefinition, alertType) {
    if (alertType === 'LOG_ALERT') {
      this.$location.url(`/logs?query=${metric} AND host: ${host}&start=${startTime}`);
      return;
    }

    // var url = `/rca?guide&metric=${_.getMetricName(metric)}&host=${host}&start=${startTime}`;
    var url = `/association?guide&metric=${_.getMetricName(metric)}&host=${host}&start=${startTime}`;
    this.resetAlertRule(alertDefinition);
    this.associationSrv.setSourceAssociation({
      metric: this.prefix + metric,
      host: host,
      distance: 200,
      start: startTime
    });
    this.$location.url(url);
  }

  resetAlertRule(alertDefinition) {
    if (!alertDefinition) { return; }
    var threshold = {
      warn: alertDefinition.alertDetails.warn.threshold,
      crit: alertDefinition.alertDetails.crit.threshold,
    };
    this.alertMgrSrv.resetCurrentThreshold(threshold);
  }

  getAlertLevel(alert) {
    return alert.history.level === 'CRITICAL' ? 'crit' : 'warn';
  }

  getCloseOp(alert) {
    return alert.history.closeOp === 'AUTO' ? '自动关闭' : alert.history.closeBy;
  }

}

coreModule.controller('AlertStatusCtrl', AlertStatusCtrl);
