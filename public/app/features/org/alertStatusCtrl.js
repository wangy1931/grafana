define([
  'angular',
  'moment',
  'lodash',
  'app/plugins/datasource/opentsdb/queryCtrl',
],
function (angular, moment, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('AlertStatusCtrl', function ($scope, alertMgrSrv, datasourceSrv, contextSrv, integrateSrv, $location, backendSrv, $controller, associationSrv) {
    var annotation_tpl = {
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

    $scope.getLevel = alertMgrSrv.getLevel;

    $scope.alertHistoryRange = [
      { 'num': 0, 'type': 'now',  'value': '现在', },
      { 'num': 1, 'type': 'days',   'value': '过去一天' },
      { 'num': 1, 'type': 'weeks',  'value': '过去一周' },
      { 'num': 1, 'type': 'months', 'value': '过去一个月' },
      { 'num': 3, 'type': 'months', 'value': '过去三个月' },
    ];
    $scope.alertTimeSelected = $scope.alertHistoryRange[0];

    $scope.alertKey = '';
    $scope.correlationThreshold = 100;
    $scope.alertWarningCount = 0;
    $scope.alertCriticalCount = 0;

    $scope.formatDate = function (mSecond) {
      return moment(mSecond).format("YYYY-MM-DD HH:mm:ss");
    };

    $scope.timeFrom = function (mSecond, snoozeMin) {
      return moment(mSecond).add(snoozeMin, 'm').format("YYYY-MM-DD HH:mm");
    };

    $scope.init = function (host) {
      $scope.getAlertStatus(host);
      $scope.getDataSource();

      $scope.getAlertHistory($scope.alertTimeSelected);
    };

    $scope.getAlertStatus = function (host) {
      alertMgrSrv.loadTriggeredAlerts({ host: host }).then(function onSuccess(response) {
        for (var i = 0; i < response.data.length; i++) {
          var alertDetail = response.data[i];
          if (alertDetail.status.level === "CRITICAL") {
            $scope.alertCriticalCount++;
            alertDetail.definition.alertDetails.threshold = alertDetail.definition.alertDetails.crit.threshold;
          } else {
            $scope.alertWarningCount++;
            alertDetail.definition.alertDetails.threshold = alertDetail.definition.alertDetails.warn.threshold;
          }
          // Only show 2 digits. +0.00001 is to avoid floating point weirdness on rounding number.
          alertDetail.status.triggeredValue = Math.round((alertDetail.status.triggeredValue + 0.00001) * 100) / 100;
        }
        $scope.alertRows = response.data;
        $scope.getCurrentAlertValue();
      });
    };

    $scope.getCurrentAlertValue = function () {
      _.each($scope.alertRows, function (alertItem) {
        var tags = {
          host: alertItem.status.monitoredEntity
        };
        _.each(alertItem.definition.alertDetails.tags, function (tag) {
          tags[tag.name] = tag.value;
        });

        var queries = [{
          "metric": alertItem.metric,
          "aggregator": alertItem.definition.alertDetails.hostQuery.metricQueries[0].aggregator.toLowerCase(),
          "downsample": "1m-avg",
          "tags": tags
        }];
        datasourceSrv.getHostStatus(queries, 'now-2m').then(function (response) {
          alertItem.curr = Math.floor(response.status * 1000) / 1000;
          if (isNaN(alertItem.curr)) { alertItem.curr = "没有数据"; }
        });
      });
    };

    $scope.getDataSource = function () {
      $controller('OpenTSDBQueryCtrl', {$scope: $scope});
      datasourceSrv.get('opentsdb').then(function (datasource) {
        $scope.datasource = datasource;
      });
    };

    $scope.getAlertHistory = function(time) {
      var host = $location.search().name;
      if (time.type === 'now') {
        $scope.alertStatusShow = true;
      } else {
        var timestemp = Date.parse(moment().subtract(time.num, time.type));
        alertMgrSrv.loadAlertHistory(timestemp, host).then(function (response) {
          $scope.alertHistory = response.data;
        });
        $scope.alertStatusShow = false;
      }
    };

    $scope.resetAlertRule = function (alertDetail) {
      var metric = _.getMetricName(alertDetail.metric);
      var def_zh = alertDetail.definition.name;
      var host = alertDetail.status.monitoredEntity;
      var threshold = {
        warn: alertDetail.definition.alertDetails.warn.threshold,
        crit: alertDetail.definition.alertDetails.crit.threshold,
      };
      alertMgrSrv.resetCurrentThreshold(threshold);
      alertMgrSrv.annotations = [_.extend({}, annotation_tpl, {
        min: alertDetail.status.creationTime,
        max: alertDetail.status.creationTime,
        title: "报警时间",
        tags: metric + "," + host,
        text: "[警报] " + def_zh,
      })];
    };

    $scope.handleAlert = function (alertDetail) {
      if (contextSrv.isViewer) {
        $scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
      } else {
        var newScope = $scope.$new();
        newScope.alertData = alertDetail;
        newScope.closeAlert = $scope.closeAlert;

        $scope.appEvent('show-modal', {
          src: 'public/app/partials/handle_alert.html',
          modalClass: 'modal-no-header confirm-modal',
          scope: newScope
        });
      }
    };

    $scope.handleRCAFeedback = function (alertDetail) {
      var newScope = $scope.$new();
      newScope.alertData = alertDetail;
      newScope.alertData.metric = _.getMetricName(alertDetail.metric);
      newScope.causeHost = alertDetail.status.monitoredEntity;
      newScope.datasource = $scope.datasource;
      newScope.suggestMetrics = $scope.suggestMetrics;
      newScope.suggestTagHost = backendSrv.suggestTagHost;
      newScope.confidenceLevel = '100';
      newScope.confidences = {
        '100': '非常确定',
        '50': '可能'
      };
      newScope.rootCauseMetrics = [];
      newScope.addCause = $scope.addCause;
      newScope.removeCause = $scope.removeCause;
      newScope.submitRCAFeedback = $scope.submitRCAFeedback;

      $scope.appEvent('show-modal', {
        src: 'public/app/partials/rca_feedback_modal.html',
        modalClass: 'modal-no-header confirm-modal',
        scope: newScope
      });
    };

    $scope.submitRCAFeedback = function () {
      var status = $scope.alertData.status;
      var prefix = contextSrv.user.orgId + '.' + contextSrv.user.systemId + '.';

      $scope.addCause($scope.causeMetric, $scope.causeHost, $scope.confidenceLevel);

      if ($scope.rootCauseMetrics.length) {
        var rcaFeedback = {};
        rcaFeedback.timestampInSec = Math.round(status.levelChangedTime/1000);
        rcaFeedback.alertIds = [status.alertId];
        rcaFeedback.triggerMetric = {
          name: prefix + $scope.alertData.metric,
          host: $scope.alertData.status.monitoredEntity,
        };
        rcaFeedback.rootCauseMetrics = _.cloneDeep($scope.rootCauseMetrics);
        _.each(rcaFeedback.rootCauseMetrics, function(cause) {
          cause.name = prefix + cause.name;
          cause.confidenceLevel = parseInt(cause.confidenceLevel);
        });
        rcaFeedback.org = contextSrv.user.orgId;
        rcaFeedback.sys = contextSrv.user.systemId;
        rcaFeedback.relatedMetrics = [];
        alertMgrSrv.rcaFeedback(rcaFeedback).then(function() {
          $scope.appEvent('alert-success', ['报警根源添加成功']);
        }, function() {
          $scope.appEvent('alert-error', ['报警根源添加失败']);
        });
      }

      $scope.dismiss();
    };

    $scope.closeAlert = function() {
      var status = $scope.alertData.status;

      if ($scope.reason) {
        alertMgrSrv.closeAlert(status.alertId, status.monitoredEntity, $scope.reason, contextSrv.user.name).then(function(response) {
          _.remove($scope.$parent.alertRows, function(alertDetail) {
            return (alertDetail.definition.id === status.alertId) &&  (alertDetail.status.monitoredEntity === status.monitoredEntity);
          });
          $scope.appEvent('alert-success', ['报警处理成功']);
        }).catch(function(err) {
          $scope.appEvent('alert-error', ['报警处理失败','请检查网络连接状态']);
        });
      }

      $scope.dismiss();
    };

    $scope.statusDetails = function(alertDetails) {
      var target = {
        tags: {},
        downsampleAggregator: "avg",
        downsampleInterval: "1m"
      };
      var alert = alertDetails;
      var details = alert.definition.alertDetails;
      var host = alert.status.monitoredEntity;
      var anno_create = alert.status.creationTime;
      var options = integrateSrv.options;

      target.aggregator = details.hostQuery.metricQueries[0].aggregator.toLowerCase();
      target.metric = details.hostQuery.metricQueries[0].metric;
      target.tags.host = host;
      for (var tag in alert.definition.tags) {
        target.tags[tag.name] = tag.value;
      }
      options.targets = [target];
      options.title = target.metric + "异常情况";

      options.from = moment.utc(anno_create - 3600000).format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
      options.to = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
      options.annotations = [_.extend({}, annotation_tpl, {
        min: anno_create,
        max: anno_create,
        title: "报警开始时间: "
      })];
      $location.path("/integrate");
    };

    $scope.handleSnooze = function(alertDetails) {
      if (contextSrv.isViewer) {
        $scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
      } else {
        var newScope = $scope.$new();
        newScope.alertDetails = alertDetails;
        $scope.appEvent('show-modal', {
          src: 'public/app/partials/snooze_alert.html',
          modalClass: 'modal-no-header confirm-modal',
          scope: newScope
        });
      }
    };

    $scope.addCause = function (causeMetric,causeHost,confidenceLevel) {
      if (_.every([causeMetric, causeHost, confidenceLevel])) {
        $scope.causeMetric = '';
        $scope.causeHost = '';
        $scope.rootCauseMetrics.push({
          name: causeMetric,
          host: causeHost,
          confidenceLevel: confidenceLevel
        });
      }
    };

    $scope.removeCause = function (index) {
      $scope.rootCauseMetrics.splice(index, 1);
    };

    $scope.getAlertType = function (alert) {
      return alert.history.level === 'CRITICAL' ? 'crit' : 'warn';
    };

    $scope.getCloseOp = function (alert) {
      return alert.history.closeOp === 'AUTO' ? '自动关闭' : alert.history.closeBy;
    };

    $scope.historyAnalysis = function (id) {
      var target = {
        tags: {},
        downsampleAggregator: "avg",
        downsampleInterval: "1m"
      };
      var alert = _.find($scope.alertHistory, {'id': id});
      var details = alert.definition.alertDetails;
      var history = alert.history;
      var options = integrateSrv.options;

      target.aggregator = details.hostQuery.metricQueries[0].aggregator.toLowerCase();
      target.metric = details.hostQuery.metricQueries[0].metric;
      target.tags.host = history.host;
      for (var tag in alert.definition.tags) {
        target.tags[tag.name] = tag.value;
      }

      options.targets = [target];
      options.title = target.metric + "异常情况";

      options.from = moment.utc(history.createdTimeInMillis - 3600000).format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
      options.to = moment.utc(history.closedTimeInMillis + 3600000).format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
      options.annotations = [_.extend({}, annotation_tpl, {
        min: history.createdTimeInMillis,
        max: history.createdTimeInMillis,
        title: "报警开始时间: "
      }), _.extend({}, annotation_tpl, {
        min: history.closedTimeInMillis,
        max: history.closedTimeInMillis,
        title: "报警结束时间: "
      })];
      $location.path("/integrate");
    };

    $scope.associateAnalysis = function(host, metric, alertDetail) {
      var url = '/rca?guide&metric=' + _.getMetricName(metric) + '&host=' + host + '&start=' + alertDetail.status.levelChangedTime;

      $scope.resetAlertRule(alertDetail);
      metric = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.' + metric;
      associationSrv.setSourceAssociation({
        metric: metric,
        host: host,
        distance: 200,
        start: alertDetail.status.levelChangedTime
      });
      $location.url(url);
    };

    this.init = $scope.init;
  });
});
