///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class ServiceCustomCtrl {
  softwareList: Array<any>;
  newSoftware: any;
  editSoftware: any;
  editIndex: number;
  hostList: Array<any>;
  host: any;
  hostId: number;
  hostProcess: Array<any>;

  constructor(private $scope, private backendSrv, private contextSrv, private $location) {
    this.hostId = parseInt(this.$location.search().hostId) || -1;
    this.getSoftwares();
    this.initEditSoftware('add');
    this.initEditSoftware('save');
    this.getHosts();
  }

  getHosts() {
    this.backendSrv.alertD({url: '/cmdb/host'}).then((result) => {
      this.hostList = result.data;
      if (this.hostId === -1) {
        this.setHost(this.hostList[0]);
      } else {
        this.setHost(_.find(this.hostList, {id: this.hostId}));
      }
    });
  }

  setHost(host) {
    this.host = host;
    this.backendSrv.alertD({url: '/host/state?hostId=' + host.id}).then((response) => {
      this.hostProcess = response.data;
    });
  }

  getSoftwares() {
    this.backendSrv.alertD({url: '/cmdb/setting/software'}).then((response) => {
      this.softwareList = _.find(response.data, {'orgId': this.contextSrv.user.orgId, 'sysId': this.contextSrv.user.systemId}).software;
    });
  }

  initEditSoftware(type) {
    var obj = {
      name: '',
      platform: 'linux',
      command: ''
    };
    if (type === 'add') {
      this.newSoftware = obj;
    } else {
      this.editIndex = -1;
      this.editSoftware = obj;
    }
  }

  checkName(name, type) {
    var process = _.find(this.hostProcess, {name: name});
    if (!_.isEmpty(process)) {
      if (type === 'add') {
        this.newSoftware.command = process.command;
      } else {
        this.editSoftware.command = process.command;
      }
    }
  }

  getEditSoftware(software, index) {
    this.editIndex = index;
    this.editSoftware = _.cloneDeep(software);
  }

  deleteSoftware(software) {
    _.remove(this.softwareList, function(service) {
      return _.isEqual(service, software);
    });
  }

  addSoftware(type) {
    switch (type) {
      case 'add':
        if (_.every(this.newSoftware)) {
          this.softwareList.push(this.newSoftware);
          this.initEditSoftware(type);
        } else {
          this.$scope.appEvent('alert-warning', ['参数不完整', '请完整填写服务信息']);
        }
        break;
      case 'save':
        if (_.every(this.editSoftware)) {
          this.softwareList[this.editIndex] = _.cloneDeep(this.editSoftware);
          this.initEditSoftware(type);
        } else {
          this.$scope.appEvent('alert-warning', ['参数不完整', '请完整填写服务信息']);
        }
        break;
    }
  }

  saveSoftware() {
    this.backendSrv.saveCustomSoftware(this.softwareList, '/cmdb/setting/software').then(function(response) {
      if (response.status === 200) {
        this.$scope.appEvent('alert-success', ['上传成功']);
      }
    });
  }
}

coreModule.controller('ServiceCustomCtrl', ServiceCustomCtrl);
