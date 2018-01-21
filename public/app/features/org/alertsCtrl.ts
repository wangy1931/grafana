import angular from 'angular';
import _ from 'lodash';
import { coreModule } from 'app/core/core';

export class AlertsCtrl {
  alertDefList: any;
  exportJson: any;

  /** @ngInject */
  constructor (
    private $scope,
    private $rootScope,
    private $controller,
    private $location,
    private alertMgrSrv,
    private alertSrv,
    private contextSrv
  ) {
  }

  init() {
    this.alertMgrSrv.load().then(response => {
      this.alertDefList = response.data;
      this.exportJson = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data));
    }, err => {
      this.alertSrv.set("error", err.status + " " + (err.data || "Request failed"), err.severity, 10000);
    });
  }

  remove(alertId) {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
      return;
    }
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      text: '您是否需要删除这个报警规则',
      icon: 'fa-trash',
      yesText: '确定',
      noText: '关闭',
      onConfirm: () => {
        this.alertMgrSrv.remove(alertId).then(() => {
          _.remove(this.alertDefList, { id: alertId });
        }, err => {
          this.alertSrv.set("error", err.status + " " + (err.data || "Request failed"), err.severity, 10000);
        });
      }
    });
  }

  importAlerts() {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
      return;
    }
    var modalScope = this.$scope.$new();
    this.$scope.appEvent('show-modal', {
      src: 'public/app/partials/import_alerts.html',
      modalClass: 'modal-no-header confirm-modal',
      scope: modalScope
    });
  }
}

coreModule.controller('AlertsCtrl', AlertsCtrl);
