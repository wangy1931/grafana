define([
  'angular',
  'lodash',
  'slider',
],
function (angular, _, noUiSlider) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('AlertAssociationCtrl', function ($scope, $routeParams, $location, alertMgrSrv, alertSrv, $timeout, contextSrv, healthSrv, backendSrv, $controller, datasourceSrv) {
    var alertMetric = $routeParams.metric;
    var alertHost = $routeParams.host;
    var distance = $routeParams.distance;
    $scope.correlationThreshold = distance;
    $scope.yaxisNumber = 3;

    this.initPage = function(target) {
      alertMetric = target.metric;
      alertHost = target.host ;
      distance = target.distance;
      $scope.correlationThreshold = distance;
      $scope.init();
    };

    $scope.init = function() {
      if (_.isUndefined($scope.correlationThreshold))
        return;
      $scope.manualMetrics = [];
      datasourceSrv.get('opentsdb').then(function (datasource) {
        $scope.datasource = datasource;
      });
      alertMgrSrv.loadAssociatedMetrics(alertMetric, alertHost, distance).then(function onSuccess(response) {
        var correlationOfAlertMap = response.data;
        if (!_.isEmpty(correlationOfAlertMap)) {
          $scope.isAssociation = true;
          for (var host in correlationOfAlertMap) {
            //TODO only support one host
            var correlatedMetrics = correlationOfAlertMap[host];
            $scope.correlatedMetrics = correlatedMetrics;
          }
          $scope.ralationMetrics = [];
          for (var m in $scope.correlatedMetrics) {
            if(_.isEqual(m, alertMetric)){
              delete $scope.correlatedMetrics[m];
            } else{
              $scope.ralationMetrics.push({
                metric: m,
                hosts: $scope.correlatedMetrics[m],
                confidenceLevel: '50',
                checked: false
              });
            }
          }
        } else {
          $scope.removeAllQuery();
        }
      }).finally(function() {
        if(!$scope.dashboard) {
          $scope.createAlertMetricsGraph(_.getMetricName(alertMetric), alertHost);
        } else {
          var metric = _.getMetricName(alertMetric)
          $scope.dashboard.rows[0].panels[0].title = metric;
          $scope.dashboard.rows[0].panels[0].targets[0].metric = metric;
          $scope.dashboard.rows[0].panels[0].targets[0].tags.host = alertHost;
          $scope.$broadcast('refresh');
        }
      });
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
              show: true,
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
            }
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

    $scope.flushResult = function () {
      $scope.appEvent('alert-warning', ['请稍后', '关联性分析将于5分钟之后计算完成,先去别处逛逛吧']);
      $timeout(function() {
        alertMgrSrv.loadAssociatedMetrics(alertMetric, alertHost, distance).then(function onSuccess(response) {
          if (!_.isEmpty(response.data)) {
            $scope.init();
            $scope.appEvent('alert-success', ['关联性分析计算完成', '请在关联性分析中查看metric:"'+alertMetric+'" host:"'+alertHost+'" 的关联结果']);
          } else {
            $scope.appEvent('alert-warning', ['关联性分析暂无计算结果', alertMetric + '暂无相关指标']);
          }
        });
      }, 30000);
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

    $scope.resetCorrelation = function() {
      $scope.correlationThreshold = 50; // reset the threshold to default value
      alertMgrSrv.resetCorrelation(alertMetric, alertHost, $scope.correlationBefore, $scope.correlationAfter).then(function onSuccess() {
        $location.path("alerts/association/" + alertHost + "/" + $scope.correlationThreshold + "/" + alertMetric);
      }, function onFailed(response) {
        alertSrv.set("error", response.status + " " + (response.data || "Request failed"), response.severity, 10000);
      });
    };
    $scope.addQuery = function(metricName) {
      var metricNameMap = $scope.correlatedMetrics;
      var isHidden = true;

      _.each($scope.dashboard.rows[0].panels[0].targets, function (target) {
        if (target.metric === _.getMetricName(metricName)) {
          if (metricNameMap[metricName][0] === target.tags.host) {
            isHidden = false;
            target.hide = !target.hide;
          } else {
            target.hide = true;
          }
        }
      });
      if (isHidden) {
        var target = {
          "aggregator":"avg",
          "currentTagKey":"",
          "currentTagValue":"",
          "downsampleAggregator":"avg",
          "downsampleInterval":"1m",
          "errors":{},
          "hide":false,
          "isCounter":false,
          "metric":_.getMetricName(metricName),
          "shouldComputeRate":false,
          "tags":{"host":metricNameMap[metricName][0]}
        };
        $scope.dashboard.rows[0].panels[0].targets.push(target);
        var seriesOverride = {
          "alias":_.getMetricName(metricName)+"{host"+"="+target.tags.host+"}",
          "yaxis": $scope.yaxisNumber++
        };
        $scope.dashboard.rows[0].panels[0].seriesOverrides.push(seriesOverride);
      }
      healthSrv.transformMetricType($scope.dashboard).then(function () {
        $scope.broadcastRefresh();
      });
    };

    $scope.resetCorrelation = function () {
      $location.path("alerts/association/" + alertHost + "/" + Math.floor($scope.thresholdSlider.get()) + "/" + alertMetric);
    };

    $scope.showNewAssociationManual = function() {
      var newScope = $scope.$new();
      newScope.datasource = $scope.datasource;
      $controller('OpenTSDBQueryCtrl', {$scope: newScope});
      newScope.addManualMetric = $scope.addManualMetric;
      $scope.suggestTagHost = backendSrv.suggestTagHost;
      $scope.appEvent('show-modal', {
        src: 'public/app/partials/manual_association.html',
        modalClass: 'modal-no-header confirm-modal',
        scope: newScope
      });
    };

    $scope.addManualMetric = function (target) {
      target.metric = contextSrv.user.orgId + "." + contextSrv.user.systemId + "." + target.metric;
      if (_.indexOf(_.keys($scope.correlatedMetrics),target.metric) > -1) {
        if($scope.correlatedMetrics[target.metric][0] === target.host)
          return;
      }
      $scope.correlatedMetrics[target.metric] = [target.host];
      $scope.addQuery(target.metric);
      $scope.manualMetrics.push(target.metric);
    };

    $scope.isManualMetric = function (metricName) {
      return _.indexOf($scope.manualMetrics, metricName) > -1 ? true : false;
    };

    $scope.removeAllQuery = function() {
      $scope.isAssociation = false;
      $scope.correlatedMetrics = {};
      var metric = _.getMetricName(alertMetric);
      if($scope.dashboard) {
        _.each($scope.dashboard.rows[0].panels[0].targets, function (target) {
          if(target.metric === metric){
            target.hide = false;
          } else {
            target.hide = true;
          }
        });
      }
    };

    $scope.addRCA = function () {
      $scope.appEvent('confirm-modal', {
        title: '添加',
        text: '您确定要添加选定关联信息添加RCA吗？',
        yesText: '确定',
        noText: '取消',
        onConfirm: function() {
          var prox = contextSrv.user.orgId + '.' + contextSrv.user.systemId + '.';
          var targets = $scope.dashboard.rows[0].panels[0].targets;
          var rcaFeedback = {
            alertIds: [],
            timestampInSec: Math.round(new Date().getTime()/1000),
            triggerMetric: {
              name: alertMetric,
              host: alertHost,
            },
            rootCauseMetrics: [],
            relatedMetrics: [],
            org: contextSrv.user.orgId,
            sys: contextSrv.user.systemId
          };
          var rootCauseMetrics = _.filter($scope.ralationMetrics, {checked: true});
          _.each(rootCauseMetrics, function(target) {
            _.each(target.hosts, function(host) {
              rcaFeedback.rootCauseMetrics.push({
                name: target.metric,
                host: host,
                confidenceLevel: parseInt(target.confidenceLevel)
              });
            });
          });

          alertMgrSrv.rcaFeedback(rcaFeedback).then(function(response) {
            $scope.appEvent('alert-success', ['添加成功']);
          }, function(err) {
            $scope.appEvent('alert-error', ['添加失败']);
          });
        }
      });
    };

    $scope.init();
  });

  module.directive('slider', function() {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element) {
        noUiSlider.create(element[0], {
          start: scope.$parent.correlationThreshold,
          connect: [true, false],
          tooltips: true,
          step: 10,
          range: {
            'min': 10,
            'max': 1000
          }
        });
        scope.$parent.thresholdSlider = element[0].noUiSlider;
      }
    };
  });
});
