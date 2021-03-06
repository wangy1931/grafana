define([
  'angular',
  'lodash',
  'moment'
  ],
  function (angular, _, moment) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('AnomalyHistory', function ($scope, healthSrv, $translate) {
      var panelMeta = [{
        "collapse": false,
        "editable": false,
        "height": "260px",
        "panels": [{
          "title": "Panel Title",
          "error": false,
          "span": 12,
          "editable": true,
          "type": "graph",
          "id": 1,
          "datasource": null,
          "renderer": "flot",
          "x-axis": true,
          "y-axis": true,
          "y_formats": [
            "short",
            "short"
          ],
          "grid": {
            "leftLogBase": 1,
            "leftMax": null,
            "rightMax": null,
            "leftMin": null,
            "rightMin": null,
            "rightLogBase": 1,
            "threshold1": null,
            "threshold2": null,
            "threshold1Color": "rgba(216, 200, 27, 0.27)",
            "threshold2Color": "rgba(234, 112, 112, 0.22)"
          },
          "lines": true,
          "fill": 1,
          "linewidth": 2,
          "points": false,
          "pointradius": 5,
          "bars": false,
          "stack": false,
          "percentage": false,
          "legend": {
            "show": true,
            "values": false,
            "min": false,
            "max": false,
            "current": false,
            "total": false,
            "avg": false
          },
          "nullPointMode": "connected",
          "steppedLine": false,
          "tooltip": {
            "value_type": "cumulative",
            "shared": true
          },
          "timeFrom": null,
          "timeShift": null,
          "targets": [
            {
              "errors": {},
              "aggregator": "avg",
              "downsampleAggregator": "avg",
              "metric": "",
              "downsampleInterval": "15m",
              "tags": {"host":""}
            },
            {
              "errors": {},
              "aggregator": "avg",
              "downsampleAggregator": "avg",
              "metric": "",
              "downsampleInterval": "",
              "tags": {"host":""}
            }],
            "aliasColors": {},
            "seriesOverrides": [
              {
                "alias": "",
                "points": true,
                "lines": false,
                "color": "#BF1B00",
                "pointradius": 3
              }
            ]
          }
        ],
        "showTitle": false,
        "title": "New row"
      }];

      $scope.init = function() {
        $scope.anomalyHistoryRange = [
          {'num': 1,'type':'days','value': $translate.i18n.i18n_day_ago_1,'from': 'now-1d'},
          {'num': 1,'type':'weeks','value': $translate.i18n.i18n_week_ago_1,'from': 'now-7d'},
          {'num': 1,'type':'months','value': $translate.i18n.i18n_month_ago_1,'from': 'now-1M'},
          {'num': 3,'type':'months','value': $translate.i18n.i18n_month_ago_3,'from':'now-3M'},
        ];
        $scope.anomalyTimeSelected = $scope.anomalyHistoryRange[0];
        $scope.loadHistory($scope.anomalyTimeSelected).then(function(anomaly) {
          var targets = panelMeta[0].panels[0].targets;
          targets[0].metric = anomaly.metric;
          targets[0].tags.host = anomaly.host;
          targets[1].metric = anomaly.metric+".anomaly";
          targets[1].tags.host = anomaly.host;
          panelMeta[0].panels[0].seriesOverrides[0].alias = anomaly.metric+".anomaly{host="+ anomaly.host + "}";
          panelMeta[0].panels[0].title = anomaly.metric + $translate.i18n.page_anomaly_status;
          $scope.initDashboard({
            meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
            dashboard: {
              title: "Overview",
              id: "name",
              rows: panelMeta,
              time: { from: $scope.anomalyTimeSelected.from, to: "now" }
            }
          }, $scope);
        });
      };

      $scope.loadHistory = function(time, host) {
        var from = Date.parse(moment().subtract(time.num, time.type))/1000;
        var to = Date.parse(moment())/1000;
        return healthSrv.loadHistory({from: from, to: to}, host).then(function(response) {
          $scope.anomalyHistory = [];
          _.each(response.secAtHostToMetrics, function(metrics, timeHost) {
            var time = timeHost.substr(0,10);
            var host = timeHost.substr(11);
            _.each(metrics, function(metric) {
              var anomaly = {
                time: time*1000,
                host: host,
                metric: _.getMetricName(metric)
              };
              $scope.anomalyHistory.push(anomaly);
            });
          });
          $scope.selectedAnomaly = 0;
          return $scope.anomalyHistory[0];
        });
      };

      $scope.refreshDashboard = function () {
        if ($scope.dashboard) {
          $scope.dashboard.time.from = $scope.anomalyTimeSelected.from;
          $scope.getDetail($scope.anomalyHistory[0]);
        }
      };

      $scope.getDetail = function(anomaly) {
        $scope.selectedAnomaly = _.findIndex($scope.anomalyHistory,anomaly);
        var targets = $scope.dashboard.rows[0].panels[0].targets;
        targets[0].metric = anomaly.metric;
        targets[0].tags.host = anomaly.host;
        targets[1].metric = anomaly.metric+".anomaly";
        targets[1].tags.host = anomaly.host;
        _.each(targets, function(target) {
          target.downsampleAggregator = 'avg';
          target.shouldComputeRate = false;
        });
        $scope.dashboard.rows[0].panels[0].seriesOverrides[0].alias = anomaly.metric+".anomaly{host="+ anomaly.host + "}";
        $scope.dashboard.rows[0].panels[0].title = anomaly.metric + $translate.i18n.page_anomaly_status;
        healthSrv.transformMetricType($scope.dashboard).then(function () {
          $scope.$broadcast('refresh');
        });
      };

      this.loadHistory = $scope.loadHistory;
    });
  });