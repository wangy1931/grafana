///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import $ from 'jquery';
import coreModule from 'app/core/core_module';

var template = `
<span class="cwiz-switch {{ ctrl.switchClass }}" ng-class="{ 'checked': ctrl.enabled }">
  <input type="checkbox" id="check1" ng-class="{ 'checked': ctrl.enabled }" ng-model="ctrl.enabled" ng-change="ctrl.internalOnChange();" hidden />
  <label for="check1"></label>
  <span class="switch-text">
    <span class="on">{{ ctrl.textOn }}</span>
    <span class="off">{{ ctrl.textOff }}</span>
  </span>
</span>
`;

export class CwizSwitchCtrl {
  enabled: boolean;
  onChange: any;

  /** @ngInject */
  constructor(private $scope, private $timeout) {
  }

  internalOnChange() {
    return this.$timeout(() => {
      return this.onChange();
    });
  }

}

export function cwizSwitchDirective() {
  return {
    restrict: 'AE',
    controller: CwizSwitchCtrl,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      switchClass: "@",
      textOn: "@",
      textOff: "@",
      enabled: "=",
      onChange: "&"
    },
    template: template,
  };
}

coreModule.directive('cwizSwitch', cwizSwitchDirective);
