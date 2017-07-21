define([
    'angular',
    'lodash',
    'app/app',
    'sigma',
    'sigma-edge',
  ],
  function (angular, _, app, sigma) {
    'use strict';

    var module = angular.module('grafana.controllers');
    // app.useModule(module);

    module.controller('BuildDependCtrl', function ($scope, popoverSrv, backendSrv) {
      $scope.init = function () {
        $scope.update = false;
        $scope.getInstalledService();
        $scope.edge = {
          start: null,
          end: null
        };
        $scope.start = false;
        var i, N = 10, E = 20, L = 4,
          g = {
            nodes: [],
            edges: []
          };

        // Instantiate sigma:
        $scope.rcaGraph = new sigma({
          graph: g,
          settings: {
            enableHovering: false,
            enableEdgeHovering: true,
            edgeHoverSizeRatio: 2,
            defaultArrowSize: 10
          }
        });

        $scope.rcaGraph.addRenderer({
          id: 'main',
          type: 'canvas',
          container: document.getElementById('graph-container'),
          freeStyle: true
        });
        $scope.rcaGraph.bind('clickNode', function (e) {
          var nodeId = e.data.node.id;

          var popoverScope = $scope.$new();
          popoverScope.edgeStart = $scope.edgeStart;
          popoverScope.edgeEnd = $scope.edgeEnd;
          popoverScope.clear = $scope.clear;
          popoverScope.start = $scope.start;
          popoverScope.nodeId = nodeId;

          popoverSrv.show({
            element: angular.element("#pop-container"),
            templateUrl: 'app/features/service_dependency/partials/addDepend.html',
            scope: popoverScope
          });
        });

        $scope.edgeStart = function (nodeId) {
          $scope.edge.start = nodeId;
          $scope.start = true;
        };

        $scope.edgeEnd = function (nodeId) {
          $scope.edge.end = nodeId;
          console.log($scope.edge.start);
          console.log($scope.edge.end);
          $scope.rcaGraph.graph.addEdge({
            id: $scope.edge.start + "-" + $scope.edge.end,
            source: $scope.edge.start,
            target: $scope.edge.end,
            type: 'arrow',
            size: 7,
            color: '#c6583e'
          });

          $scope.rcaGraph.refresh();

          $scope.start = false;
        };

        $scope.clear = function () {
          $scope.edge.start = null;
          $scope.edge.end = null;
          $scope.start = false;
        };

        $scope.loadServiceDependency();
        $scope.rcaGraph.refresh();
      };

      $scope.getInstalledService = function () {
        $scope.services = _.allServies();
      };

      $scope.nodeChange = function (metricName) {
        var L = 4, N = 20;
        var nodesSum = $scope.rcaGraph.graph.nodes().length;

        try {
          $scope.rcaGraph.graph.dropNode(metricName);
        } catch (err) {
          $scope.rcaGraph.graph.addNode({
            id: metricName,
            label: _.getMetricName(metricName),
            x: L * Math.cos(Math.PI * 2 * (nodesSum + 1) / N - Math.PI / 2),
            y: L * Math.sin(Math.PI * 2 * (nodesSum + 1) / N - Math.PI / 2),
            size: 1,
            color: '#666'
          });
        }
        $scope.rcaGraph.refresh();
      };

      $scope.save = function () {
        var graph = {
          nodes: $scope.rcaGraph.graph.nodes(),
          edges: $scope.rcaGraph.graph.edges()
        };
        if ($scope.update) {
          $scope.updateServiceDependency(graph);
        } else {
          $scope.createServiceDependency(graph);
        }
      };

      $scope.createServiceDependency = function (graph) {
        backendSrv.alertD({
          method: "post",
          url: "/cmdb/service/depend",
          data: angular.toJson(graph),
          headers: {'Content-Type': 'text/plain'}
        });
      };

      $scope.loadServiceDependency = function () {
        backendSrv.alertD({url: "/cmdb/service/depend"}).then(function (res) {
          if (!_.isNull(res.data)) {
            var dep = angular.fromJson(res.data[0].attributes[0].value);
            $scope.rcaGraph.graph.read(dep);
            $scope.update = true;
            $scope.updateId = res.data[0].id;
            $scope.graphId = res.data[0].attributes[0].id;
            $scope.rcaGraph.refresh();
          }
        });
      };

      $scope.updateServiceDependency = function (graph) {
        backendSrv.alertD({
          method: "PUT",
          url: "/cmdb/service/depend?id=" + $scope.updateId + "&aid=" + $scope.graphId,
          data: angular.toJson(graph),
          headers: {'Content-Type': 'text/plain'}
        })
      };

      $scope.init();
    });
  });