define([
  'angular',
  'lodash',
  'config'
],
function (angular, _, config) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('RowCtrl', function($scope, $rootScope, $timeout) {
    var _d = {
      title: "Row",
      height: "150px",
      collapse: false,
      editable: true,
      panels: [],
    };

    _.defaults($scope.row,_d);

    $scope.init = function() {
      $scope.editor = {index: 0};
    };

    $scope.togglePanelMenu = function(posX) {
      $scope.showPanelMenu = !$scope.showPanelMenu;
      $scope.panelMenuPos = posX;
    };

    $scope.toggleRow = function(row) {
      row.collapse = row.collapse ? false : true;
      if (!row.collapse) {
        $timeout(function() {
          $scope.$broadcast('render');
        });
      }
    };

    $scope.addPanel = function(panel) {
      $scope.dashboard.addPanel(panel, $scope.row);
    };

    $scope.deleteRow = function() {
      $scope.appEvent('confirm-modal', {
        title: 'Are you sure you want to delete this row?',
        icon: 'fa-trash',
        yesText: 'Delete',
        onConfirm: function() {
          $scope.dashboard.rows = _.without($scope.dashboard.rows, $scope.row);
        }
      });
    };

    $scope.moveRow = function(direction) {
      var rowsList = $scope.dashboard.rows;
      var rowIndex = _.indexOf(rowsList, $scope.row);
      var newIndex = rowIndex;
      switch(direction) {
        case 'up': {
          newIndex = rowIndex - 1;
          break;
        }
        case 'down': {
          newIndex = rowIndex + 1;
          break;
        }
        case 'top': {
          newIndex = 0;
          break;
        }
        case 'bottom': {
          newIndex = rowsList.length - 1;
          break;
        }
        default: {
          newIndex = rowIndex;
        }
      }
      if (newIndex >= 0 && newIndex <= (rowsList.length - 1)) {
        _.move(rowsList, rowIndex, newIndex);
      }
    };

    $scope.addPanelDefault = function(type) {
      var defaultSpan = 12;
      var _as = 12 - $scope.dashboard.rowSpan($scope.row);

      var panel = {
        title: config.new_panel_title,
        error: false,
        span: _as < defaultSpan && _as > 0 ? _as : defaultSpan,
        editable: true,
        type: type
      };

      $scope.addPanel(panel);

      $timeout(function() {
        $scope.$broadcast('render');
      });
    };

    $scope.setHeight = function(height) {
      $scope.row.height = height;
      $scope.$broadcast('render');
    };

    $scope.removePanel = function(panel) {
      $scope.appEvent('confirm-modal', {
        title: 'Are you sure you want to remove this panel?',
        icon: 'fa-trash',
        yesText: 'Delete',
        onConfirm: function() {
          $scope.row.panels = _.without($scope.row.panels, panel);
        }
      });
    };

    $scope.updatePanelSpan = function(panel, span) {
      panel.span = Math.min(Math.max(Math.floor(panel.span + span), 1), 12);
    };

    $scope.replacePanel = function(newPanel, oldPanel) {
      var row = $scope.row;
      var index = _.indexOf(row.panels, oldPanel);
      row.panels.splice(index, 1);

      // adding it back needs to be done in next digest
      $timeout(function() {
        newPanel.id = oldPanel.id;
        newPanel.span = oldPanel.span;
        row.panels.splice(index, 0, newPanel);
      });
    };

    $scope.createAlertGraphPanel = function(triggeredAlert) {
      var defaultSpan = 12;
      var _as = 12 - $scope.dashboard.rowSpan($scope.row);
      var triggeredMetric = triggeredAlert.alertDetails.hostQuery.metricQueries[0].metric;

      var panel = {
        title: triggeredAlert.name,
        error: false,
        span: _as < defaultSpan && _as > 0 ? _as : defaultSpan,
        editable: false,
        type: "graph",
        targets: [{aggregator: "avg", metric: triggeredMetric, downsampleAggregator: "avg", downsampleInterval: "1m"}],
        links: [
          {
            title: "Associated Metrics",
            type: "absolute",
            url: "alerts/association/" + triggeredAlert.id
          }, {
            targetBlank: "true",
            title: "Associated Log Info",
            type: "absolute",
            url: "http://localhost:5601/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),"+
            "time:(from:now-30m,mode:quick,to:now))&_a=(columns:!(message,host),index:'logstash-*',interval:auto,"+
            "query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))"
          }
        ]
      };

      $scope.addPanel(panel);

      $timeout(function() {
        $scope.$broadcast('render');
      });

    };

    $scope.createAssociatedMetricGraphPanel = function(associatedMetrics) {
      var defaultSpan = 12;
      var _as = 12 - $scope.dashboard.rowSpan($scope.row);
      var hostTag = "*";

      var targetMetrics = [];
      for (var k = 0; k < associatedMetrics.length; k++) {
        var oneMetric = {};
        oneMetric.aggregator = "avg";
        oneMetric.downsampleAggregator = "avg";
        oneMetric.downsampleInterval = "1m";
        oneMetric.metric = associatedMetrics[k].metric;
        if (associatedMetrics[k].hosts.length > 0) {
          hostTag = associatedMetrics[k].hosts[0];
          for (var i = 1; i < associatedMetrics[k].hosts.length; i++) {
            hostTag += "|" + associatedMetrics[k].hosts[i];
          }
        }
        oneMetric.tags = {
          host: hostTag
        };
        targetMetrics.push(oneMetric);
      }

      var panel = {
        title: associatedMetrics[0].metric,
        error: false,
        span: _as < defaultSpan && _as > 0 ? _as : defaultSpan,
        editable: false,
        type: "graph",
        targets: targetMetrics,
      };

      $scope.addPanel(panel);

      $timeout(function() {
        $scope.$broadcast('render');
      });

    };

    $scope.init();
  });

  module.directive('rowHeight', function() {
    return function(scope, element) {
      scope.$watchGroup(['row.collapse', 'row.height'], function() {
        element.css({ minHeight: scope.row.collapse ? '5px' : scope.row.height });
      });

      scope.onAppEvent('panel-fullscreen-enter', function(evt, info) {
        var hasPanel = _.findWhere(scope.row.panels, {id: info.panelId});
        if (!hasPanel) {
          element.hide();
        }
      });

      scope.onAppEvent('panel-fullscreen-exit', function() {
        element.show();
      });
    };
  });

  module.directive('panelWidth', function() {
    return function(scope, element) {
      function updateWidth() {
        element[0].style.width = ((scope.panel.span / 1.2) * 10) + '%';
      }

      scope.onAppEvent('panel-fullscreen-enter', function(evt, info) {
        if (scope.panel.id !== info.panelId) {
          element.hide();
        } else {
          element[0].style.width = '100%';
        }
      });

      scope.onAppEvent('panel-fullscreen-exit', function(evt, info) {
        if (scope.panel.id !== info.panelId) {
          element.show();
        } else {
          updateWidth();
        }
      });

      scope.$watch('panel.span', updateWidth);
    };
  });

  module.directive('panelDropZone', function() {
    return function(scope, element) {
      scope.$on("ANGULAR_DRAG_START", function() {
        var dropZoneSpan = 12 - scope.dashboard.rowSpan(scope.row);

        if (dropZoneSpan > 0) {
          element.find('.panel-container').css('height', scope.row.height);
          element[0].style.width = ((dropZoneSpan / 1.2) * 10) + '%';
          element.show();
        }
      });

      scope.$on("ANGULAR_DRAG_END", function() {
        element.hide();
      });
    };
  });

});
