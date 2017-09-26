import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class UagentCtrl {
  config: any;
  configs: any;
  configName: any;
  serviceId: any;
  serviceName: any;
  host: any;
  hostList: any;
  isCover: any;
  newPath: any;
  searchConf: any;
  user: any;

  /** @ngInject */
  constructor(private $scope, private backendSrv, private $location, private contextSrv) {
    this.user = this.contextSrv.user;
    var search = this.$location.search();
    this.serviceId = search.serviceId;
    this.serviceName = search.serviceName;
    this.configName = search.configName;
    this.isCover = "true";
    this.searchConf = '';
    var hostId = search.hostId || -1;
    this.getHosts(hostId);
  }

  getService() {
    this.backendSrv.alertD({
      url: '/cmdb/config/configName?serviceName=' + this.serviceName + '&serviceId=' + this.serviceId + '&hostId=' + this.host.id
    }).then((response) => {
      this.configs = response.data;
    });
  }

  getConfig() {
    var url = '';
    if (this.configName === 'template') {
      url = '/cmdb/config/configTemplate?serviceName=filebeat';
    } else {
      url = '/cmdb/config/service?serviceId='+ this.serviceId + '&configName=' + this.configName + '&hostId=' + this.host.id;
    }
    this.backendSrv.alertD({url: url}).then((response) => {
      this.config = response.data;
    });
  }

  getData() {
    var type = _.findLast(this.$location.path().split('/'));
    if (type === 'config') {
      this.getService();
    } else {
      this.getConfig();
    }
  }

  getHosts(id) {
    id = parseInt(id);
    this.backendSrv.alertD({url: '/cmdb/host'}).then((response) => {
      this.hostList = response.data;
      if (id > -1) {
        this.host = _.find(this.hostList, {id: id});
      } else {
        this.host = this.hostList[0];
      }
    }).then(() => {
      this.getData();
    });
  }

  checkNum(prop) {
    if (!prop.value) {
      this.$scope.appEvent('alert-warning', ['参数错误', '请输入大于' + prop.minValue + '的整数']);
    }
  }

  showConfirm() {
    if (_.isEmpty(this.configs)) {
      this.getService()
    }
    this.$scope.appEvent('confirm-modal', {
      title: '确认应用',
      text: '您确认要应用该配置吗',
      icon: 'fa-bell',
      yesText: '确定',
      noText: '取消',
      modalClass : 'contact-us',
      onConfirm: this.confirmSave.bind(this)
    });
  }

  confirmSave() {
    var url = '/cmdb/config/service';
    var param = {
      serviceId : this.serviceId,
      configName : this.configName,
      usrId : this.user.id,
      orgId: this.user.orgId,
      systemId: this.user.systemId,
      configId : this.config.id,
      hostId : this.host.id
    };

    var checkDocument = true;

    var data = {sections: [], hosts: [this.host.id]};

    _.each(this.config.sections, (section)=>{
      var new_section = {
        sectionName: section.name,
        isCover: this.isCover,
        props: []
      };

      _.each(section.props, (prop)=>{
        if (!prop.readOnly) {
          new_section.props.push({key: prop.name, value: prop.value});
        }
        if (prop.name === 'document_type') {
          param.configName = prop.value;
          if (this.configName !== prop.value && _.some(this.configs, {name: prop.value})) {
            checkDocument = false;
            this.$scope.appEvent('alert-warning', ['document_type为' + prop.value + '的配置已经存在', '请修改日志类型(document_type)']);
          }
        }
      });
      data.sections.push(new_section);
    });

    if (checkDocument) {
      this.saveConfig(url, param, data);
    }
  }

  saveConfig(url, param, data) {
    this.backendSrv.alertD({
      method: "post",
      url: url,
      params: param,
      data: data,
      headers: {'Content-Type': 'text/plain;application/json;charset=UTF-8'},
    }).then((response)=>{
      this.$scope.appEvent('alert-success', ['应用成功']);
      this.$location.url('/cmdb/config?serviceName=' + this.serviceName +'&serviceId=' + this.serviceId + '&hostId=' + this.host.id);
    }, (err)=>{
      this.$scope.appEvent('alert-warning', ['应用失败', '请稍后重试']);
    });
  }

  addPath(path, index) {
    var values = this.config.sections[0].props[index].value;
    if (path) {
      if (_.indexOf(values, path) > -1) {
        this.$scope.appEvent('alert-warning', ['参数重复', '请检查重复内容重新填写']);
      } else {
        this.config.sections[0].props[index].value.push(path);
      }
      this.newPath = '';
    }
  }

  checkPath(path, i, index) {
    var values = this.config.sections[0].props[index].value;
    if (path) {
      values[i] = path;
      this.config.sections[0].props[index].value = _.uniq(values);
    } else {
      values.splice(i, 1);
    }
  }

  deleteConfig(id) {
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      text: '您确定要删除该配置吗？',
      icon: 'fa-bell',
      yesText: '确定',
      noText: '取消',
      modalClass : 'contact-us',
      onConfirm: ()=>{
        this.backendSrv.alertD({
          method: "delete",
          url: "/cmdb/config/host",
          params: {
            configId: id,
            orgId: this.user.orgId,
            systemId: this.user.systemId,
            userId: this.user.id
          },
        }).then((response)=>{
          this.$scope.appEvent('alert-success', ['删除成功']);
          this.$location.url('/cmdb/config?serviceName=' + this.serviceName +'&serviceId=' + this.serviceId + '&hostId=' + this.host.id);
          this.getData();
        });
      }
    });
  }

  copy(id, hosts) {
    this.$scope.appEvent('confirm-modal', {
      title: '同步',
      text: '您确定要同步该配置吗？',
      icon: 'fa-bell',
      yesText: '确定',
      noText: '取消',
      modalClass : 'contact-us',
      onConfirm: ()=>{
        this.backendSrv.alertD({
          method: "post",
          url: "/cmdb/config/copy",
          params: {
            configId: id,
            orgId: this.user.orgId,
            systemId: this.user.systemId,
            userId: this.user.id
          },
          data: {hosts: hosts}
        }).then((response)=>{
          this.$scope.appEvent('alert-success', ['同步成功']);
        });
      }
    });
  }
}

coreModule.controller('UagentCtrl', UagentCtrl);
