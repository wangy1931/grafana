 

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class LogParseCtrl {
  ruleList: Array<any>;
  rule: any;
  hostList: Array<any>;
  checkStatus: Array<any>;

  /** @ngInject */
  constructor(private $scope,
    private contextSrv,
    private logParseSrv,
    private $location,
    private $routeParams,
    private $translate
  ) {}
  initList() {
    this.logParseSrv.getListRule(this.contextSrv.user.orgId, this.contextSrv.user.systemId).then((response) => {
      this.ruleList = response.data;
    });
  }

  deleteRuleById(ruleId) {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', [this.$translate.i18n_sorry, this.$translate.i18n.i18n_no_authority]);
      return;
    }
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_delete,
      text: this.$translate.i18n.page_log_config_del_tip,
      icon: 'fa-trash',
      yesText: this.$translate.i18n.i18n_delete,
      noText: this.$translate.i18n.i18n_cancel,
      onConfirm: () => {
        this.logParseSrv.deletePattern(ruleId, this.contextSrv.user.id).then((res) => {
          this.$scope.appEvent('alert-success', [this.$translate.i18n.i18n_success]);
          _.remove(this.ruleList, (rule) => {
            return rule.id === ruleId;
          });
        }, () => {
          this.$scope.appEvent('alert-danger', [this.$translate.i18n.i18n_fail, this.$translate.i18n.i18n_try_later]);
        });
      }
    });
  }

  initDetail() {
    this.logParseSrv.getHostList().then((result) => {
      this.hostList = result.data;
      this.getRuleById(this.$routeParams.ruleId);
    });
  }

  getRuleById(id) {
    this.logParseSrv.getRuleById(id).then((response) => {
      this.rule = response.data;
      this.rule.hosts = _.map(this.rule.hosts, (host)=>{
        return _.find(this.hostList, {id: host});
      });
      this.initCheckStatus('1');
    });
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
}

coreModule.controller('LogParseCtrl', LogParseCtrl);
