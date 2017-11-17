define([
    'angular',
    'lodash',
    '../core_module',
],
function (angular, _, coreModule) {
  'use strict';
  coreModule.default.service('alertMgrSrv', function(alertSrv, backendSrv) {
    this.alertDefMap = {};
    var self = this;
    var alertDefUrl = "/alert/definition";
    var alertStatusUrl = "/alert/status";
    var alertAssociationUrl = "/alert/correlation";
    var alertHistoryUrl = "/alert/history";
    var closeAlertUrl = "/alert/status/close";
    var checkNameUrl = "/alert/definition/check";
    var rcaFeedbackUrl = "/rca/feedback/json";

    this.currentCritialThreshold = 0;
    this.currentWarningThreshold = 0;

    this.load = function() {
      return backendSrv.alertD({
        method: "get",
        url: alertDefUrl,
      }).then(function onSuccess(response) {
        for (var i = 0; i < response.data.length; i++) {
          var theAlertDef = response.data[i];
          self.alertDefMap[theAlertDef.id] = theAlertDef;
        }
        return response;
      }, function onFailed(response) {
        alertSrv.set("error", response.status + " " + (response.data || "Request failed"), response.severity, 5000);
        return response;
      });
    };

    this.save = function(alertDef) {
      return backendSrv.alertD({
        method: "post",
        url: alertDefUrl,
        data: angular.toJson(alertDef),
        headers: {'Content-Type': 'text/plain;application/json;charset=UTF-8'},
      });
    };

    this.remove = function(alertId) {
      return backendSrv.alertD({
        method: "delete",
        url: alertDefUrl,
        params: {id: alertId},
        headers: {'Content-Type': 'text/plain'},
      });
    };

    this.get = function(id) {
      return self.alertDefMap[id];
    };

    this.loadTriggeredAlerts = function(options) {
      var params = {};
      _.extend(params, options);
      return backendSrv.alertD({
        method: "get",
        url: alertStatusUrl,
        params: params
      });
    };

    this.loadAssociatedMetrics = function(alertMetric, alertHost, min, max, group) {
      return backendSrv.alertD({
        method: "get",
        url: alertAssociationUrl,
        params: {
          metric: alertMetric,
          host: alertHost,
          minDistance: 1000 - max,
          maxDistance: 1000 - min,
          group: group
        }
      });
    };

    this.resetCorrelation = function(alertMetric, alertHost, backtrackSteps, advancedSteps) {
      return backendSrv.alertD({
        method: "post",
        url: alertAssociationUrl,
        params: {
          metric: alertMetric,
          host: alertHost,
          backtrackSteps: backtrackSteps,
          advancedSteps: advancedSteps,
          reset: true
        },
        headers: {'Content-Type': 'text/plain'},
      });
    };

    this.resetCurrentThreshold = function (threshold) {
      self.currentWarningThreshold = threshold.warn;
      self.currentCritialThreshold = threshold.crit;
    };

    this.loadAlertHistory = function(fromTime, host) {
      var params = { from: fromTime };
      host && (params['host'] = host);

      return backendSrv.alertD({
        method: "get",
        url: alertHistoryUrl,
        params: params
      });
    };

    this.closeAlert = function(alertId, host, alertReason, userName) {
      return backendSrv.alertD({
        method: "post",
        url: closeAlertUrl,
        params: {
          id: alertId,
          host: host,
        },
        data:{
          reason: alertReason,
          closeBy: userName
        },
        headers: {'Content-Type': 'text/plain;application/json;charset=UTF-8'},
      });
    };

    this.rcaFeedback = function(rcaFeedback) {
      return backendSrv.alertD({
        method: "post",
        url: rcaFeedbackUrl,
        data:rcaFeedback,
        headers: {'Content-Type': 'text/plain;application/json;charset=UTF-8'},
      });
    };

    this.getLevel = function(level) {
      if(level === 'CRITICAL') {
        return '严重';
      } else {
        return '警告';
      }
    };

    this.checkName = function(ruleName) {
      return backendSrv.alertD({
        method: 'get',
        url: checkNameUrl,
        params: {
          name: ruleName,
        }
      });
    };
  });
});
