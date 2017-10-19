///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

var template = `
  <div class="toolbar-content">
    <div class="popover-content">
      <a href="javascript:;" class="toolbar-item" ng-click="guide();">
        <p class="item-name">诊断引导</p>
      </a>
    </div>
  </div>
`;

export class ToolbarCtrl {

  /** @ngInject */
  constructor(private $rootScope, private $scope, private popoverSrv, private backendSrv, private $q, private $location) {
  }

  showPopover() {
    this.popoverSrv.show({
      element : $('.toolbar-icon')[0],
      position: 'top center',
      template: template,
      classes : 'toolbar-popover',
      model : {
        guide: () => {
          this.$rootScope.appEvent('show-guide-book');
        }
        // tags: this.$scope.tags,
        // id  : this.$scope.id
      },
    });
  }
}

export function toolbarDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/toolbar/toolbar.html',
    controller: ToolbarCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {},
    link: function(scope, elem) {
      // 
    }
  };
}

coreModule.directive('toolbar', toolbarDirective);
