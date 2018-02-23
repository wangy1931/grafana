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
  }
}

coreModule.controller('AdminListStaticsCtrl', AdminListStaticsCtrl)
