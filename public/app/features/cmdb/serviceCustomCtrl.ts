///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from 'app/core/core_module';

export class ServiceCustomCtrl {
  softwareList: Array<any> = [];
  newSoftware: any;
  editSoftware: any;
  editIndex: number;
  hostList: Array<any> = [];
  host: any;
  hostId: number;
  hostProcess: Array<any> = [];
  isUnit: boolean;
  title: string;
  orgId: any;
  sysId: any;

  /** @ngInject */
  constructor(private $scope, private backendSrv, private contextSrv, private $location) {
    this.hostId = parseInt(this.$location.search().hostId) || -1;
    this.isUnit = this.contextSrv.isGrafanaAdmin && this.$location.search().unit;
    if (this.isUnit) {
      this.title = '默认';
      this.orgId = 0;
      this.sysId = 0;
    } else {
      this.title = '拓展';
      this.orgId = this.contextSrv.user.orgId;
      this.sysId = this.contextSrv.user.systemId;
    }
    this.hostProcess = [];
    this.getSoftwares();
    this.initEditSoftware('add');
    this.initEditSoftware('save');
    this.getHosts();
  }

  getHosts() {
    $(".table-process").bootstrapTable();
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
      this.hostProcess = response.data || [];
      $(".table-process").bootstrapTable('load', this.hostProcess);
    });
  }

  getSoftwares() {
    this.backendSrv.alertD({url: '/cmdb/setting/software?default_config=' + this.isUnit}).then((response) => {
      this.softwareList = _.find(response.data, {'orgId': this.orgId, 'sysId': this.sysId}).software;
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
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      text: '您确定要删除此服务吗？',
      icon: 'fa-bell',
      yesText: '确定',
      noText: '取消',
      onConfirm: ()=> {
        _.remove(this.softwareList, (service) => {
          return _.isEqual(service, software);
        });
        this.saveSoftware('删除');
      },
    });
  }

  addSoftware(type) {
    switch (type) {
      case 'add':
        if (_.every(this.newSoftware)) {
          this.softwareList.push(this.newSoftware);
          this.initEditSoftware(type);
          this.saveSoftware('添加');
        } else {
          this.$scope.appEvent('alert-warning', ['参数不完整', '请完整填写服务信息']);
        }
        break;
      case 'save':
        if (_.every(this.editSoftware)) {
          this.softwareList[this.editIndex] = _.cloneDeep(this.editSoftware);
          this.initEditSoftware(type);
          this.saveSoftware('保存');
        } else {
          this.$scope.appEvent('alert-warning', ['参数不完整', '请完整填写服务信息']);
        }
        break;
    }
  }

  saveSoftware(type) {
    this.backendSrv.saveCustomSoftware(this.softwareList, '/cmdb/setting/software?default_config=' + this.isUnit).then((response) => {
      if (response.status === 200) {
        this.$scope.appEvent('alert-success', [type + '成功']);
      }
    });
  }
}

coreModule.controller('ServiceCustomCtrl', ServiceCustomCtrl);
