define([
    'angular',
    'lodash',
    'sigma',
    'sigma-edge'
  ],
  function (angular, _, sigma) {
    'use strict';

    var module = angular.module('grafana.controllers');
    module.controller('RootCauseCtrl', function ($scope, popoverSrv, $element) {
      $scope.init = function () {
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
            element: $element.find("#pop-container"),
            templateUrl: 'app/partials/edgepicker.html',
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

        $scope.rcaGraph.refresh();
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

        console.log(metricName);
      };

    });
  });
