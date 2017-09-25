///<reference path="../../headers/common.d.ts" />

import coreModule from 'app/core/core_module';

export class HostSrv {

  /** @ngInject */
  constructor(private $http, private backendSrv) {
  }

  // Tags
  /**
   * Get the specific host information in cmdb.
   * @param hostId.
   * @returns {Array} Host information.
   */
  getCmdbHostInfo(hostId) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/cmdb/host',
      params: { 'id': hostId }
    });
  }

  /**
   * Get all tags key in this system.
   * @returns {Array} Tags key in this system.
   */
  getAllTagsKey() {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host/tag/key'
    });
  }

  /**
   * Get the specific tag's value.
   * @returns {Array} Tag's value.
   */
  getTagValue(key) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host/tag/value',
      params: { 'key': key }
    });
  }

  /**
   * Post a tag.
   * @returns {String|Null} If the tag was added, return the tag key. Otherwise, none.
   */
  postTag({ key, value, hostId }) {
    return this.backendSrv.alertD({
      method: 'POST',
      url   : '/host/tag',
      params: { 'hostId': hostId },
      data  : { 'key': key, 'value': value }
    });
  }

  /**
   * Delete a tag.
   * @returns {Null}
   */
  deleteTag({ hostId, key, value }) {
    return this.backendSrv.alertD({
      method: 'DELETE',
      url   : '/host/tag',
      params: { 'hostId': hostId, 'key': key, 'value': value }
    });
  }

  // Host Topology

  /**
   * Get the host topology graph with given params.
   * @param groupBy group rule.
   * @param colorBy filter rule.
   * @returns {Array|Object}
   */
  getHostTopology(params) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host/topology',
      params: params
    });
  }

  // Host Process

  /**
   * Get the specific host's process.
   * @returns {Array} host's process information.
   */
  getHostProcess(hostId) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host/state',
      params: { 'hostId': hostId }
    });
  }

}

coreModule.service('hostSrv', HostSrv);
