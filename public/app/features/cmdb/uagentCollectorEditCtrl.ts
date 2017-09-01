import angular from 'angular';
import coreModule from '../../core/core_module';

export class UagentCollectorEditCtrl {
  config: any;
  serviceId: any;
  confName: any;
  constructor(private $scope, private backendSrv, private $location) {
    var search = this.$location.search()
    this.serviceId = search.serviceId;
    this.confName = search.confName;
    // this.config = {
    //   "id": 1367,
    //   "orgId": 2,
    //   "sysId": 2,
    //   "key": "Cloudwiz_Configuration_Template_Collector_Cloudmon",
    //   "type": "Configuration",
    //   "name": "Cloudmon",
    //   "fullPath": "/opt/cloudwiz-agent/agent/collectors/conf/cloudmon.conf",
    //   "lastModifiedBy": "233",
    //   "cfgVersion": 21,
    //   "configType": "service",
    //   "props": null,
    //   "sections": [
    //     {
    //       "name": "base",
    //       "props": [
    //         {
    //           "id": 1368,
    //           "orgId": 2,
    //           "sysId": 2,
    //           "key": "Cloudwiz_ConfigProperty_Template_Collector_Cloudmon_Enable",
    //           "CItype": "ConfigProperty",
    //           "section": "base",
    //           "name": "enable",
    //           "value": "true",
    //           "type": "enum",
    //           "isCollection": false,
    //           "readOnly": false,
    //           "minValue": -2147483648,
    //           "enumValues": [
    //             "true",
    //             "false"
    //           ],
    //           "changed": false
    //         },
    //         {
    //           "id": 1369,
    //           "orgId": 2,
    //           "sysId": 2,
    //           "key": "Cloudwiz_ConfigProperty_Template_Collector_Cloudmon_Interval",
    //           "CItype": "ConfigProperty",
    //           "section": "base",
    //           "name": "interval",
    //           "value": "30",
    //           "type": "integer",
    //           "isCollection": false,
    //           "readOnly": false,
    //           "minValue": 1,
    //           "enumValues": null,
    //           "changed": false
    //         }
    //       ]
    //     }
    //   ]
    // };
    this.getConfig();
  }

  getConfig() {
    var url = '/cmdb/config/service?serviceId='+ this.serviceId + '&confName=' + this.confName;
    this.backendSrv.alertD({url: url}).then((response) => {
      this.config = response.data;
    });
  }
}

coreModule.controller('UagentCollectorEditCtrl', UagentCollectorEditCtrl);
