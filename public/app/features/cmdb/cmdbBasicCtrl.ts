///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from 'app/core/core_module';

export class CMDBBasicAzureCtrl {
  query: any;
  azureList: any;

  mockData: any;

  /** @ngInject */
  constructor(private $scope, private alertSrv) {
    this.mockData = [
      { name: 'VM1', type: '虚拟机', added: true },
      { name: 'VM2', type: '虚拟机', added: true },
      { name: 'VM3', type: '虚拟机', added: false },
      { name: 'VM4', type: '虚拟机', added: true },
      { name: 'VM5', type: '虚拟机', added: true },
      { name: 'VM6', type: '虚拟机', added: false },
      { name: 'VM7', type: '虚拟机', added: true },
      { name: 'VM8', type: '虚拟机', added: true },
      { name: 'VM9', type: '虚拟机', added: false },
      { name: 'ServiceBus1', type: 'ServiceBus', added: true },
      { name: 'ServiceBus2', type: 'ServiceBus', added: false },
      { name: 'ServiceBus3', type: 'ServiceBus', added: true },
      { name: 'blob1', type: 'Blob 存储', added: true },
      { name: 'blob2', type: 'Blob 存储', added: true },
      { name: 'blob3', type: 'Blob 存储', added: false },
      { name: 'APP1', type: '应用程序', added: false },
      { name: 'APP2', type: '应用程序', added: true },
      { name: 'APP3', type: '应用程序', added: true }
    ];
    this.azureList = [];
    this.query = {
      userId: '',
      clientId: '',
      clientKey: ''
    };
    this.getAzureList();
  }

  getAzureList() {}

  applyAzureSetting() {
    if (this.$scope.searchForm.$valid) {
      this.azureList = [];
      for (var i = 0; i < 6; i++) {
        var randomNumber = _.random(0, 17);
        if (!_.find(this.azureList, this.mockData[randomNumber])) {
          this.azureList.push(this.mockData[randomNumber]);
        } else {
          i--;
        }
      }
    }
  }

  add(item) {
    _.find(this.azureList, item).added = true;
    this.alertSrv.set(`${item.name}已成功加入监控`, '', "success", 2000);
  }

  remove(item) {
    _.find(this.azureList, item).added = false;
    this.alertSrv.set(`${item.name}已成功移除监控`, '', "success", 2000);
  }

}
coreModule.controller('CMDBBasicAzureCtrl', CMDBBasicAzureCtrl);


export class CMDBBasicSqlCtrl {
  sqlList: any;

  mockData: any;

  /** @ngInject */
  constructor(private $scope, private alertSrv) {
    this.mockData = [
      { name: 'Database 1', added: true },
      { name: 'Database 2', added: true },
      { name: 'Database 3', added: false },
      { name: 'Database 4', added: true },
      { name: 'Database 5', added: false },
      { name: 'Database 6', added: true }
    ];
    this.sqlList = [];

    this.getSqlList();
  }

  getSqlList() {
    this.sqlList = this.mockData;
  }

  edit(item) {
    // 
  }

  remove(item) {
    this.alertSrv.set(`${item.name}已成功移除监控`, '', "success", 2000);
  }

}
coreModule.controller('CMDBBasicSqlCtrl', CMDBBasicSqlCtrl);
