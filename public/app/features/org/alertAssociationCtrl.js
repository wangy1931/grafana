define([
  'angular',
  'lodash',
  'slider',
],
function (angular, _, noUiSlider) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('AlertAssociationCtrl', function ($scope, $location, alertMgrSrv, alertSrv, $timeout, contextSrv, healthSrv, backendSrv, $controller, datasourceSrv, associationSrv) {
    var alertMetric = '';
    var alertHost = '';
    var distance = '';
    $scope.correlationThreshold = distance || 300;
    $scope.targetObj = {
      metric: "",
      host: ""
    };

    if (_.isEmpty(associationSrv.sourceAssociation)) {
      $scope.isSingle = true;
    } else {
      $scope.isSingle = false;
      alertMetric = associationSrv.sourceAssociation.metric;
      alertHost = associationSrv.sourceAssociation.host;
      distance = associationSrv.sourceAssociation.distance;
    }
    $controller('OpenTSDBQueryCtrl', {$scope: $scope});

    $scope.init = function() {
      $scope.suggestTagHost = backendSrv.suggestTagHost;
      datasourceSrv.get('opentsdb').then(function (datasource) {
        $scope.datasource = datasource;
      });
      if (alertMetric) {
        if(!$scope.dashboard) {
          $scope.createAlertMetricsGraph(_.getMetricName(alertMetric), alertHost);
        } else {
          var metric = _.getMetricName(alertMetric)
          $scope.dashboard.rows[0].panels[0].title = metric;
          $scope.dashboard.rows[0].panels[0].targets[0].metric = metric;
          $scope.dashboard.rows[0].panels[0].targets[0].tags.host = alertHost;
        }
      }
    };

    $scope.getRowPanelMeta = function (hostTag, metric) {
      return {
        title: "test for anmoly",
        height: '300px',
        panels: [
          {
            title: metric,
            error: false,
            span: 12,
            id: 1,
            editable: false,
            linewidth: 2,
            height: "500px",
            type: "graph",
            targets: [
              {
                aggregator: "avg",
                metric: metric,
                downsampleAggregator: "avg",
                downsampleInterval: "1m",
                tags: {host: hostTag}
              }
            ],
            'y-axis': false,
            'yaxes': [
                {
                    'label': null,
                    'show': false,
                    'logBase': 1,
                    'min': null,
                    'max': null,
                    'format': "short"
                },
                {
                    'label': null,
                    'show': false,
                    'logBase': 1,
                    'min': null,
                    'max': null,
                    'format': "short"
                }
            ],
            legend: {
              alignAsTable: true,
              avg: true,
              min: true,
              max: true,
              current: true,
              total: true,
              show: false,
              values: true
            },
            grid: {
              leftLogBase: 1,
              leftMax: null,
              leftMin: null,
              rightLogBase: 1,
              rightMax: null,
              rightMin: null,
              threshold1: alertMgrSrv.currentCritialThreshold,
              threshold1Color: "rgba(216, 169, 27, 0.61)",
              threshold2: alertMgrSrv.currentWarningThreshold,
              threshold2Color: "rgba(251, 0, 0, 0.57)",
              thresholdLine: true
            },
            thresholds: [
              {
                value: alertMgrSrv.currentCritialThreshold,
                colorMode: "critical",
                op: 'gt',
                fill: false,
                line: true
              },
              {
                value: alertMgrSrv.currentWarningThreshold,
                colorMode: "warning",
                op: 'gt',
                fill: false,
                line: true
              }
            ]
          }
        ]
      };
    };

    $scope.createAlertMetricsGraph = function (metrics, host) {
      $scope.initDashboard({
        meta: {canStar: false, canShare: false, canEdit: false, canSave: false},
        dashboard: {
          title: "相关联指标",
          id: 1,
          rows: [$scope.getRowPanelMeta(host, metrics)],
          time: {from: "now-6h", to: "now"},
          manualAnnotation: alertMgrSrv.annotations,
          annotations: {
            list: [
              {
                datasource: "opentsdb",
                enable: false,
                iconColor: "#C0C6BE",
                iconSize: 13,
                lineColor: "rgba(88, 110, 195, 0.86)",
                name: "服务启动时间",
                query: "*",
                showLine: true,
                textField: "123",
                timeField: ""
              }
            ]
          }
        }
      }, $scope);
    };

    $scope.createAssociatedMetricGraphPanel = function(associatedMetrics) {
      var hostTag = associatedMetrics.hosts[0] || "*";
      var rowMeta = $scope.getRowPanelMeta(hostTag, associatedMetrics.metric);

      $scope.host = alertHost;

      $scope.initDashboard({
        meta: { canStar: false, canShare: false, canEdit: false , canSave: false},
        dashboard: {
          title: "相关联指标",
          id: alertMetric,
          rows: [rowMeta],
          time: {from: "now-6h", to: "now"}
        }
      }, $scope);
      $timeout(function() {
        $scope.$broadcast('render');
      });
    };

    $scope.analysis = function() {
      alertMetric = contextSrv.user.orgId + "." + contextSrv.user.systemId + "." + $scope.targetObj.metric;
      alertHost = $scope.targetObj.host;
      $scope.init();
      associationSrv.setSourceAssociation(alertMetric, alertHost, $scope.correlationThreshold);
      $scope.$emit('analysis', associationSrv);
    }

    $scope.$on('destroy', function() {
      var threshold = {
        warn: null,
        crit: null
      }
      alertMgrSrv.resetCurrentThreshold(threshold);
    });
    $scope.init();
  });

  module.directive('slider', function() {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element) {
        noUiSlider.create(element[0], {
          start: scope.$parent.correlationThreshold || 100,
          connect: [true, false],
          tooltips: false,
          step: 10,
          range: {
            'min': 10,
            'max': 1000
          }
        });
        scope.$parent.thresholdSlider = element[0].noUiSlider;
        scope.$parent.thresholdSlider.on('change', function() {
          scope.$parent.correlationThreshold = scope.$parent.thresholdSlider.get();
          scope.$emit('analysis', 'thresholdSlider');
        })
      }
    };
  });
});
