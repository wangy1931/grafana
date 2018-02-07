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
  logStatus: any;

  /** @ngInject */
  constructor(private $scope, private contextSrv,
    private $routeParams, private logParseSrv,
    private $location, private $interval, private $translate) {
    this.logParseSrv.getHostList().then((result) => {
      this.hostList = result.data;
      return this.getServiceList();
    }).then(() => {
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
    this.custom = {
      logServiceName: '',
      logType: ''
    }
    this.curStep = 1;
    this.steps = ['page_logs_step1', 'page_logs_step2', 'page_logs_step3', 'page_logs_step4'];

    this.logStatus = {
      '0': {txt: $translate.i18n.page_log_status0, icon: 'fa fa-spinner fa-spin', class: 'log-stat0'},
      '1': {txt: $translate.i18n.page_log_status1, icon: 'fa fa-check', class: 'log-stat1'},
      '-1': {txt: $translate.i18n.page_log_status01, icon: 'fa fa-times', class: 'log-stat-1'},
      '2': {txt: $translate.i18n.page_log_status2, icon: 'fa fa-exclamation-triangle', class: 'log-stat2'},
    }
    $scope.$on("$destroy", () => {
      if (this.inter) {
        $interval.cancel(this.inter);
      }
    });
  }

  getTemplate(logServiceName, logType?) {
    if (_.isEqual(logServiceName, this.$translate.i18n.i18n_other)) {
      this.rule.logType = this.$translate.i18n.i18n_other;
      this.rule.logTypes = [this.$translate.i18n.i18n_other];
      return;
    }
    if (_.isEqual(logType, this.$translate.i18n.i18n_other)) {
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
        this.rule.logTypes = [this.$translate.i18n.i18n_other];
        this.rule.logType = this.$translate.i18n.i18n_other;
      } else {
        this.rule.logTypes = tmp[0].logTypes || [];
        this.rule.logType = logType || this.rule.logTypes[0];
        this.rule.logTypes.push(this.$translate.i18n.i18n_other);
      }
    });
  }

  getRuleById(id) {
    this.logParseSrv.getRuleById(id).then((response) => {
      this.rule = response.data;
      var tmpHosts = _.cloneDeep(this.rule.hosts);
      this.rule.hosts = [];
      _.each(tmpHosts, (hostId)=>{
        var host = _.find(this.hostList, {id: hostId});
        host && this.rule.hosts.push(host);
      });
      this.rule.logTypes = this.rule.logTypes || [];
      this.rule.logTypes.push(this.$translate.i18n.i18n_other);
      if (_.findIndex(this.serviceList, {name: this.rule.logServiceName}) === -1) {
        this.custom.logServiceName = this.rule.logServiceName;
        this.rule.logServiceName = this.$translate.i18n.i18n_other;
      }
      if (_.indexOf(this.rule.logTypes, this.rule.logType) === -1) {
        this.custom.logType = this.rule.logType;
        this.rule.logType = this.$translate.i18n.i18n_other;
      }
    });
  }

  getServiceList() {
    return this.logParseSrv.getServiceList().then((result) => {
      this.serviceList = result.data;
      this.serviceList.push({name: this.$translate.i18n.i18n_other});
    });
  }

  addLogPath() {
    if (this.checkInput(this.newPath, 'logPath')) {
      if (_.includes(this.rule.paths, this.newPath)) {
        this.$scope.appEvent('alert-warning', [this.newPath + this.$translate.i18n.i18n_existed, this.$translate.i18n.i18n_not_repeat]);
      } else {
        this.rule.paths.push(this.newPath);
        this.newPath = '';
      }
    } else {
      this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_input_invalid]);
    }
  }

  deleteLog(path) {
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_delete,
      text: this.$translate.i18n.i18n_sure_operator,
      yesText: this.$translate.i18n.i18n_confirm,
      noText: this.$translate.i18n.i18n_cancel,
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
        title: this.$translate.i18n.i18n_sorry,
        text: this.$translate.i18n.page_log_parse_maxed,
        yesText: this.$translate.i18n.i18n_confirm,
        noText: this.$translate.i18n.i18n_cancel
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
      pattern.result = this.$translate.i18n.i18n_fail;
    });
  }

  savePattern(oldPattern, pattern, isNew, dismiss) {
    if (!this.checkInput(pattern.name, 'parseName')) {
      this.$scope.appEvent('alert-warning', [this.$translate.i18n.page_log_format_error]);
      return;
    }
    if (!pattern.result || pattern.result === this.$translate.i18n.i18n_fail) {
      this.$scope.appEvent('alert-warning', [this.$translate.i18n.page_log_format_test]);
      return;
    }
    if (isNew) {
      this.rule.patterns.push(pattern);
    } else {
      var index = _.findIndex(this.rule.patterns, oldPattern);
      this.rule.patterns[index] = _.cloneDeep(pattern);
    }
    this.$scope.appEvent('alert-success', [this.$translate.i18n.i18n_success, this.$translate.i18n.page_log_parse_save_tip]);
    dismiss();
  }

  deletePattern(pattern) {
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_delete,
      icon: 'fa-trash',
      text: this.$translate.i18n.i18n_sure_operator,
      yesText: this.$translate.i18n.i18n_confirm,
      noText: this.$translate.i18n.i18n_cancel,
      onConfirm: ()=>{
        _.remove(this.rule.patterns, (pat) => {
          return _.isEqual(pat, pattern);
        });
        this.$scope.appEvent('alert-success', [this.$translate.i18n.i18n_success, this.$translate.i18n.page_log_parse_save_tip]);
      }
    });
  }

  addHost() {
    if (this.rule.hosts.length === this.hostList.length) {
      this.$scope.appEvent('alert-success', [this.$translate.i18n.page_log_parse_host_fulled]);
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
      title: this.$translate.i18n.i18n_delete,
      icon: 'fa-trash',
      text: this.$translate.i18n.i18n_sure_operator,
      yesText: this.$translate.i18n.i18n_confirm,
      noText: this.$translate.i18n.i18n_cancel,
      onConfirm: ()=>{
        _.remove(this.rule.hosts, (host)=>{
          return host.id === hostId;
        });
      }
    });
  }

  saveRule() {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_sorry, this.$translate.i18n.i18n_no_authority]);
      return;
    }
    this.rule.orgId = this.contextSrv.user.orgId;
    this.rule.sysId = this.contextSrv.user.systemId;
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_save,
      text: this.$translate.i18n.i18n_sure_operator,
      yesText: this.$translate.i18n.i18n_confirm,
      noText: this.$translate.i18n.i18n_cancel,
      onConfirm: () => {
        var data = _.cloneDeep(this.rule);
        data.hosts = _.map(this.rule.hosts, 'id');
        _.remove(data.logTypes, (type) => {
          return type === this.$translate.i18n.i18n_other;
        });
        if (data.logServiceName === this.$translate.i18n.i18n_other) {
          data.logServiceName = this.custom.logServiceName;
        }
        if (data.logType === this.$translate.i18n.i18n_other) {
          data.logType = this.custom.logType;
        }
        if (data.multiline) {
          data["multiline.negate"] = data["multiline.negate"] || true;
          data["multiline.match"] = data["multiline.match"] || "after";
        }
        this.logParseSrv.savePattern(this.contextSrv.user.id, data).then((res) => {
          this.$scope.appEvent('alert-success', [this.$translate.i18n.i18n_success, this.$translate.i18n.page_log_parse_config_ok]);
          (this.curStep === 3) && this.curStep++;
        }, (err) => {
          if (err.status === 400) {
            this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_existed, this.$translate.i18n.page_log_parse_rule_edit]);
          } else {
            this.$scope.appEvent('alert-danger', [this.$translate.i18n.i18n_fail, this.$translate.i18n.i18n_try_later]);
          }
        });
      }
    });
  }

  checkData(rule) {
    switch (this.curStep) {
      case 1:
        if (!rule.ruleName) {
          this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_warning, this.$translate.i18n.i18n_input_full]);
          return false;
        }
        // validate logServiceName
        if (rule.logServiceName === this.$translate.i18n.i18n_other) {
          if (!this.checkInput(this.custom.logServiceName, 'parseName')) {
            this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_warning, this.$translate.i18n.i18n_input_invalid]);
            return false;
          }
        } else if (!rule.logServiceName) {
          this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_warning, this.$translate.i18n.i18n_input_full]);
          return false;
        }
        // validate logType
        if (rule.logType === this.$translate.i18n.i18n_warning) {
          if (!this.checkInput(this.custom.logType, 'logType')) {
            this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_warning, this.$translate.i18n.i18n_input_invalid]);
            return false;
          }
        }
        if (_.isEmpty(rule.hosts)) {
          this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_warning, this.$translate.i18n.i18n_input_full]);
          return false;
        }
        break;
      case 2:
        // validate null
        if (_.isEmpty(rule.paths)) {
          this.$scope.appEvent('alert-warning', [this.$translate.i18n.i18n_warning, this.$translate.i18n.i18n_input_full]);
          return false;
        }
        break;
      case 3:
        var check = true;
        _.each(this.checkStatus, (status) => {
          if (!check) {
            return;
          }
          _.each(status.directorys, (directorys) => {
            if (directorys.status === '0') {
              this.$scope.appEvent('alert-warning', [this.$translate.i18n.page_log_parse_rule_checking, this.$translate.i18n.later]);
              check = false;
              return;
            }
            if (directorys.status === '-1') {
              this.$scope.appEvent('alert-warning', [this.$translate.i18n.page_log_parse_path_error, this.$translate.i18n.page_log_parse_back_edit]);
              check = false;
              return;
            }
          });
        });
        return check;
      case 4:
        // validate multiline
        if (!_.isBoolean(rule.multiline)) {
          return false;
        } else if (rule.multiline && !rule['multiline.pattern']) {
          return false;
        }
        break;
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
    if (this.inter) {
      this.$interval.cancel(this.inter);
    }
    if (step) {
      if (step > this.curStep) {
        return;
      } else {
        this.curStep = step;
      }
    } else {
      if (this.checkData(this.rule)) {
        if (this.curStep > 2) {
          this.saveRule();
          return;
        }
        this.curStep++;
        if (this.curStep === 3) {
          this.checktask();
        }
      }
    }
  }

  initCheckStatus(stat) {
    this.checkStatus = [];
    _.each(this.rule.hosts, (host) => {
      var obj = {
        hostKey: host.key,
        directorys: []
      };
      _.each(this.rule.paths, (path) => {
        obj.directorys.push({
          directory: path,
          status: stat
        });
      });
      this.checkStatus.push(obj);
    });
  }

  checktask() {
    this.initCheckStatus('0');
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
          this.cancelInterval();
        });
      },5000);
    });
  }

  getHostKey(hostkey) {
    return _.last(hostkey.split('@#'));
  }

  cancelInterval() {
    var check = _.map(this.checkStatus, (stat) => {
      return _.every(stat.directorys, (directory)=>{
        return directory.status !== '0';
      })
    });
    _.every(check) && this.$interval.cancel(this.inter);
  }
}

coreModule.controller('LogParseEditCtrl', LogParseEditCtrl);
