import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import { coreModule } from 'app/core/core';
import 'app/plugins/datasource/opentsdb/queryCtrl';

export class AlertStatusCtrl {
  alertHistoryRange: any;
  alertTimeSelected: any;
  alertKey: any;
  correlationThreshold: any;
  alertWarningCount: any;
  alertCriticalCount: any;
  alertRows: any;
  alertStatusShow: any;
  alertHistory: any;
  alertData: any;
  opentsdbUrl: string;
  prefix: string;

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

  /** @ngInject */
  constructor (
    private $scope,
    private $rootScope,
    private $controller,
    private $location,
    private alertMgrSrv,
    private alertSrv,
    private contextSrv,
    private datasourceSrv,
    private integrateSrv,
    private backendSrv,
    private associationSrv
  ) {
    // this.getDataSource();
    this.prefix = contextSrv.user.orgId + "." + contextSrv.user.systemId + ".";

    this.alertHistoryRange = [
      { 'num': 0, 'type': 'now',  'value': '现在', },
      { 'num': 1, 'type': 'days',   'value': '过去一天' },
      { 'num': 1, 'type': 'weeks',  'value': '过去一周' },
      { 'num': 1, 'type': 'months', 'value': '过去一个月' },
      { 'num': 3, 'type': 'months', 'value': '过去三个月' },
    ];
    this.alertTimeSelected = this.alertHistoryRange[0];

    this.alertKey = '';
    this.correlationThreshold = 100;
    this.alertWarningCount = 0;
    this.alertCriticalCount = 0;
  }

  private getDataSource() {
    this.$controller('OpenTSDBQueryCtrl', { $scope: this.$scope });
    return this.datasourceSrv.get('opentsdb').then(datasource => {
      this.$scope.datasource = datasource;
      this.opentsdbUrl = datasource.url;
    });
  }

  init() {
    this.getAlertStatus();
    this.getAlertHistory(this.alertTimeSelected);
  }

  getAlertStatus() {
    // if host exists ?
    const searchParams = this.$location.search();
    const hostname = searchParams.name || searchParams.host;

    this.alertMgrSrv.loadTriggeredAlerts({ host: hostname }).then(response => {
      response.data.forEach(alertItem => {
        if (alertItem.status.level === "CRITICAL") {
          this.alertCriticalCount++;
          alertItem.definition.alertDetails.threshold = alertItem.definition.alertDetails.crit.threshold;
        } else {
          this.alertWarningCount++;
          alertItem.definition.alertDetails.threshold = alertItem.definition.alertDetails.warn.threshold;
        }
        // Only show 2 digits. +0.00001 is to avoid floating point weirdness on rounding number.
        alertItem.status.triggeredValue = Math.round((alertItem.status.triggeredValue + 0.00001) * 100) / 100;
      });
      this.alertRows = response.data;
      this.getCurrentAlertValue();
    });
  }

