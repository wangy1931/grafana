///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class ResourceSrv {

  groups: Array<any> = [];
  list: Array<any> = [];

  /** @ngInject */
  constructor(private $http, private $timeout, private $q, private alertSrv, private backendSrv) {
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

}

coreModule.service('resourceSrv', ResourceSrv);
