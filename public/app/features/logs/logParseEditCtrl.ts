///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class LogParseEditCtrl {
  rule: any;
  custom: any;
  hostList: Array<any>;
  otherHost: Array<any>;
  newPath: any;
  serviceList: Array<any>;
  editLogPath: any;

  /** @ngInject */
  constructor(private $scope, private contextSrv,
    private $routeParams, private backendSrv,
    private $location) {
    if ($routeParams.ruleId) {
      this.getRuleById($routeParams.ruleId);
    } else {
      this.rule = {
        "id": 0,
        "ruleName": "",
        "serviceName": "",
        "logType": "",
        "logTypes": [],
        "type": "",
        "multiline": false,
        "paths": [],
        "hosts": [],
        "patterns": []
      }
    }
    this.editLog(-1, '');
    this.getServiceList();
    this.getHostList();
    this.custom = {
      serviceName: '',
      logType: ''
    }
  }

  getTemplate(serviceName, logType?) {
    if (_.isEqual(serviceName, '其他')) {
      this.rule.logType = '其他';
      this.rule.logTypes = ['其他'];
      return;
    }
    var url = '/cmdb/pattern/template?serviceName='+ serviceName;
    if (logType) {
      url += '&logType=' + logType;
    }
    this.backendSrv.alertD({url: url}).then((response)=>{
      var tmp = response.data;
      if (_.isEmpty(tmp)) {
        this.rule.logTypes = ['其他'];
        this.rule.logType = '其他';
      } else {
        if (!_.every(serviceName, logType)) {
          this.rule = _.cloneDeep(tmp[0]);
        } else {
          this.rule.logTypes = tmp[0].logTypes;
          this.rule.logType = this.rule.logTypes[0];
          this.rule.ruleName = this.rule.ruleName || tmp[0].ruleName;
        }
      }
      this.rule.hosts = [];
    });
  }

  getRuleById(id) {
    this.backendSrv.alertD({
      url: '/cmdb/pattern/getById?ruleId=' + id
    }).then((response) => {
      this.rule = response.data;
      this.rule.hosts = this.rule.hosts || [];
      this.rule.logTypes.push('其他');
      if (_.findIndex(this.serviceList, {name: this.rule.serviceName}) === -1) {
        this.custom.serviceName = this.rule.serviceName;
        this.custom.logType = this.rule.logType;
        this.rule.serviceName = '其他';
        this.rule.logType = '其他';
      }
    });
  }

  getServiceList() {
    this.backendSrv.alertD({url: '/cmdb/service'}).then((result) => {
      this.serviceList = result.data;
      this.serviceList.push({name: '其他'});
    });
  }

  getHostList() {
    this.backendSrv.alertD({url: '/cmdb/host'}).then((result) => {
      this.hostList = result.data;
    });
  }

  getHostNameById(hostId) {
    if (!_.isEmpty(this.hostList)) {
      return _.find(this.hostList, {id: hostId}).hostname;
    }
  }

  addLogPath(type) {
    switch (type) {
      case 'save': {
        if (this.checkInput(this.editLogPath.path, 'logPath')) {
          if (_.isEqual(this.editLogPath.path, this.rule.paths[this.editLogPath.index])) {
            this.editLog(-1, '');
          } else if (_.includes(this.rule.paths, this.editLogPath.path)) {
            this.$scope.appEvent('alert-warning', [this.editLogPath.path + '已存在', '请勿重复添加']);
          } else {
            this.rule.paths[this.editLogPath.index] = this.editLogPath.path;
            this.editLog(-1, '');
          }
        } else {
          this.$scope.appEvent('alert-warning', ['日志路径不合法', '请检查输入']);
        }
        break;
      };
      case 'add': {
        if (this.checkInput(this.newPath, 'logPath')) {
          if (_.includes(this.rule.paths, this.newPath)) {
            this.$scope.appEvent('alert-warning', [this.newPath + '已存在', '请勿重复添加']);
          } else {
            this.rule.paths.push(this.newPath);
            this.newPath = '';
          }
        } else {
          this.$scope.appEvent('alert-warning', ['日志路径不合法', '请检查输入']);
        }
        break;
      }
    }
  }

  editLog(index, path) {
    this.editLogPath = {
      index: index,
      path: path
    };
  }

  deleteLog(path) {
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      text: '您确定要删除该日志吗?',
      yesText: '确定',
      noText: '取消',
      onConfirm: () => {
        _.remove(this.rule.paths, (p) => {
          return _.isEqual(p, path);
        });
      }
    });
  }

  editPattren(pattern) {
    var newScope = this.$scope.$new();
    if (!pattern) {
      newScope.isNew = true;
      newScope.pattern = {
        isMetric: true,
        type: 'grok'
      }
    } else {
      newScope.isNew = false;
      newScope.pattern = _.cloneDeep(pattern);
      newScope.oldPattern = pattern;
    }
    newScope.testPattern = this.testPattern.bind(this);
    newScope.savePattern = this.savePattern.bind(this);
    newScope.checkInput = this.checkInput;
    this.$scope.appEvent('show-modal', {
      src: '/public/app/features/logs/partials/log_rules_parse.html',
      scope: newScope
    });
  }

  checkInput(inputText, type) {
    var pattern = null;
    switch (type) {
      case 'parseName':
        pattern = /^[\w.]+$/;
        break;
      case 'logPath':
        pattern = /^([/][\w-.]+)*$/;
        break;
      case 'logType':
        pattern = /^[\w]+$/;
        break;
    }
    if (pattern) {
      return pattern.test(inputText);
    }
  }

  testPattern(pattern) {
    this.backendSrv.alertD({
      url: '/cmdb/pattern/validate',
      method: 'post',
      data: {
        log: pattern.log,
        pattern: pattern.pattern,
        type: pattern.type,
        namedCaptureOnly: true,
        isMetric: pattern.isMetric
      }
    }).then((res)=>{
      pattern.result = res.data;
    }, (err) => {
      pattern.result = '规则解析失败';
    });
  }

  savePattern(oldPattern, pattern, isNew, dismiss) {
    if (!this.checkInput(pattern.parseName, 'parseName')) {
      this.$scope.appEvent('alert-warning', ['解析器名称格式错误']);
      return;
    }
    if (!pattern.result || pattern.result === '规则解析失败') {
      this.$scope.appEvent('alert-warning', ['匹配规则不合法']);
      return;
    }
    pattern.result = '';
    if (isNew) {
      this.rule.patterns.push(pattern);
    } else {
      for (var i in oldPattern) {
        oldPattern[i] = pattern[i];
      }
    }
    this.$scope.appEvent('alert-success', ['保存成功', '请点击“保存”按钮保存该操作']);
    dismiss();
  }

  deletePattern(pattern) {
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      icon: 'fa-trash',
      text: '您确定要删除该解析器吗？',
      yesText: '确定',
      noText: '取消',
      onConfirm: ()=>{
        _.remove(this.rule.patterns, (pat) => {
          return _.isEqual(pat, pattern);
        });
        this.$scope.appEvent('alert-success', ['删除成功', '请点击“保存”按钮保存该操作']);
      }
    });
  }

  addHost() {
    if (this.rule.hosts.length === this.hostList.length) {
      this.$scope.appEvent('alert-success', ['您已添加所有机器']);
      return;
    }
    this.otherHost = _.cloneDeep(this.hostList);
    _.each(this.rule.hosts, (id) => {
      _.remove(this.otherHost, (item) => {
        return item.id === id;
      });
    });
    var newScope = this.$scope.$new();
    newScope.allHosts = this.otherHost;
    newScope.selectOne = function() {
      newScope.select_all = _.every(newScope.allHosts,{'checked': true});
    };
    newScope.selectAll = this.selectAll.bind(this);
    newScope.addHosts = this.saveHosts.bind(this);

    this.$scope.appEvent('show-modal', {
      src: 'public/app/features/cmdb/partials/service_add_host.html',
      modalClass: 'modal-no-header invite-modal cmdb-modal',
      scope: newScope,
    });
  }

  selectAll(check) {
    _.each(this.otherHost, function(host) {
      host.checked = check;
    });
  }

  saveHosts() {
    _.each(this.otherHost, (host) => {
      if (host.checked) {
        this.rule.hosts.push(host.id);
      }
    })
  }

  deleteHost(hostId) {
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      icon: 'fa-trash',
      text: '您确定要删除该机器吗？',
      yesText: '确定',
      noText: '取消',
      onConfirm: ()=>{
        _.remove(this.rule.hosts, (id)=>{
          return id === hostId;
        });
      }
    });
  }

  saveRule() {
    this.rule.orgId = this.contextSrv.user.orgId;
    this.rule.sysId = this.contextSrv.user.systemId;
    if (this.checkData(this.rule)) {
      var data = _.cloneDeep(this.rule);
      _.remove(data.logTypes, (type) => {
        return type === '其他';
      });
      if (data.serviceName === '其他') {
        data.serviceName = this.custom.serviceName;
        data.logType = this.custom.logType;
      }
      if (data.multiline) {
        data["multiline.negate"] = false;
        data["multiline.match"] = "after";
      }
      this.backendSrv.alertD({
        url: '/cmdb/pattern/save',
        method: 'post',
        data: data
      }).then((res) => {
        this.$scope.appEvent('alert-success', ['保存成功']);
        this.$location.url('/logs/rules');
      }, (err) => {
        if (err.status === 400) {
          this.$scope.appEvent('alert-warning', ['规则名称已存在', '请修改规则名称']);
        } else {
          this.$scope.appEvent('alert-danger', ['保存失败', '请稍后重试']);
        }
      });
    } else {
      this.$scope.appEvent('alert-warning', ['参数信息不完整', '带 * 选项为必填内容,请填写完整']);
    }
  }

  checkData(rule) {
    if (rule.serviceName === '其他') {
      if (_.every(this.custom)) {
        if (!this.checkInput(this.custom.serviceName, 'parseName')) {
          return false;
        }
        if (!this.checkInput(this.custom.logType, 'logType')) {
          return false;
        }
      } else {
        return false;
      }
    }
    if (!rule.ruleName || !rule.serviceName || !rule.logType ||
      _.isEmpty(rule.patterns) || _.isEmpty(rule.paths) || _.isEmpty(rule.hosts)) {
      return false;
    }
    if (!_.isBoolean(rule.multiline)) {
      return false;
    } else if (rule.multiline && !rule['multiline.pattern']) {
      return false;
    }
    return true;
  }
}

coreModule.controller('LogParseEditCtrl', LogParseEditCtrl);