  getCurrentAlertValue() {
    this.alertRows.forEach(alertItem => {

      // when multi metrics, need expression
      if (alertItem.definition.alertDetails.alertType === 'MUTI_ALERT') {
        var metrics = angular.copy(alertItem.definition.alertDetails.hostQuery.metricQueries);
        metrics.forEach(metric => {
          metric.metric = this.prefix + metric.metric;
          metric.aggregator = metric.aggregator.toLowerCase();
        });
        let queries = {
          timeRange: { from: '1m-ago', to: null },
          metrics: metrics,
          metricExpression: alertItem.definition.alertDetails.hostQuery.expression.split(';')[1],
          tags: [{
            "type": "iliteral_or",
            "tagk": "host",
            "filter": alertItem.status.monitoredEntity,
            "groupBy": true
          }]
        };

        this.getDataSource().then(() => {
          this.backendSrv.getOpentsdbExpressionQuery(queries, this.opentsdbUrl).then(response => {
            // var tt = response.data.outputs[0].meta.find()
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
        alertItem.definition.alertDetails.tags.forEach(tag => {
          tags[tag.name] = tag.value
        });

        var queries = [{
          "metric": alertItem.metric,
          "aggregator": alertItem.definition.alertDetails.hostQuery.metricQueries[0].aggregator.toLowerCase(),
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
    const searchParams = this.$location.search();
    const hostname = searchParams.name || searchParams.host;

    if (time.type === 'now') {
      this.alertStatusShow = true;
    } else {
      var timestemp = Date.parse(moment().subtract(time.num, time.type));
      this.alertMgrSrv.loadAlertHistory(timestemp, hostname).then(response => {
        this.alertHistory = response.data;
      });
      this.alertStatusShow = false;
    }
  }

  resetAlertRule(alertDetail) {
    var metric = _.getMetricName(alertDetail.metric);
    var def_zh = alertDetail.definition.name;
    var host = alertDetail.status.monitoredEntity;
    var threshold = {
      warn: alertDetail.definition.alertDetails.warn.threshold,
      crit: alertDetail.definition.alertDetails.crit.threshold,
    }
    this.alertMgrSrv.resetCurrentThreshold(threshold);
    this.alertMgrSrv.resetCurrentThreshold(threshold);
    this.alertMgrSrv.annotations = [_.extend({}, this.annotation_tpl, {
      min: alertDetail.status.creationTime,
      max: alertDetail.status.creationTime,
      title: "报警时间",
      tags: metric + "," + host,
      text: "[警报] " + def_zh,
    })];
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
    newScope.addCause = this.addCause;
    newScope.removeCause = this.removeCause;
    newScope.submitRCAFeedback = this.submitRCAFeedback;

    this.$scope.appEvent('show-modal', {
      src: 'public/app/partials/rca_feedback_modal.html',
      modalClass: 'modal-no-header confirm-modal',
      scope: newScope
    });
  }

  submitRCAFeedback() {
    var status = this.alertData.status;
    var prefix = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';

    this.addCause(this.$scope.causeMetric, this.$scope.causeHost, this.$scope.confidenceLevel);

    if (this.$scope.rootCauseMetrics.length) {
      var rcaFeedback: any = {};
      rcaFeedback.timestampInSec = Math.round(status.levelChangedTime/1000);
      rcaFeedback.alertIds = [status.alertId];
      rcaFeedback.triggerMetric = {
        name: prefix + this.alertData.metric,
        host: this.alertData.status.monitoredEntity,
      };
      rcaFeedback.rootCauseMetrics = _.cloneDeep(this.$scope.rootCauseMetrics);
      _.each(rcaFeedback.rootCauseMetrics, function(cause) {
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
    var status = this.alertData.status;

    if (this.$scope.reason) {
      this.alertMgrSrv.closeAlert(status.alertId, status.monitoredEntity, this.$scope.reason, this.contextSrv.user.name).then((response) => {
        _.remove(this.$scope.$parent.alertRows, (alertDetail) => {
          return (alertDetail.definition.id === status.alertId) &&  (alertDetail.status.monitoredEntity === status.monitoredEntity);
        });
        this.$scope.appEvent('alert-success', ['报警处理成功']);
      }).catch(function(err) {
        this.$scope.appEvent('alert-error', ['报警处理失败','请检查网络连接状态']);
      });
    }

    this.$scope.dismiss();
  }

  statusDetails(alertDetails) {
    var target = {
      tags: {
        host: ""
      },
      downsampleAggregator: "avg",
      downsampleInterval: "1m",
      aggregator: "",
      metric: ""
    };
    var alert = alertDetails;
    var details = alert.definition.alertDetails;
    var host = alert.status.monitoredEntity;
    var anno_create = alert.status.creationTime;
    var options = this.integrateSrv.options;

    target.aggregator = details.hostQuery.metricQueries[0].aggregator.toLowerCase();
    target.metric = details.hostQuery.metricQueries[0].metric;
    target.tags.host = host;
    alert.definition.tags.forEach(tag => {
      target.tags[tag.name] = tag.value;
    });

    options.targets = [target];
    options.title = target.metric + "异常情况";

    options.from = moment.utc(anno_create - 3600000).format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
    options.to = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
    options.annotations = [_.extend({}, this.annotation_tpl, {
      min: anno_create,
      max: anno_create,
      title: "报警开始时间: "
    })];
    this.$location.path("/integrate");
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

  removeCause(index) {
    this.$scope.rootCauseMetrics.splice(index, 1);
  }

  getAlertType(alert) {
    return alert.history.level === 'CRITICAL' ? 'crit' : 'warn';
  };

  getCloseOp(alert) {
    return alert.history.closeOp === 'AUTO' ? '自动关闭' : alert.history.closeBy;
  }

  historyAnalysis(id) {
    var target = {
      tags: {
        host: ""
      },
      downsampleAggregator: "avg",
      downsampleInterval: "1m",
      aggregator: "",
      metric: ""
    };
    var alert = _.find(this.alertHistory, {'id': id});
    var details = alert.definition.alertDetails;
    var history = alert.history;
    var options = this.integrateSrv.options;

    target.aggregator = details.hostQuery.metricQueries[0].aggregator.toLowerCase();
    target.metric = details.hostQuery.metricQueries[0].metric;
    target.tags.host = history.host;
    alert.definition.tags.forEach(tag => {
      target.tags[tag.name] = tag.value;
    });

    options.targets = [target];
    options.title = target.metric + "异常情况";

    options.from = moment.utc(history.createdTimeInMillis - 3600000).format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
    options.to = moment.utc(history.closedTimeInMillis + 3600000).format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
    options.annotations = [_.extend({}, this.annotation_tpl, {
      min: history.createdTimeInMillis,
      max: history.createdTimeInMillis,
      title: "报警开始时间: "
    }), _.extend({}, this.annotation_tpl, {
      min: history.closedTimeInMillis,
      max: history.closedTimeInMillis,
      title: "报警结束时间: "
    })];
    this.$location.path("/integrate");
  }

  associateAnalysis(host, metric, alertDetail) {
    var url = '/rca?guide&metric=' + _.getMetricName(metric) + '&host=' + host + '&start=' + alertDetail.status.levelChangedTime;

    this.resetAlertRule(alertDetail);
    metric = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.' + metric;
    this.associationSrv.setSourceAssociation({
      metric: metric,
      host: host,
      distance: 200,
      start: alertDetail.status.levelChangedTime
    });
    this.$location.url(url);
  }
}

coreModule.controller('AlertStatusCtrl', AlertStatusCtrl);
