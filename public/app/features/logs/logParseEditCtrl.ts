///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core/core_module';

export class LogParseEditCtrl {
  rule: any;
  custom: any;
  hostList: Array<any>;
  otherHost: Array<any>;
  newPath: any;
  serviceList: Array<any>;
  steps: Array<any>;
  curStep: number;
  inter: any;
  checkId: any;
  checkStatus: any;

  /** @ngInject */
  constructor(private $scope, private contextSrv,
    private $routeParams, private logParseSrv,
    private $location, private $interval) {
    this.getServiceList().then(() => {
      if ($routeParams.ruleId) {
        this.getRuleById($routeParams.ruleId);
      } else {
        this.rule = {
          "id": 0,
          "ruleName": "",
          "logServiceName": "",
          "logType": "",
          "logTypes": [],
          "serviceName": "",
          "multiline": false,
          "paths": [],
          "hosts": [],
          "patterns": []
        }
      }
    });
    this.logParseSrv.getHostList().then((result) => {
      this.hostList = result.data;
    });
    this.custom = {
      logServiceName: '',
      logType: ''
    }
    this.curStep = 1;
    this.steps = ['填写基本信息', '填写日志路径', '校验日志', '设置日志解析'];

    $scope.$on("$destroy", () => {
      if (this.inter) {
        $interval.cancel(this.inter);
      }
    });
  }

  getTemplate(logServiceName, logType?) {
    if (_.isEqual(logServiceName, '其他')) {
      this.rule.logType = '其他';
      this.rule.logTypes = ['其他'];
      return;
    }
    if (_.isEqual(logType, '其他')) {
      return;
    } else {
      this.custom.logType = '';
    }
    var params = {
      logServiceName: logServiceName
    }
    if (logType) {
      params['logType'] = logType;
    }
    this.logParseSrv.getTemplate(params).then((response)=>{
      var tmp = response.data;
      if (_.isEmpty(tmp)) {
        this.rule.logTypes = ['其他'];
        this.rule.logType = '其他';
      } else {
        this.rule.logTypes = tmp[0].logTypes || [];
        this.rule.logType = logType || this.rule.logTypes[0];
        this.rule.logTypes.push('其他');
      }
    });
  }

  getRuleById(id) {
    this.logParseSrv.getRuleById(id).then((response) => {
      this.rule = response.data;
      this.rule.hosts = this.rule.hosts || [];
      this.rule.logTypes = this.rule.logTypes || [];
      this.rule.logTypes.push('其他');
      if (_.findIndex(this.serviceList, {name: this.rule.logServiceName}) === -1) {
        this.custom.logServiceName = this.rule.logServiceName;
        this.rule.logServiceName = '其他';
      }
      if (_.indexOf(this.rule.logTypes, this.rule.logType) === -1) {
        this.custom.logType = this.rule.logType;
        this.rule.logType = '其他';
      }
    });
  }

  getServiceList() {
    return this.logParseSrv.getServiceList().then((result) => {
      this.serviceList = result.data;
      this.serviceList.push({name: '其他'});
    });
  }

  getHostNameById(hostId) {
    if (!_.isEmpty(this.hostList)) {
      return _.find(this.hostList, {id: hostId}).hostname;
    }
  }

