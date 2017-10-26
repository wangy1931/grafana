///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class LogParseEditCtrl {
  rule: any;
  custom: any;
  hostList: Array<any>;
  newPath: any;
  serviceList: Array<any>;
  editLogPath: any;

  /** @ngInject */
  constructor(private $scope, private contextSrv, private $routeParams, private backendSrv) {
    // this.contextSrv.user.orgId
    // this.contextSrv.user.systemId
    if ($routeParams.ruleId) {
      this.getRuleById($routeParams.ruleId);
    }
    this.editLog(-1, '');
    this.getServiceList();
    this.custom = {
      serviceName: '',
      logType: ''
    }
  }

  getRuleById(id) {
    this.rule = {
      "id": 1,
      "orgId": 2,
      "sysId": 2,
      "ruleName": "nginx.access.1",
      "serviceName": "nginx",
      "logType": "access",
      "logTypes": ["access", "error"],
      "type": "log-processor",
      "multiline": false,
      "paths": ["path1", "path2"],
      "hosts": ["hostId1", "hostId2"],
      "patterns":
      [
        {
          "name": "parse1",
          "log": "1.2.3.4",
          "pattern": "%{IP:ip}",
          "type": "grok",
          "isMetric": false,
          "fields": [ "field1", "field2" ]
        },
        {
          "name": "parse2",
          "log": "1.2.3.4",
          "pattern": "%{IP:ip}",
          "type": "grok",
          "isMetric": true,
          "fields": []
        },
      ]
    }
    this.rule.logTypes.push('其他');
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
        pattern = /^[\w.]+/;
        break;
      case 'logPath':
        pattern = /(^\/\/.|^\/|^[a-zA-Z])?:?\/.+(\/$)?/;
        break;
      case 'logType':
        pattern = /^[\w]+/;
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
      console.log(res.data);
    });
  }

  savePattern(oldPattern, pattern, isNew) {
    if (isNew) {
      this.rule.patterns.push(pattern);
    } else {
      for (var i in oldPattern) {
        oldPattern[i] = pattern[i];
      }
    }
    this.$scope.appEvent('alert-success', ['保存成功', '请点击“保存”按钮保存该操作']);
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
}

coreModule.controller('LogParseEditCtrl', LogParseEditCtrl);
