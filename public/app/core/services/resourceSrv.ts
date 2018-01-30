///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class ResourceSrv {

  groups: Array<any> = [];
  list: Array<any> = [];
  topology: Array<any> = [];
  topologyBackup: Array<any> = [];

  /** @ngInject */
  constructor(private $http, private $timeout, private $q, private alertSrv, private backendSrv, private hostSrv) {
  }

  getGroup() {
    return this.backendSrv.alertD({url: '/integration/azure/resourceGroups'}).then(result => {
      this.groups = result.data;
      this.groups.forEach(item => {
        item.value = item.name;
      })
      return this.groups;
    });
  }

  getList() {
    return this.backendSrv.alertD({url: '/integration/azure/resources'}).then(result => {
      this.list = result.data;
      this.list.forEach(item => {
        item.type = item.azureType,
        item.group = item.resourceGroup.split('/').pop()
      });
      return this.list;
    });
  }

  getDetail({id}) {
    return this.backendSrv.alertD({url: `/integration/azure/resources?id=${id}`}).then(result => {
      return result.data;
    });
  }

  getTopology() {
    return this.backendSrv.alertD({url: '/integration/azure/resources'}).then(result => {
      var promiseList = [];
      this.topology = [];

      result.data.forEach(item => {
        item.type = item.azureType;
        item.group = item.resourceGroup.split('/').pop();

        var q = this.hostSrv.getHostKpiById({ id: item.id }).then(response => {
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
        this.topologyBackup = _.orderBy(this.topology, ['name'], ['asc']);
        this.topology = _.orderBy(this.topology, ['name'], ['asc']);

        return this.topology;
      });
    });
  }

  getGroupTopologyData(params) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/integration/azure/resourceGroups',
      params: params
    }).then(response => {
      this.topology = [];

      response.data.resources && response.data.resources.forEach(item => {
        item.type = item.azureType;
        item.group = item.resourceGroup.split('/').pop();

        this.topology.push({
          parent: response.data.name,
          name  : item.name,
          value : _.find(this.topologyBackup, { name: item.name }).value || 'grey',
          _private_: item
        });
      });

      this.topology = _.orderBy(this.topology, ['name'], ['asc']);

      return this.topology;
    });
  }

  getGroupData(id) {
    if (!id) {
      return this.getTopology();
    } else {
      return this.getGroupTopologyData({ id: id });
    }
  }

}

coreModule.service('resourceSrv', ResourceSrv);
