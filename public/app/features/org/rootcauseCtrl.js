define([
    'angular',
    'lodash',
    'grap-drawing'
  ],
  function (angular, _, sigma) {
    'use strict';

    var module = angular.module('grafana.controllers');
    module.controller('RootCauseCtrl', function ($scope) {
      $scope.init = function () {
        console.log($scope.rootCauseList);

        var i,
          s,
          N = 100,
          E = 500,
          g = {
            nodes: [],
            edges: []
          };

// Generate a random graph:
        for (i = 0; i < N; i++) {
          g.nodes.push({
            id: 'n' + i,
            label: 'Node ' + i,
            x: Math.random(),
            y: Math.random(),
            size: Math.random(),
            color: '#666'
          });
        }

        for (i = 0; i < E; i++) {
          g.edges.push({
            id: 'e' + i,
            source: 'n' + (Math.random() * N | 0),
            target: 'n' + (Math.random() * N | 0),
            size: Math.random(),
            color: '#ccc'
          });
        }
// Instantiate sigma:
        s = new sigma({
          graph: g,
          settings: {
            enableHovering: false
          }
        });

        s.addRenderer({
          id: 'main',
          type: 'svg',
          container: document.getElementById('graph-container'),
          freeStyle: true
        });

        s.refresh();

// Binding silly interactions
        function mute(node) {
          if (!~node.getAttribute('class').search(/muted/))
            node.setAttributeNS(null, 'class', node.getAttribute('class') + ' muted');
        }

        function unmute(node) {
          node.setAttributeNS(null, 'class', node.getAttribute('class').replace(/(\s|^)muted(\s|$)/g, '$2'));
        }

        $('.sigma-node').click(function () {

          // Muting
          $('.sigma-node, .sigma-edge').each(function () {
            mute(this);
          });

          // Unmuting neighbors
          var neighbors = s.graph.neighborhood($(this).attr('data-node-id'));
          neighbors.nodes.forEach(function (node) {
            unmute($('[data-node-id="' + node.id + '"]')[0]);
          });

          neighbors.edges.forEach(function (edge) {
            unmute($('[data-edge-id="' + edge.id + '"]')[0]);
          });
        });

        s.bind('clickStage', function () {
          $('.sigma-node, .sigma-edge').each(function () {
            unmute(this);
          });
        });

      };

      $scope.nodeChange = function (metricName) {
        console.log(metricName);
      };

    });
  });
