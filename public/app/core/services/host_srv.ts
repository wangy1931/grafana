///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class HostSrv {

  topology: Array<any>;
  hostInfo: Array<any>;

  /** @ngInject */
  constructor(private $http, private backendSrv) {
  }

  // Host Tags

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

  getHostTopologyData(params) {
    return this.backendSrv.alertD({
      method: 'GET',
      url   : '/host/topology',
      params: params
    }).then(response => {
      this.topology = [];

      if (_.isArray(response.data)) {
        response.data.forEach(item => {
          this.topology.push({
            parent: 'All',
            name  : item.hostname,
            value : item.healthStatusType.toLowerCase(),
            ip    : item.defaultIp,
            _private_: item
          });
        });
      } else {
        for (var prop in response.data) {
          response.data[prop].forEach(item => {
            this.topology.push({
              parent: prop,
              name  : item.hostname,
              value : item.healthStatusType.toLowerCase(),
              ip    : item.defaultIp,
              _private_: item
            });
          });
        }
      }

      return this.topology;
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

  // Host Information

  /**
   * Get host's information.
   * @return {Array} host's information: cpu, mem, disk, state, version, startTime, commitId, id.
   */
  getHostInfo() {
    var query = {
      "queries": [
        {
          "metric": "cpu.usr"
        },
        {
          "metric": "collector.state"
        },
        {
          "metric": "proc.meminfo.active"
        },
        {
          "metric": "df.bytes.free",
          "tags": [
            {
              "name": "mount",
              "value": "/"
            }
          ]
        }
      ],
      "hostProperties": ["version", "startTime", "commit", "id"]
    };

    this.hostInfo = [];
    return this.backendSrv.alertD({
      method: "POST",
      url   : "/host/metrics",
      data  : query
    }).then(response => {
      response.data.forEach(item => {
        this.hostInfo.push({
          "host": item.hostname,
          "id": item.id,
          "status": _.statusFormatter(item["collector.state"]),
          "disk": _.gbFormatter(item["df.bytes.free"]),
          "cpu": _.percentFormatter(item["cpu.usr"]),
          "mem": _.gbFormatter(item["proc.meminfo.active"]),
          "commit": item.commit,
          "startTime": item.startTime,
          "version": item.version
        });
      });

      return this.hostInfo;
    });
  }

  // Host KPI

  /**
   * Get host's kpi.
   * @return {Array} host's kpi.
   */
  getHostKpi({ hostname }) {
    return this.backendSrv.alertD({
      method: "GET",
      url   : "/service/hostStatus",
      params: { host: hostname }
    });
  }

}

coreModule.service('hostSrv', HostSrv);
