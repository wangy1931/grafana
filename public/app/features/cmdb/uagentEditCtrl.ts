import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class UagentEditCtrl {
  config: any;
  serviceId: any;
  configName: any;
  serviceName: any;
  hosts: any;
  selectedHosts: any;
  isCover: any;
  constructor(private $scope, private backendSrv, private $location, private contextSrv) {
    var search = this.$location.search();
    this.serviceId = search.serviceId;
    this.serviceName = search.serviceName;
    this.configName = search.configName;
    this.isCover = "true";
    this.getHosts();
    this.getConfig();
  }

  getConfig() {
    var url = '';
    if (this.configName === 'filebeat') {
      url = '/cmdb/config/configTemplate?serviceName=filebeat';
    } else {
      url = '/cmdb/config/service?serviceId='+ this.serviceId + '&configName=' + this.configName;
    }
    this.backendSrv.alertD({url: url}).then((response) => {
      _.each(response.data.sections, function (section) {
        _.each(section.props, function (prop) {
          if (prop.type === 'integer') {
            prop.value = parseInt(prop.value);
          }
          if (prop.type === 'enum' && _.isString(prop.enumValues)) {
            prop.enumValues = _.split(prop.enumValues, '|');
          }
          if (_.isString(prop.readOnly)) {
            prop.readOnly = prop.readOnly === "true" ? true : false;
          }
        });
      });
      this.config = response.data;
    });
  }

  getHosts() {
    this.backendSrv.alertD({url: '/cmdb/host'}).then((response) => {
      this.hosts = response.data;
      this.selectedHosts = [];
    });
  }

  checkNum(prop) {
    if (!prop.value) {
      this.$scope.appEvent('alert-warning', ['参数错误', '请输入大于' + prop.minValue + '的整数']);
    }
  }

  showConfirm() {
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
    var user = this.contextSrv.user;
    var orgId = user.orgId;
    var systemId = user.systemId;
    var url = '';
    var param = {
      serviceId : this.serviceId,
      configName : this.configName,
      usrId : user.id,
      hostId : ''
    };

    var data = {sections: []};

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
      });
      data.sections.push(new_section);
    });

    if (this.selectedHosts.length) {
      url = "/cmdb/config/host";
      _.each(this.selectedHosts, (hostId)=>{
        param.hostId = hostId;
        this.backendSrv.alertD({url, params: param}).then((response)=>{
          this.saveConfig(url, param, data);
        });
      });
    } else {
      url = "/cmdb/config/service";
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
      this.$location.url('/cmdb/config?serviceName=' + this.serviceName +'&serviceId=' + this.serviceId);
    }, (err)=>{
      this.$scope.appEvent('alert-warning', ['应用失败']);
    });
  }

}

coreModule.controller('UagentEditCtrl', UagentEditCtrl);
