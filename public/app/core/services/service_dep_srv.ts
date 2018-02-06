
import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class ServiceDepSrv {

  topology: Array<any>;

  /** @ngInject */
  constructor(private $http, private $timeout, private $q, private alertSrv, private backendSrv) {
  }

  // All Services
  readInstalledService() {
    return this.backendSrv.alertD({
      url: "/cmdb/service"
    });
  }

  // Service Dependency
  createServiceDependency(graph) {
    return this.backendSrv.alertD({
      method: "post",
      url: "/cmdb/service/depend",
      data: graph,
      headers: {'Content-Type': 'text/plain'}
    });
  }

  updateServiceDependency(graph, updateId, graphId) {
    return this.backendSrv.alertD({
      method: "PUT",
      url: "/cmdb/service/depend?id=" + updateId + "&aid=" + graphId,
      data: graph,
      headers: {'Content-Type': 'text/plain'}
    });
  }

  readServiceDependency() {
    return this.backendSrv.alertD({
      url: "/cmdb/service/depend"
    });
  }

  // Kpi
  readServiceStatus(serviceId, serviceName) {
    return this.backendSrv.alertD({
      url: "/service/status?hostStatusIncluded=false&service=" + serviceName + "&serviceId=" + serviceId
    });
  }

  readHostStatus(serviceId, serviceName) {
    return this.backendSrv.alertD({
      url: "/service/status?healthItemType=ServiceState&service=" + serviceName + "&serviceId=" + serviceId
    });
  }

  readMetricStatus(serviceId, serviceName) {
    return this.backendSrv.alertD({
      url: "/service/status?service=" + serviceName + "&serviceId=" + serviceId
    });
  }

  // Service Topology
  getServiceTopologyData(params) {
    return this.readInstalledService().then(response => {
      var promiseList = [];
      this.topology = [];

      response.data.forEach(item => {
        var q = this.readServiceStatus(item.id, item.name).then(response => {
          this.topology.push({
            parent: 'All',
            name  : item.name,
            value : response.data.healthStatusType.toLowerCase(),
            _private_: item
          });
        }, err => {
          this.topology.push({
            parent: 'All',
            name  : item.name,
            value : 'grey',
            _private_: item
          });
        });
        promiseList.push(q);
      });

      return this.$q.all(promiseList).then(() => {
        this.topology = _.orderBy(this.topology, ['name'], ['asc']);

        return this.topology;
      });
    });
  }

}

coreModule.service('serviceDepSrv', ServiceDepSrv);
