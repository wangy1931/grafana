///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';
import {NavModel, NavModelItem}  from '../../nav_model_srv';

export class NavbarCtrl {
  // model: NavModel;
  // section: NavModelItem;
  // hasMenu: boolean;

  showGuideNav: boolean = false;

  /** @ngInject */
  constructor(private $scope, private $rootScope, private contextSrv, private $location) {
    // this.section = this.model.section;
    // this.hasMenu = this.model.menu.length > 0;

    !!~['/rca', '/association', '/logs', '/topn'].indexOf(this.$location.path()) && (this.showGuideNav = true);
  }

  showSearch() {
    this.$rootScope.appEvent('show-dash-search');
  }

  navItemClicked(navItem, evt) {
    if (navItem.clickHandler) {
      navItem.clickHandler();
      evt.preventDefault();
    }
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
      model: "=",
    },
    link: function(scope, elem) {
      elem.addClass('navbar');
    }
  };
}

coreModule.directive('navbar', navbarDirective);
