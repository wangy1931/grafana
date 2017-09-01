import angular from 'angular';
import coreModule from '../../core/core_module';

export class UagentCollectorCtrl {
  collectors: any;
  serviceId: any;
  config: any;
  constructor(private $scope, private backendSrv, private $location) {
    this.serviceId = this.$location.search().serviceId;
    // this.collectors = 
    // [
    //   {
    //     name: "Cloudmon",
    //     fullPath: "/opt/cloudwiz-agent/agent/collectors/conf/cloudmon.conf",
    //     type: "Configuration",
    //     key: "Cloudwiz_Configuration_Template_Collector_Cloudmon",
    //     serviceName: "collector"
    //   },
    //   {
    //     name: "Cpus_pctusage",
    //     fullPath: "/opt/cloudwiz-agent/agent/collectors/conf/cpus_pctusage.conf",
    //     type: "Configuration",
    //     key: "Cloudwiz_Configuration_Template_Collector_Cpus_pctusage",
    //     serviceName: "collector"
    //   },
    //   {
    //     name: "Cwagent",
    //     fullPath: "/opt/cloudwiz-agent/agent/collectors/conf/cwagent.conf",
    //     type: "Configuration",
    //     key: "Cloudwiz_Configuration_Template_Collector_Cwagent",
    //     serviceName: "collector"
    //   }
    // ];
    this.getService();
  }

  getService() {
    this.backendSrv.alertD({url: '/cmdb/config/configName?serviceName=collector'}).then((response) => {
      this.collectors = response.data;
    });
  }
}

coreModule.controller('UagentCollectorCtrl', UagentCollectorCtrl);
