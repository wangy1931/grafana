define([
    'angular',
    'lodash',
    'jquery.flot',
    'jquery.flot.pie',
  ],
  function (angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('AnomalyCtrl', function ($scope, healthSrv, backendSrv, contextSrv, $controller, $rootScope) {
      $scope.init = function () {
        $scope.system = backendSrv.getSystemById(contextSrv.user.systemId);
        healthSrv.load().then(function (data) {
          $scope.applicationHealth = Math.floor(data.health);
          $scope.summary = data;
          data.metricHostClusters.push(data.metricHostNotClustered);
          $scope.metricHostClusters = healthSrv.aggregateHealths(data.metricHostClusters);
          $scope.clustersLength = $scope.metricHostClusters.length;
          healthSrv.anomalyMetricsData = $scope.metricHostClusters;
          $scope.summary.dangerMetricNum = 0;
          _.each($scope.metricHostClusters, function(cluster) {
            cluster.counter = _.countBy(cluster.elements, function(element) {
              if(element.health <= 25) {
                return 'unhealth';
              } else {
                return 'health';
              }
            });
            cluster.counter.unhealth = cluster.counter.unhealth || 0;
            $scope.summary.dangerMetricNum += cluster.counter.unhealth;
          });
          $scope.excludeMetricsData = healthSrv.floor(data.metricHostExcluded.elements);

          $scope.summary.numMetrics = ($scope.summary.numMetrics > $scope.summary.numAnomalyMetrics ? $scope.summary.numMetrics : $scope.summary.numAnomalyMetrics);

          $scope.pieData = {
            'normalMetricNum': $scope.summary.numMetrics - $scope.summary.numAnomalyMetrics,
            'criticalMetricNum': $scope.summary.numAnomalyMetrics - $scope.summary.dangerMetricNum,
            'dangerMetricNum': $scope.summary.dangerMetricNum,
            'normalPointNum': ($scope.summary.numDataPoints || $scope.summary.numAnomaliesInCache) - $scope.summary.numAnomaliesInCache,
            'anomalyPointNum': $scope.summary.numAnomaliesInCache
          };
          $scope.pieData.normalMetricPer = Math.round($scope.pieData.normalMetricNum / $scope.summary.numMetrics * 100);
          $scope.pieData.criticalMetricPer = Math.round($scope.pieData.criticalMetricNum / $scope.summary.numMetrics * 100);
          $scope.pieData.dangerMetricPer = Math.round($scope.pieData.dangerMetricNum / $scope.summary.numMetrics * 100);
          var dataPointNum = $scope.pieData.normalPointNum + $scope.pieData.anomalyPointNum;
          $scope.pieData.normalPointPer = Math.round($scope.pieData.normalPointNum / dataPointNum * 100);
          $scope.pieData.anomalyPointPer = Math.round($scope.pieData.anomalyPointNum / dataPointNum * 100);
          var pieData = [];
          if ($scope.checkZero([$scope.pieData.criticalMetricNum, $scope.pieData.criticalMetricNum, $scope.pieData.dangerMetricNum])) {
            pieData = [
              {label: "持续异常", data: 0},
              {label: "临时异常", data: 0},
              {label: "正常指标", data: 1},
            ];
          } else {
            pieData = [
              {label: "持续异常", data: $scope.pieData.dangerMetricNum},
              {label: "临时异常", data: $scope.pieData.criticalMetricNum},
              {label: "正常指标", data: $scope.pieData.normalMetricNum},
            ];
          }
          $.plot("#anomaly-pie", pieData, {
            series: {
              pie: {
                innerRadius: 0.5,
                show: true,
                label: {
                  show: false,
                }
              }
            },
            legend:{
              show:false
            },
            colors: ['rgb(224,76,65)','rgb(255,197,58)','rgb(61,183,121)']
          });

          // var numDataPoints = ($scope.summary.numDataPoints || $scope.summary.numAnomaliesInCache) - $scope.summary.numAnomaliesInCache;
          var piePointData = [];
          if ($scope.checkZero([$scope.pieData.anomalyPointNum, $scope.pieData.normalPointNum])) {
            piePointData = [
              {label: "异常点数", data: 0},
              {label: "正常点数", data: 1},
            ];
          } else {
            piePointData = [
              {label: "异常点数", data: $scope.pieData.anomalyPointNum},
              {label: "正常点数", data: $scope.pieData.normalPointNum},
            ];
          }
          $.plot("#anomaly-point-pie", piePointData, {
            series: {
              pie: {
                innerRadius: 0.5,
                show: true,
                label: {
                  show: false,
                }
              }
            },
            legend:{
              show:false
            },
            colors: ['rgb(255,197,58)','rgb(61,183,121)']
          });
          $controller('ClusterCtrl', {$scope: $scope}).init();
        });
        $scope.selected = 0;
      };
      $scope.reload = function() {
        $scope.init();
      };

      $scope.changeExcludeMetrics = function () {
        $scope.appEvent('show-modal', {
          src: 'public/app/partials/exclude_metrics.html',
          modalClass: 'modal-no-header confirm-modal',
          scope: $scope.$new(),
        });
      };

      $rootScope.$on('anomaly-select', function (e, index) {
        $scope.$apply(function () {
          $scope.metricHostClusters = [healthSrv.anomalyMetricsData[index.seriesIndex]];
        });
      });

      $scope.exclude = function(anomaly) {
        if (contextSrv.isViewer) {
          $scope.appEvent('alert-warning', ['抱歉','您没有权限执行该操作']);
        } else {
          _.each($scope.metricHostClusters, function(cluster) {
            _.remove(cluster.elements, function(element) {
              return _.isEqual(anomaly, element);
            });
          });
          healthSrv.exclude(anomaly.metric, anomaly.host);
          $scope.excludeMetricsData.push(anomaly);
        }
      };

      $scope.include = function (anomalyDef) {
        if (contextSrv.isViewer) {
          $scope.appEvent('alert-warning', ['抱歉','您没有权限执行该操作']);
        } else {
          healthSrv.include(anomalyDef.metric, anomalyDef.host).then(function () {
            $scope.reload();
          });
        }
      };

      $scope.selectCluster = function(index) {
        if($scope.selected === index) {
          $scope.selected = -1;
        } else {
          $scope.selected = index;
        }
      };

      $scope.checkZero = function(arr) {
        return _.every(arr, function(n) {
          return n === 0;
        });
      };

      $scope.init();
    });
  });
