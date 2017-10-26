///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

var template = ``;

export class TimeWindowCtrl {

  /** @ngInject */
  constructor(private $rootScope, private $scope, private popoverSrv, private backendSrv, private $q, private $location) {
  }

}

export function timeWindowDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/time_window/time_window.html',
    controller: TimeWindowCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {},
  };
}

coreModule.directive('timeWindow', timeWindowDirective);
