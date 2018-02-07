///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

var template = `
  <div class="toolbar-content">
    <div class="popover-content">
      <a href="{{ item.href }}" ng-repeat="item in toolbarItems" class="toolbar-item {{ item.class }}" ng-click="item.clickHandler()">
        <i class="{{ item.icon }}"></i>
        <p class="item-name">{{ item.itemname | translate }}</p>
      </a>
    </div>
  </div>
`;

export class ToolbarCtrl {
  toolbarItems: any;

  /** @ngInject */
  constructor(
    private $rootScope, private $scope, private popoverSrv, private backendSrv, private $q,
    private $location, private contextSrv, private $translate
  ) {
    this.toolbarItems = {};

    this.toolbarItems[1] = [];
    this.toolbarItems[1].push({
      class: '',
      icon : 'fa fa-fw fa-book',
      itemname: 'i18n_kb',
      href: '/knowledgebase',
      clickHandler: () => {},
    });

    this.toolbarItems[2] = [];
    if (!contextSrv.isViewer) {
      this.toolbarItems[2].push({
        class: '',
        icon : 'fa fa-fw fa-cloud-download',
        itemname: 'i18n_install_guide',
        href: '/setting/agent',
        clickHandler: () => {},
      });
    }

  }

  showPopover() {
    this.popoverSrv.show({
      element : $(`.toolbar-${this.$scope.ctrl.id}`)[0],
      position: 'bottom center',
      template: template,
      classes : 'toolbar-popover',
      model : {
        toolbarItems: this.toolbarItems[+this.$scope.ctrl.id],
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
    scope: {
      icon: "@",
      tooltip: "@",
      id: "@"
    },
  };
}

coreModule.directive('toolbar', toolbarDirective);
