import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class ServiceListCtrl {
  searchHost: string;
  order: string;
  desc: boolean;
  isScan: boolean;
  services: any;

  /** @ngInject */
  constructor(
    private $scope, private $location, private $timeout,
    private backendSrv, private alertSrv, private contextSrv, private $translate
  ) {
    this.searchHost = '';
    this.order = "'name'";
    this.desc = false;
    this.getService();
    this.isScan = false;
  }

  getService() {
    this.backendSrv.alertD({url: '/cmdb/service'}).then(result => {
      this.services = result.data;
    });
  }

  getDetail(service) {
    this.$location.url('/cmdb/servicelist/servicedetail?id='+service.id);
  };

  orderBy(order) {
    this.order = "'"+ order +"'";
    this.desc = !this.desc;
  };

  deleteService(id) {
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_delete,
      text: this.$translate.i18n.i18n_sure_operator,
      icon: 'fa-trash',
      yesText: this.$translate.i18n.i18n_delete,
      noText: this.$translate.i18n.i18n_cancel,
      onConfirm: () => {
        this.backendSrv.alertD({
          method: 'DELETE',
          url   : '/cmdb/agent/service',
          params: { 'id': id }
        }).then(() => {
          this.alertSrv.set(this.$translate.i18n.i18n_success, '', "success", 2000);
          _.remove(this.services, { id: id });
        }, (err) => {
          this.alertSrv.set(this.$translate.i18n.i18n_fail, err.data, "error", 2000);
        });
      }
    });
  };

  serviceScan() {
    this.isScan = true;
    this.backendSrv.alertD({
      url: '/cmdb/service/state/update',
      method: 'post'
    }).then((response) => {
      this.isScan = false;
      this.getService();
    }, () => {
      this.isScan = false;
    });
  };

}

coreModule.controller('ServiceListCtrl', ServiceListCtrl);
