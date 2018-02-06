
import _ from 'lodash';
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
  pattern: any;
  tableParams: any;
  searchCommand: any;

  /** @ngInject */
  constructor(
    private $scope, private backendSrv, private contextSrv,
    private $location, private NgTableParams, private $translate
  ) {
    this.hostId = parseInt(this.$location.search().hostId) || -1;
    this.isUnit = this.contextSrv.isGrafanaAdmin && this.$location.search().unit;
    if (this.isUnit) {
      this.title = $translate.i18n.i18n_default;
      this.orgId = 0;
      this.sysId = 0;
    } else {
      this.title = $translate.i18n.i18n_extension;
      this.orgId = this.contextSrv.user.orgId;
      this.sysId = this.contextSrv.user.systemId;
    }
    this.hostProcess = [];
    this.pattern = /^[\w.]+$/;
    this.getSoftwares();
    this.initEditSoftware('add');
    this.initEditSoftware('save');
    this.getHosts();

    this.tableParams = new this.NgTableParams({
      count: 20,
      sorting: { 'command': 'desc' },
    }, {
      counts: [],
    });
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
      this.hostProcess = response.data || [];
      this.tableParams.settings({
        dataset: this.hostProcess,
      });
    });
  }

  getSoftwares() {
    this.backendSrv.alertD({url: '/cmdb/setting/software?default_config=' + this.isUnit}).then((response) => {
      this.softwareList = (_.find(response.data, {'orgId': this.orgId, 'sysId': this.sysId}) || {}).software || [];
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

  checkName(name) {
    if (!this.pattern.test(name)) {
      this.$scope.appEvent('alert-warning',
        [this.$translate.i18n.i18n_input_invalid, this.$translate.i18n.page_log_parse_input]);
    }
  }

  getEditSoftware(software, index) {
    this.editIndex = index;
    this.editSoftware = _.cloneDeep(software);
  }

  deleteSoftware(software) {
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_delete,
      text: this.$translate.i18n.i18n_sure_operator,
      icon: 'fa-bell',
      yesText: this.$translate.i18n.i18n_confirm,
      noText: this.$translate.i18n.i18n_cancel,
      onConfirm: ()=> {
        _.remove(this.softwareList, (service) => {
          return _.isEqual(service, software);
        });
        this.saveSoftware(this.$translate.i18n.i18n_delete);
      },
    });
  }

  addSoftware(type) {
    switch (type) {
      case 'add':
        if (_.every(this.newSoftware)) {
          if (!this.pattern.test(this.newSoftware.name)) {
            this.$scope.appEvent('alert-warning',
            [this.$translate.i18n.i18n_input_invalid, this.$translate.i18n.page_log_parse_input]);
            return;
          }
          this.softwareList.push(this.newSoftware);
          this.initEditSoftware(type);
          this.saveSoftware(this.$translate.i18n.i18n_add);
        } else {
          this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_param_miss, this.$translate.i18n.i18n_input_full]);
        }
        break;
      case 'save':
        if (_.every(this.editSoftware)) {
          if (!this.pattern.test(this.editSoftware.name)) {
            this.$scope.appEvent('alert-warning',
            [this.$translate.i18n.i18n_input_invalid, this.$translate.i18n.page_log_parse_input]);
            return;
          }
          this.softwareList[this.editIndex] = _.cloneDeep(this.editSoftware);
          this.initEditSoftware(type);
          this.saveSoftware(this.$translate.i18n.i18n_save);
        } else {
          this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_param_miss, this.$translate.i18n.i18n_input_full]);
        }
        break;
    }
  }

  saveSoftware(type) {
    this.backendSrv.saveCustomSoftware(this.softwareList, '/cmdb/setting/software?default_config=' + this.isUnit).then((response) => {
      if (response.status === 200) {
        this.$scope.appEvent('alert-success', [type + this.$translate.i18n.i18n_success]);
      }
    });
  }

  applySearch() {
    this.tableParams.filter({ $: this.searchCommand });
  }
}

coreModule.controller('ServiceCustomCtrl', ServiceCustomCtrl);
