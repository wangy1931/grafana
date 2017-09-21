import angular from 'angular';
import coreModule from '../../core/core_module';

export class UagentCtrl {
  configs: any;
  serviceId: any;
  serviceName: any;
  searchConf: any;
  constructor(private $scope, private backendSrv, private $location) {
    var search = this.$location.search();
    this.serviceId = search.serviceId;
    this.serviceName = search.serviceName;
    this.searchConf = '';
    this.getService();
  }

  getService() {
    this.backendSrv.alertD({url: '/cmdb/config/configName?serviceName=' + this.serviceName + '&serviceId=' + this.serviceId}).then((response) => {
      this.configs = response.data;
    });
  }
}

coreModule.controller('UagentCtrl', UagentCtrl);
