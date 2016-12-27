define([
  'angular',
  'lodash',
  'config',
  'store',
  'filesaver'
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('DashboardNavCtrl', function($scope, $rootScope, alertSrv, $location, playlistSrv, backendSrv, $timeout) {

    $scope.init = function() {
      $scope.onAppEvent('save-dashboard', $scope.saveDashboard);
      $scope.onAppEvent('delete-dashboard', $scope.deleteDashboard);
    };

    $scope.openEditView = function(editview) {
      var search = _.extend($location.search(), {editview: editview});
      $location.search(search);
    };

    $scope.starDashboard = function() {
      if ($scope.dashboardMeta.isStarred) {
        backendSrv.delete('/api/user/stars/dashboard/' + $scope.dashboard.id).then(function() {
          $scope.dashboardMeta.isStarred = false;
        });
      }
      else {
        backendSrv.post('/api/user/stars/dashboard/' + $scope.dashboard.id).then(function() {
          $scope.dashboardMeta.isStarred = true;
        });
      }
    };

    $scope.shareDashboard = function() {
      $scope.appEvent('show-modal', {
        src: './app/features/dashboard/partials/shareModal.html',
        scope: $scope.$new(),
      });
    };

    $scope.openSearch = function() {
      $scope.appEvent('show-dash-search');
    };

    $scope.hideTooltip = function(evt) {
      angular.element(evt.currentTarget).tooltip('hide');
      $scope.appEvent('hide-dash-search');
    };

    $scope.saveDashboard = function(options) {
      if ($scope.dashboardMeta.canSave === false) {
        return;
      }

      var clone = $scope.dashboard.getSaveModelClone();

      backendSrv.saveDashboard(clone, options).then(function(data) {
        $scope.dashboard.version = data.version;
        $scope.appEvent('dashboard-saved', $scope.dashboard);

        var dashboardUrl = '/dashboard/db/' + data.slug;

        if (dashboardUrl !== $location.path()) {
          $location.url(dashboardUrl);
        }
        backendSrv.updateSystemId(clone.system);
        backendSrv.post("/api/dashboards/system", {DashId: data.id.toString(), SystemId: clone.system});
        $scope.appEvent('alert-success', ['仪表盘保存成功', '保存为' + clone.title]);
      }, $scope.handleSaveDashError);
    };

    $scope.handleSaveDashError = function(err) {
      if (err.data && err.data.status === "version-mismatch") {
        err.isHandled = true;

        $scope.appEvent('confirm-modal', {
          title: '有人已经更新这仪表盘了！',
          text: "您是否想直接覆盖并且保存您的操作?",
          yesText: "保存 & 覆盖",
          icon: "fa-warning",
          onConfirm: function() {
            $scope.saveDashboard({overwrite: true});
          }
        });
      }

      if (err.data && err.data.status === "name-exists") {
        err.isHandled = true;

        $scope.appEvent('confirm-modal', {
          title: '已经存在相同名字的仪表盘',
          text: "请修改您的仪表盘名称",
          yesText: "立即修改",
          icon: "fa-warning"
        });
      }
    };

    $scope.deleteDashboard = function() {
      $scope.appEvent('confirm-modal', {
        title: '您是否想删除 ' + $scope.dashboard.title + '?',
        icon: 'fa-trash',
        yesText: 'Delete',
        onConfirm: function() {
          $scope.deleteDashboardConfirmed();
        }
      });
    };

    $scope.deleteDashboardConfirmed = function() {
      backendSrv.delete('/api/dashboards/db/' + $scope.dashboardMeta.slug).then(function() {
        $scope.appEvent('alert-success', ['仪表盘', $scope.dashboard.title + ' 已经被移除']);
        $location.url('/');
      });
    };

    $scope.saveDashboardAs = function() {
      var newScope = $rootScope.$new();
      newScope.clone = $scope.dashboard.getSaveModelClone();
      newScope.clone.editable = true;
      newScope.clone.hideControls = false;

      $scope.appEvent('show-modal', {
        src: './app/features/dashboard/partials/saveDashboardAs.html',
        scope: newScope,
      });
    };

    $scope.exportDashboard = function() {
      var clone = $scope.dashboard.getSaveModelClone();
      var blob = new Blob([angular.toJson(clone, true)], { type: "application/json;charset=utf-8" });
      window.saveAs(blob, $scope.dashboard.title + '-' + new Date().getTime());
    };

    $scope.snapshot = function() {
      $scope.dashboard.snapshot = true;
      $rootScope.$broadcast('refresh');

      $timeout(function() {
        $scope.exportDashboard();
        $scope.dashboard.snapshot = false;
        $scope.appEvent('dashboard-snapshot-cleanup');
      }, 1000);

    };

    $scope.editJson = function() {
      var clone = $scope.dashboard.getSaveModelClone();
      $scope.appEvent('show-json-editor', { object: clone });
    };

    $scope.stopPlaylist = function() {
      playlistSrv.stop(1);
    };

  });

});