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
  alertTypeRange: Array<any>;
  alertTypeSelected: any;
  alertSearch: string;
  alertWarningCount: number;
  alertCriticalCount: number;
  alertRows: Array<any>;
  alertHistory: Array<any>;
  alertStatusShow: boolean;
  prefix: string;

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

    this.alertTypeRange = [
      { 'name': 'metric', 'value': '指标' },
      { 'name': 'log', 'value': '日志' }
    ];
    this.alertTypeSelected = this.alertTypeRange[0];

    this.alertSearch = '';
    this.alertWarningCount = 0;
    this.alertCriticalCount = 0;
  }

  getDataSource() {
    this.$controller('OpenTSDBQueryCtrl', {$scope: this.$scope});
    this.datasourceSrv.get('opentsdb').then(datasource => {
      this.$scope.datasource = datasource;
    });
  }

  init() {
    var host = this.$location.search().name;
    this.getAlertStatus(host);
    this.getDataSource();

    this.getAlertHistory(this.alertTimeSelected);
  }

  getAlertStatus(host) {
    this.alertMgrSrv.loadTriggeredAlerts({ host: host }).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        var alertDetail = response.data[i];
        if (alertDetail.status.level === "CRITICAL") {
          this.alertCriticalCount++;
          alertDetail.definition.alertDetails.threshold = alertDetail.definition.alertDetails.crit.threshold;
        } else {
          this.alertWarningCount++;
          alertDetail.definition.alertDetails.threshold = alertDetail.definition.alertDetails.warn.threshold;
        }
        // Only show 2 digits. +0.00001 is to avoid floating point weirdness on rounding number.
        alertDetail.status.triggeredValue = Math.round((alertDetail.status.triggeredValue + 0.00001) * 100) / 100;
      }
      this.alertRows = response.data;
      this.getCurrentAlertValue();
    });
  }

  getCurrentAlertValue() {
    _.each(this.alertRows, alertItem => {
      var tags = {
        host: alertItem.status.monitoredEntity
      };
      _.each(alertItem.definition.alertDetails.tags, tag => {
        tags[tag.name] = tag.value;
      });

      var queries = [{
        "metric": alertItem.metric,
        "aggregator": alertItem.definition.alertDetails.hostQuery.metricQueries[0].aggregator.toLowerCase(),
        "downsample": "1m-avg",
        "tags": tags
      }];
      this.datasourceSrv.getHostStatus(queries, 'now-2m').then(response => {
        alertItem.curr = Math.floor(response.status * 1000) / 1000;
        if (isNaN(alertItem.curr)) { alertItem.curr = "没有数据"; }
      });
    });
  }

  getAlertHistory(time) {
    var host = this.$location.search().name;
    if (time.type === 'now') {
      this.alertStatusShow = true;
    } else {
      var timestemp = Date.parse(moment().subtract(time.num, time.type));
      this.alertMgrSrv.loadAlertHistory(timestemp, host).then(response => {
        this.alertHistory = response.data;
      });
      this.alertStatusShow = false;
    }
  }

  getAlertType(type) {
    if (type.name === 'metric') {}
  }

  resetAlertRule(alertDefinition) {
    if (!alertDefinition) { return; }
    var threshold = {
      warn: alertDefinition.alertDetails.warn.threshold,
      crit: alertDefinition.alertDetails.crit.threshold,
    };
    this.alertMgrSrv.resetCurrentThreshold(threshold);
  }

  handleAlert(alertDetail) {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
    } else {
      var newScope = this.$scope.$new();
      newScope.alertData = alertDetail;
      newScope.closeAlert = this.closeAlert;

      this.$scope.appEvent('show-modal', {
        src: 'public/app/partials/handle_alert.html',
        modalClass: 'modal-no-header confirm-modal',
        scope: newScope
      });
    }
  }

  handleRCAFeedback(alertDetail) {
    var newScope = this.$scope.$new();
    newScope.alertData = alertDetail;
    newScope.alertData.metric = _.getMetricName(alertDetail.metric);
    newScope.causeHost = alertDetail.status.monitoredEntity;
    newScope.datasource = this.$scope.datasource;
    newScope.suggestMetrics = this.$scope.suggestMetrics;
    newScope.suggestTagHost = this.backendSrv.suggestTagHost;
    newScope.confidenceLevel = '100';
    newScope.confidences = {
      '100': '非常确定',
      '50': '可能'
    };
    newScope.rootCauseMetrics = [];
    newScope.addCause = this.$scope.addCause;
    newScope.removeCause = this.$scope.removeCause;
    newScope.submitRCAFeedback = this.$scope.submitRCAFeedback;

    this.$scope.appEvent('show-modal', {
      src: 'public/app/partials/rca_feedback_modal.html',
      modalClass: 'modal-no-header confirm-modal',
      scope: newScope
    });
  }

  submitRCAFeedback() {
    var status = this.$scope.alertData.status;
    var prefix = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';

    this.addCause(this.$scope.causeMetric, this.$scope.causeHost, this.$scope.confidenceLevel);

    if (this.$scope.rootCauseMetrics.length) {
      var rcaFeedback: any = {};
      rcaFeedback.timestampInSec = Math.round(status.levelChangedTime/1000);
      rcaFeedback.alertIds = [status.alertId];
      rcaFeedback.triggerMetric = {
        name: prefix + this.$scope.alertData.metric,
        host: this.$scope.alertData.status.monitoredEntity,
      };
      rcaFeedback.rootCauseMetrics = _.cloneDeep(this.$scope.rootCauseMetrics);
      _.each(rcaFeedback.rootCauseMetrics, cause => {
        cause.name = prefix + cause.name;
        cause.confidenceLevel = parseInt(cause.confidenceLevel);
      });
      rcaFeedback.org = this.contextSrv.user.orgId;
      rcaFeedback.sys = this.contextSrv.user.systemId;
      rcaFeedback.relatedMetrics = [];
      this.alertMgrSrv.rcaFeedback(rcaFeedback).then(response => {
        this.$scope.appEvent('alert-success', ['报警根源添加成功']);
      }, err => {
        this.$scope.appEvent('alert-error', ['报警根源添加失败']);
      });
    }

    this.$scope.dismiss();
  }

  closeAlert() {
    var status = this.$scope.alertData.status;

    if (this.$scope.reason) {
      this.alertMgrSrv.closeAlert(status.alertId, status.monitoredEntity, this.$scope.reason, this.contextSrv.user.name).then(response => {
        _.remove(this.$scope.$parent.alertRows, alertDetail => {
          return (alertDetail.definition.id === status.alertId) &&  (alertDetail.status.monitoredEntity === status.monitoredEntity);
        });
        this.$scope.appEvent('alert-success', ['报警处理成功']);
      }).catch(function(err) {
        this.$scope.appEvent('alert-error', ['报警处理失败','请检查网络连接状态']);
      });
    }

    this.$scope.dismiss();
  }

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

  addCause(causeMetric, causeHost, confidenceLevel) {
    if (_.every([causeMetric, causeHost, confidenceLevel])) {
      this.$scope.causeMetric = '';
      this.$scope.causeHost = '';
      this.$scope.rootCauseMetrics.push({
        name: causeMetric,
        host: causeHost,
        confidenceLevel: confidenceLevel
      });
    }
  }

  associateAnalysis(host, metric, startTime, alertDefinition) {
    var url = '/rca?guide&metric=' + _.getMetricName(metric) + '&host=' + host + '&start=' + startTime;

    this.resetAlertRule(alertDefinition);
    this.associationSrv.setSourceAssociation({
      metric: this.prefix + metric,
      host: host,
      distance: 200,
      start: startTime
    });
    this.$location.url(url);
  }

  removeCause(index) {
    this.$scope.rootCauseMetrics.splice(index, 1);
  }

  getAlertLevel(alert) {
    return alert.history.level === 'CRITICAL' ? 'crit' : 'warn';
  }

  getCloseOp(alert) {
    return alert.history.closeOp === 'AUTO' ? '自动关闭' : alert.history.closeBy;
  }

}

coreModule.controller('AlertStatusCtrl', AlertStatusCtrl);
