
import _ from 'lodash';
import moment from 'moment';
import angular from 'angular';

export class DashNavCtrl {

  /** @ngInject */
  constructor($scope, $rootScope, alertSrv, $location, playlistSrv, backendSrv, $timeout, $translate) {

    $scope.init = function() {
      $scope.onAppEvent('save-dashboard', $scope.saveDashboard);
      $scope.onAppEvent('delete-dashboard', $scope.deleteDashboard);
      $scope.onAppEvent('export-dashboard', $scope.snapshot);
      $scope.onAppEvent('quick-snapshot', $scope.quickSnapshot);

      $scope.showSettingsMenu = $scope.dashboardMeta.canEdit || $scope.contextSrv.isEditor;

      if ($scope.dashboardMeta.isSnapshot) {
        $scope.showSettingsMenu = false;
        var meta = $scope.dashboardMeta;
        $scope.titleTooltip = 'Created: &nbsp;' + moment(meta.created).calendar();
        if (meta.expires) {
          $scope.titleTooltip += '<br>Expires: &nbsp;' + moment(meta.expires).fromNow() + '<br>';
        }
      }
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
      } else {
        backendSrv.post('/api/user/stars/dashboard/' + $scope.dashboard.id).then(function() {
          $scope.dashboardMeta.isStarred = true;
        });
      }
    };

    $scope.shareDashboard = function(tabIndex) {
      var modalScope = $scope.$new();
      modalScope.tabIndex = tabIndex;

      $scope.appEvent('show-modal', {
        src: 'public/app/features/dashboard/partials/shareModal.html',
        scope: modalScope
      });
    };

    $scope.quickSnapshot = function() {
      $scope.shareDashboard(1);
    };

    $scope.openSearch = function() {
      $scope.appEvent('show-dash-search');
    };

    $scope.hideTooltip = function(evt) {
      (<any>angular.element(evt.currentTarget)).tooltip('hide');
      $scope.appEvent('hide-dash-search');
    };

    $scope.makeEditable = function() {
      $scope.dashboard.editable = true;

      var clone = $scope.dashboard.getSaveModelClone();

      backendSrv.saveDashboard(clone, {overwrite: false}).then(function(data) {
        $scope.dashboard.version = data.version;
        $scope.appEvent('dashboard-saved', $scope.dashboard);
        $scope.appEvent('alert-success', ['Dashboard saved', 'Saved as ' + clone.title]);

        // force refresh whole page
        window.location.href = window.location.href;
      }, $scope.handleSaveDashError);
    };

    $scope.saveDashboard = function(options) {
      if ($scope.dashboardMeta.canSave === false) {
        return;
      }

      if (!$scope.dashboard.system) {
        $scope.appEvent('alert-warning', [$translate.i18n.i18n_fail, $translate.i18n.i18n_input_full]);
        return;
      }

      if (_.isEmpty($scope.dashboard.title)) {
        $scope.appEvent('alert-warning', [$translate.i18n.i18n_fail, $translate.i18n.i18n_input_full]);
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
        $scope.appEvent('alert-success', [$translate.i18n.i18n_success, $translate.i18n.i18n_saveAs + clone.title]);
      }, $scope.handleSaveDashError);
    };

    $scope.handleSaveDashError = function(err) {
      if (err.data && err.data.status === "version-mismatch") {
        err.isHandled = true;

        $scope.appEvent('confirm-modal', {
          title: '冲突',
          text: '有人已经更新这仪表盘了',
          text2: '您是否想直接覆盖并且保存您的操作',
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
          title: $translate.i18n.i18n_confilct,
          text: $translate.i18n.page_dash_save_name,
          text2: $translate.i18n.page_dash_edit_name,
          yesText: $translate.i18n.i18n_modify,
          icon: "fa-warning"
        });
      }
    };

    $scope.deleteDashboard = function() {
      $scope.appEvent('confirm-modal', {
        title: $translate.i18n.i18n_delete,
        text: $translate.i18n.i18n_sure_operator,
        text2: $scope.dashboard.title,
        icon: 'fa-trash',
        yesText: $translate.i18n.i18n_delete,
        onConfirm: function() {
          $scope.deleteDashboardConfirmed();
        }
      });
    };

    $scope.deleteDashboardConfirmed = function() {
      backendSrv.delete('/api/dashboards/db/' + $scope.dashboardMeta.slug).then(function() {
        $scope.appEvent('alert-success', ['Dashboard ', $scope.dashboard.title + ' Removed']);
        $location.url('/');
      });
    };

    $scope.saveDashboardAs = function() {
      var newScope = $rootScope.$new();
      newScope.clone = $scope.dashboard.getSaveModelClone();
      newScope.clone.editable = true;
      newScope.clone.hideControls = false;

      $scope.appEvent('show-modal', {
        src: 'public/app/features/dashboard/partials/saveDashboardAs.html',
        scope: newScope,
        modalClass: 'modal--narrow'
      });
    };

    $scope.exportDashboard = function() {
      var clone = $scope.dashboard.getSaveModelClone();
      clone.system = 0;
      var blob = new Blob([angular.toJson(clone, true)], { type: "application/json;charset=utf-8" });
      var wnd: any = window;
      wnd.saveAs(blob, $scope.dashboard.title + '-' + new Date().getTime() + '.json');
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

    $scope.newDashboard = function() {
      $rootScope.appEvent('show-modal', {
        src: 'public/app/partials/select_system.html',
        scope: $scope.$new(),
      });
    };

    $scope.init();
  }
}

export function dashNavDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/features/dashboard/dashnav/dashnav.html',
    controller: DashNavCtrl,
    transclude: true,
  };
}

angular.module('grafana.directives').directive('dashnav', dashNavDirective);
