import _ from 'lodash';
import coreModule from '../../core/core_module';

export class ServiceCustomCtrl {
  softwareList: Array<Object>;
  newSoftware: Object;
  editSoftware: Object;
  editIndex: number;
  hostList: Array<Object>;
  host: Object;
  hostId: number;

  constructor(private $scope, private backendSrv, private contextSrv, private $location) {
    this.hostId = parseInt(this.$location.search().hostId) || -1;
    this.getSoftwares();
    this.initSoftware();
    this.initEditIndex();
    this.getHosts();
  }

  getHosts() {
    this.backendSrv.alertD({url: '/cmdb/host'}).then((result) => {
      this.hostList = result.data;
      if (this.hostId === -1) {
        this.host = this.hostList[0];
      } else {
        this.host = _.find(this.hostList, {id: this.hostId});
      }
    });
  }

  setHost(host) {
    this.host = host;
  }

  getSoftwares() {
    this.backendSrv.alertD({url: '/cmdb/setting/software'}).then((response) => {
      this.softwareList = _.find(response.data, {'orgId': this.contextSrv.user.orgId, 'sysId': this.contextSrv.user.systemId}).software;
    });
  }

  initSoftware() {
    this.newSoftware = {
      name: '',
      platform: 'linux',
      command: ''
    };
  }

  initEditIndex() {
    this.editIndex = -1;
    this.editSoftware = {
      name: '',
      platform: 'linux',
      command: ''
    };
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
          this.initSoftware();
        } else {
          this.$scope.appEvent('alert-warning', ['参数不完整', '请完整填写服务信息']);
        }
        break;
      case 'save':
        if (_.every(this.editSoftware)) {
          this.softwareList[this.editIndex] = _.cloneDeep(this.editSoftware);
          this.initEditIndex();
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


