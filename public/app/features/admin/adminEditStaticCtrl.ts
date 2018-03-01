///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import angular from 'angular';
import coreModule from 'app/core/core_module';

class AdminEditStaticCtrl{
  static: any;

  /** @ngInject **/
  constructor(private $scope, private $routeParams, private staticSrv) {
    if ($routeParams.id) {
      this.staticSrv.getStaticById($routeParams.id).then(res => {
        this.static = res;
        this.static.JsonData = angular.toJson(this.static.JsonData, true);
      });
    }
  }

  update() {
    var data = _.cloneDeep(this.static);
    data.JsonData = angular.fromJson(this.static.JsonData);
    this.staticSrv.updateStatic(data).then(res => {
      this.$scope.appEvent('alert-success', ['updated']);
    });
  }
}

coreModule.controller('AdminEditStaticCtrl', AdminEditStaticCtrl)
