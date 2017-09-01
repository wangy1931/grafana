import angular from 'angular';
import coreModule from '../../core/core_module';

export class UagentFilebeatCtrl {
  serviceId: any;
  config: any;

  constructor (private $scope, private backendSrv, private $location) {
    this.serviceId = this.$location.search().serviceId;
    this.getService();
  }

  getService() {
    this.backendSrv.alertD({url: '/cmdb/config/configName?serviceName=filebeat'}).then((response) => {
      this.config = response.data;
    });
  }
}

coreModule.controller('UagentFilebeatCtrl', UagentFilebeatCtrl);
