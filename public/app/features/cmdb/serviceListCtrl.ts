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
    private backendSrv, private alertSrv, private contextSrv
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
      title: '删除',
      text: '您确认要删除该服务吗？',
      icon: 'fa-trash',
      yesText: '删除',
      noText: '取消',
      onConfirm: () => {
        this.backendSrv.alertD({
          method: 'DELETE',
          url   : '/cmdb/agent/service',
          params: { 'id': id }
        }).then(() => {
          this.alertSrv.set("删除成功", '', "success", 2000);
          _.remove(this.services, { id: id });
        }, (err) => {
          this.alertSrv.set("删除失败", err.data, "error", 2000);
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
