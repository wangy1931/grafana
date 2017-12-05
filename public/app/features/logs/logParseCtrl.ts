///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class LogParseCtrl {
  ruleList: Array<any>;

  navModel: any;

  /** @ngInject */
  constructor(private $scope, private contextSrv, private logParseSrv, private navModelSrv) {
    this.logParseSrv.getListRule(this.contextSrv.user.orgId, this.contextSrv.user.systemId).then((response) => {
      this.ruleList = response.data;
    });
    this.navModel = navModelSrv.getLogsParseNav(0);
  }

  deleteRuleById(ruleId) {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限执行该操作']);
      return;
    }
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      text: '该操作将删除所有相关日志配置,您确定要删除该规则吗？',
      icon: 'fa-trash',
      yesText: '删除',
      noText: '取消',
      onConfirm: () => {
        this.logParseSrv.deletePattern(ruleId, this.contextSrv.user.id).then((res) => {
          this.$scope.appEvent('alert-success', ['删除成功']);
          _.remove(this.ruleList, (rule) => {
            return rule.id === ruleId;
          });
        }, () => {
          this.$scope.appEvent('alert-danger', ['删除失败', '请稍后重试']);
        });
      }
    });
  }
}

coreModule.controller('LogParseCtrl', LogParseCtrl);
