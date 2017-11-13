import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class UagentCtrl {
  config: any;
  configs: any;
  configName: any;
  serviceName: any;
  host: any;
  hostList: any;
  isCover: any;
  newPath: any;
  newPort: any;
  searchConf: any;
  user: any;
  title: any;

  /** @ngInject */
  constructor(private $scope, private backendSrv, private $location, private contextSrv) {
    this.user = this.contextSrv.user;
    var search = this.$location.search();
    this.serviceName = search.serviceName;
    this.configName = search.configName;
    this.isCover = "true";
    this.searchConf = '';
    var hostId = search.hostId || -1;
    this.getHosts(hostId);
    this.title = {
      'filebeat': '日志管理',
      'collector': '探针管理'
    }
  }

  getService() {
    this.backendSrv.alertD({
      url: '/cmdb/config/configName',
      params: {
        serviceName: this.serviceName,
        hostId: this.host.id
      }
    }).then((response) => {
      this.configs = response.data;
    });
  }

  getConfig() {
    var url = '/cmdb/config/service';
    this.backendSrv.alertD({
      url: url,
      params: {
        serviceName: this.serviceName,
        configName: this.configName,
        hostId: this.host.id
      }
    }).then((response) => {
      this.config = response.data;
      _.orderBy(this.config.sections[0].props, ['name']);
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
      serviceName : this.serviceName,
      configName : this.configName,
      userId : this.user.id,
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
          new_section.props.push({name: prop.name, value: prop.value});
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
      this.$location.url('/cmdb/config?serviceName=' + this.serviceName + '&hostId=' + this.host.id);
    }, (err)=>{
      this.$scope.appEvent('alert-warning', ['应用失败', '请稍后重试']);
    });
  }

  addCollectionValue(path, prop) {
    if (_.indexOf(prop.value, path) > -1) {
      this.$scope.appEvent('alert-warning', ['添加失败', '请将参数填写完整']);
    } else {
      prop.value.push(path);
    }
  }

  checkCollectionValue(path, index, prop) {
    prop.value[index] = path;
    if (path === '') {
      _.remove(prop.value, (value, i) => {
        return index === i;
      });
    }
    if (prop.value.length > _.uniq(prop.value).length) {
      prop.value = _.uniq(prop.value);
      this.$scope.appEvent('alert-warning', ['参数重复', '参数请勿重复']);
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
          this.$location.url('/cmdb/config?serviceName=' + this.serviceName + '&hostId=' + this.host.id);
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