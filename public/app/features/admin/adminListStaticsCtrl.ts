///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import coreModule from 'app/core/core_module';

class AdminListStaticsCtrl {
  statics: Array<any>;

  /** @ngInject **/
  constructor(private $scope, private staticSrv) {
    this.getStatics('');
  }

  getStatics(type) {
    this.staticSrv.getStatics(type).then(res => {
      this.statics = _.orderBy(res, ['Type', 'OrgId', 'Name']);
    });
  }

  deleteStatic(id) {
    this.$scope.appEvent('confirm-modal', {
      title: '您确定要删除该配置项吗？',
      text: '该操作可能将导致页面不能正常显示,请谨慎操作',
      icon: 'fa-trash',
      yesText: 'Delete',
      onConfirm: () => {
        this.staticSrv.deleteStatic(id).then(res => {
          this.statics = _.remove(this.statics, {Id: id})
          this.$scope.appEvent('alert-success', ['deleted']);
        });
      }
    })
  }
}

coreModule.controller('AdminListStaticsCtrl', AdminListStaticsCtrl)
