define([
  'angular',
  'jquery',
  'app/core/config',
  'moment',
],
function (angular, $, config, moment) {
  "use strict";

  var module = angular.module('grafana.controllers');

  module.controller('DashboardCtrl', function(
      $scope,
      $rootScope,
      dashboardKeybindings,
      timeSrv,
      templateValuesSrv,
      dynamicDashboardSrv,
      dashboardSrv,
      unsavedChangesSrv,
      dashboardViewStateSrv,
      contextSrv,
      backendSrv,
      $timeout,
      $location
    ) {

    $scope.editor = { index: 0 };
    $scope.panels = config.panels;

    var resizeEventTimeout;

    this.init = function(dashboard) {
      $scope.resetRow();
      $scope.registerWindowResizeEvent();
      $scope.onAppEvent('show-json-editor', $scope.showJsonEditor);
      $scope.setupDashboard(dashboard);
    };

    $scope.setupDashboard = function(data) {
      $rootScope.performance.dashboardLoadStart = new Date().getTime();
      $rootScope.performance.panelsInitialized = 0;
      $rootScope.performance.panelsRendered = 0;

      var dashboard = dashboardSrv.create(data.dashboard, data.meta);
      dashboardSrv.setCurrent(dashboard);

      // init services
      timeSrv.init(dashboard);

      // template values service needs to initialize completely before
      // the rest of the dashboard can load
      templateValuesSrv.init(dashboard).finally(function() {
        dynamicDashboardSrv.init(dashboard);
        unsavedChangesSrv.init(dashboard, $scope);

        $scope.dashboard = dashboard;
        $scope.dashboardMeta = dashboard.meta;
        $scope.dashboardViewState = dashboardViewStateSrv.create($scope);

        dashboardKeybindings.shortcuts($scope);

        $scope.updateSubmenuVisibility();
        $scope.setWindowTitleAndTheme();
      }).catch(function(err) {
        if (err.data && err.data.message) { err.message = err.data.message; }
        $scope.appEvent("alert-error", ['仪表盘初始化失败', '模板不能被正常的初始化: ' + err.message]);
      });

      $scope.appEvent("dashboard-loaded", $scope.dashboard);

      $scope.detectTemplatingNeeded(dashboard);
    };

    $scope.detectTemplatingNeeded = function(dashboard) {
      var exsitAllValue = 0;
      // 检测是否有标签值为 *, 只在 dashboard 页面
      if (/\/dashboard\/db/.test($location.path())) {
        _.each(dashboard.rows, function (row) {
          _.each(row.panels, function (panel) {
            _.each(panel.targets, function (target) {
              _.each(target.tags, function (val, key) {
                if (val === "*") {
                  exsitAllValue++;
                  return;
                }
              });
            });
          });
        });
      }
      if (exsitAllValue) {
        $scope.appEvent('confirm-modal', {
          title: '自动添加模板',
          text: '仪表盘中标签的值过多，是否开启模板功能？',
          icon: 'fa-warning',
          yesText: '开启',
          noText: '取消',
          onConfirm: function() {
            $scope.$broadcast('auto-templating-start');
            $scope.updateSubmenuVisibility();
          }
        });
      }
    };

    $scope.updateSubmenuVisibility = function() {
      $scope.submenuEnabled = $scope.dashboard.isSubmenuFeaturesEnabled();
    };

    $scope.setWindowTitleAndTheme = function() {
      window.document.title = config.window_title_prefix + $scope.dashboard.title;
    };

    $scope.broadcastRefresh = function() {
      $rootScope.performance.panelsRendered = 0;
      $rootScope.$broadcast('refresh');
    };

    $scope.addRow = function(dash, row) {
      dash.rows.push(row);
    };

    $scope.addRowDefault = function() {
      $scope.resetRow();
      $scope.row.title = 'New row';
      $scope.addRow($scope.dashboard, $scope.row);
    };

    $scope.resetRow = function() {
      $scope.row = {
        title: '',
        height: '250px',
        editable: true,
      };
    };

    $scope.showJsonEditor = function(evt, options) {
      var editScope = $rootScope.$new();
      editScope.object = options.object;
      editScope.updateHandler = options.updateHandler;
      $scope.appEvent('show-dash-editor', { src: 'public/app/partials/edit_json.html', scope: editScope });
    };

    $scope.onDrop = function(panelId, row, dropTarget) {
      var info = $scope.dashboard.getPanelInfoById(panelId);
      if (dropTarget) {
        var dropInfo = $scope.dashboard.getPanelInfoById(dropTarget.id);
        dropInfo.row.panels[dropInfo.index] = info.panel;
        info.row.panels[info.index] = dropTarget;
        var dragSpan = info.panel.span;
        info.panel.span = dropTarget.span;
        dropTarget.span = dragSpan;
      }
      else {
        info.row.panels.splice(info.index, 1);
        info.panel.span = 12 - $scope.dashboard.rowSpan(row);
        row.panels.push(info.panel);
      }

      $rootScope.$broadcast('render');
    };

    $scope.registerWindowResizeEvent = function() {
      angular.element(window).bind('resize', function() {
        $timeout.cancel(resizeEventTimeout);
        resizeEventTimeout = $timeout(function() { $scope.$broadcast('render'); }, 200);
      });
      $scope.$on('$destroy', function() {
        angular.element(window).unbind('resize');
      });
    };

    $scope.timezoneChanged = function() {
      $rootScope.$broadcast("refresh");
    };

    $scope.formatDate = function(date) {
      return moment(date).format('MMM Do YYYY, h:mm:ss a');
    };

  });

});
