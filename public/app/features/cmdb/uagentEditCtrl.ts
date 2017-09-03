import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class UagentEditCtrl {
  config: any;
  serviceId: any;
  confName: any;
  serviceName: any;
  constructor(private $scope, private backendSrv, private $location) {
    var search = this.$location.search();
    this.serviceId = search.serviceId;
    this.serviceName = search.serviceName;
    this.confName = search.confName;
    this.getConfig();
  }

  getConfig() {
    var url = '/cmdb/config/service?serviceId='+ this.serviceId + '&confName=' + this.confName;
    this.backendSrv.alertD({url: url}).then((response) => {
      _.each(response.data.sections, function (section) {
        _.each(section.props, function (prop) {
          if (prop.type === 'integer') {
            prop.value = parseInt(prop.value);
          }
        });
      });
      this.config = response.data;
    });
  }
}

coreModule.controller('UagentEditCtrl', UagentEditCtrl);
