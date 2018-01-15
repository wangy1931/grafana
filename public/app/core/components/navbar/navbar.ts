///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

export class NavbarCtrl {
  showGuideNav: boolean = false;
  showNavbarPageBtn: boolean = false;

  /** @ngInject */
  constructor(private $scope, private $rootScope, private $location, private contextSrv) {
    !!~['/rca', '/association', '/logs', '/topn'].indexOf(this.$location.path()) && (this.showGuideNav = true);
    this.showNavbarPageBtn = (this.$location.path() === '/');
  }

  showGuide() {
    this.$rootScope.appEvent('show-guide-book');
  }
}

export function navbarDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/navbar/navbar.html',
    controller: NavbarCtrl,
    bindToController: true,
    transclude: true,
    controllerAs: 'ctrl',
    scope: {
      title: "@",
      titleUrl: "@",
      iconUrl: "@",
    },
    link: function(scope, elem, attrs, ctrl) {
      ctrl.icon = attrs.icon;
      elem.addClass('navbar');
    }
  };
}

coreModule.directive('navbar', navbarDirective);
