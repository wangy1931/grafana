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
    private contextSrv,
    private $translate
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
      this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_sorry, this.$translate.i18n.i18n_no_authority]);
      return;
    }
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_delete,
      text: this.$translate.i18n.i18n_sure_operator,
      icon: 'fa-trash',
      yesText: this.$translate.i18n.i18n_delete,
      noText: this.$translate.i18n.i18n_cancel,
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
      this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_sorry, this.$translate.i18n.i18n_no_authority]);
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