  addLogPath() {
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

  editPattren(pattern?) {
    if (!pattern && this.rule.patterns.length >= 2) {
      this.$scope.appEvent('confirm-modal', {
        title: '抱歉',
        text: '您最多只能添加两条解析规则',
        yesText: '确定',
        noText: '取消'
      });
    } else {
      var newScope = this.$scope.$new();
      if (!pattern) {
        newScope.isNew = true;
        newScope.pattern = {
          "name": "",
          "type": "grok",
          "pattern": "",
          "log": "",
          "isMetric": false
        }
      } else {
        newScope.isNew = false;
        newScope.pattern = _.cloneDeep(pattern);
        newScope.pattern.fields = [];
        newScope.oldPattern = pattern;
        newScope.rule = this.rule;
      }
      newScope.testPattern = this.testPattern.bind(this);
      newScope.savePattern = this.savePattern.bind(this);
      newScope.checkInput = this.checkInput;
      this.$scope.appEvent('show-modal', {
        src: '/public/app/features/logs/partials/log_rules_parse.html',
        scope: newScope
      });
    }
  }

  checkInput(inputText, type) {
    if (_.isUndefined(inputText)) {
      return false;
    }
    var pattern = null;
    switch (type) {
      case 'parseName':
        pattern = /^[\w._]+$/;
        break;
      case 'logPath':
        pattern = /^([a-zA-Z]:[\\\\]?[\w*+-_.]*)|(([~/\w*+-_.])+)$/
        break;
      case 'logType':
        pattern = /^[\w._]+$/;
        break;
    }
    if (pattern) {
      return pattern.test(inputText);
    }
  }

  testPattern(pattern) {
    this.logParseSrv.validatePattern(pattern).then((res)=>{
      pattern.result = res.data;
    }, (err) => {
      pattern.result = '规则解析失败';
    });
  }

  savePattern(oldPattern, pattern, isNew, dismiss) {
    if (!this.checkInput(pattern.name, 'parseName')) {
      this.$scope.appEvent('alert-warning', ['解析器名称格式错误']);
      return;
    }
    if (!pattern.result || pattern.result === '规则解析失败') {
      this.$scope.appEvent('alert-warning', ['请测试正确的解析规则']);
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
    _.each(this.rule.hosts, (host) => {
      _.remove(this.otherHost, (item) => {
        return item.id === host.id;
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
        this.rule.hosts.push(host);
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
        _.remove(this.rule.hosts, (host)=>{
          return host.id === hostId;
        });
      }
    });
  }

  saveRule() {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
      return;
    }
    this.rule.orgId = this.contextSrv.user.orgId;
    this.rule.sysId = this.contextSrv.user.systemId;
    if (this.checkData(this.rule)) {
      this.$scope.appEvent('confirm-modal', {
        title: '保存',
        text: '您确定要保存该配置吗？',
        yesText: '确定',
        noText: '取消',
        onConfirm: ()=>{
          var data = _.cloneDeep(this.rule);
          _.remove(data.logTypes, (type) => {
            return type === '其他';
          });
          if (data.logServiceName === '其他') {
            data.logServiceName = this.custom.logServiceName;
          }
          if (data.logType === '其他') {
            data.logType = this.custom.logType;
          }
          if (data.multiline) {
            data["multiline.negate"] = data["multiline.negate"] || true;
            data["multiline.match"] = data["multiline.match"] || "after";
          }
          this.logParseSrv.savePattern(this.contextSrv.user.id, data).then((res) => {
            this.$scope.appEvent('alert-success', ['保存成功', '配置将于6分钟之后生效, 请稍后查看']);
            this.$location.url('/logs/rules');
          }, (err) => {
            if (err.status === 400) {
              this.$scope.appEvent('alert-warning', ['规则名称已存在', '请修改规则名称']);
            } else {
              this.$scope.appEvent('alert-danger', ['保存失败', '请稍后重试']);
            }
          });
        }
      });
    } else {
      this.$scope.appEvent('alert-warning', ['参数信息不完整', '带 * 选项为必填内容,请填写完整']);
    }
  }

  checkData(rule) {
    switch (this.curStep) {
      case 1:
        if (!rule.ruleName) {
          this.$scope.appEvent('alert-warning', ['警告', '请输入规则名称']);
          return false;
        }
        // validate logServiceName
        if (rule.logServiceName === '其他') {
          if (!this.checkInput(this.custom.logServiceName, 'parseName')) {
            this.$scope.appEvent('alert-warning', ['警告', '服务名称非法']);
            return false;
          }
        } else if (!rule.logServiceName) {
          this.$scope.appEvent('alert-warning', ['警告', '请选择服务']);
          return false;
        }
        // validate logType
        if (rule.logType === '其他') {
          if (!this.checkInput(this.custom.logType, 'logType')) {
            this.$scope.appEvent('alert-warning', ['警告', '日志类型非法']);
            return false;
          }
        }
        if (_.isEmpty(rule.hosts)) {
          this.$scope.appEvent('alert-warning', ['警告', '请选择机器列表']);
          return false;
        }
        break;
      case 2:
        // validate null
        if (_.isEmpty(rule.paths)) {
          this.$scope.appEvent('alert-warning', ['警告', '请输入日志路径']);
          return false;
        }
        break;
      case 3:
        break;
      case 4:
        break;
    }

    // validate multiline
    if (!_.isBoolean(rule.multiline)) {
      return false;
    } else if (rule.multiline && !rule['multiline.pattern']) {
      return false;
    }
    return true;
  }

  selectMetric(event, pattern, metric) {
    var checked = $(event.currentTarget).find('input').prop('checked')
    pattern.fields = pattern.fields || [];
    if (checked) {
      if (_.indexOf(pattern.fields, metric) === -1) {
        pattern.fields.push(metric);
      } else {
        return;
      }
    } else {
      _.remove(pattern.fields, (item) => {
        return item === metric;
      });
    }
  }

  selectStep(step?) {
    if (step) {
      if (step > this.curStep) {
        return;
      } else {
        this.curStep = step;
      }
    } else {
      if (this.checkData(this.rule)) {
        this.curStep > 3 ? this.curStep = 4 : this.curStep++;
        if (this.curStep === 3) {
          this.checktask();
        }
      }
    }
  }

  checktask() {
    var params = {
      hostKeys: [],
      dir: this.rule.paths
    }
    _.each(this.rule.hosts, (host) => {
      params.hostKeys.push(host.key);
    });
    this.logParseSrv.checktask(params).then((res) => {
      this.checkId = res.data;
      this.inter = this.$interval(() => {
        this.logParseSrv.getChecktask(this.checkId).then((response) => {
          this.checkStatus = response.data;
        });
      },5000);
    });
  }
}

coreModule.controller('LogParseEditCtrl', LogParseEditCtrl);
