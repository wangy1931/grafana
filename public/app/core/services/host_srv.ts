///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class HostSrv {

  /** @ngInject */
  constructor(private $http, private backendSrv) {
    // ...
  }

  // Tags

  getTags(hostId) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host/tags',
      params: { 'hostId': hostId }
    });
  }

  getAllTagsKey() {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host/tags/key'
    });
  }

  getTagValue(keyId) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host/tags/value',
      params: { 'kId': keyId }
    });
  }

  postTag({ keyId, valueId }) {
    return this.backendSrv.alertD({
      method: 'POST',
      url   : '/host/tags/value',
      data  : { 'kId': keyId, 'vId': valueId }
    });
  }

  deleteTag({ hostId, valueId }) {
    return this.backendSrv.alertD({
      method: 'DELETE',
      url   : '/host/tags',
      data  : { 'hostId': hostId, 'vId': valueId }
    });
  }

  // Host Topology

  getHostTopology({ kId, status }) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host_topology',
      params: { 'groupby': kId, 'colorby': status }
    });
  }

}

coreModule.service('hostSrv', HostSrv);
