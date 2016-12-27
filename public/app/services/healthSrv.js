define([
    'angular',
    'lodash',
    'config',
  ],
  function (angular) {
    'use strict';

    var module = angular.module('grafana.services');

    module.service('healthSrv', function ($http, backendSrv) {
      var anomalyListUrl = "/anomaly";
      var excludeAnomaly = "/anomaly/exclude";
      var includeAnomaly = "/anomaly/include";
      var mainHealthList = "/api/alertsource/healthsummary";
      this.anomalyMetricsData = [];
      var _this = this;
      this.load = function () {
        return backendSrv.alertD({
          method: "get",
          url: anomalyListUrl
        }).then(function onSuccess(response) {
          _this.anomalyMetricsData = response.data.includedMetricHealths.concat(response.data.excludedMetricHealths);
          return response.data;
        }, function onFailed(response) {
          return response;
        });
      };

      this.exclude = function (metricName) {
        backendSrv.alertD({
          method: "post",
          url: excludeAnomaly,
          params: {
            metric: metricName
          }
        });
      };

      this.include = function (metricName) {
        backendSrv.alertD({
          method: "post",
          url: includeAnomaly,
          params: {
            metric: metricName
          }
        });
      };

      this.healthSummary = function () {
        return backendSrv.request({ method: 'GET', url: mainHealthList, timeout: 2000});
      };

      this.floor = function (metrics) {
        _.each(metrics, function (metric) {
          metric.health = Math.floor(metric.health);
        });
        return metrics;
      };
    });
  });