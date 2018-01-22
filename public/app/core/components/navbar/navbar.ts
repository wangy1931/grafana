///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import coreModule from '../../core_module';

export class NavbarCtrl {
  showGuideNav: boolean = false;
  deadline: Number;
  priceUrl: string;
  showNavbarPageBtn: boolean = false;

  /** @ngInject */
  constructor(private $scope, private $rootScope, private $location, private contextSrv) {
    !!~['/rca', '/association', '/logs', '/topn'].indexOf(this.$location.path()) && (this.showGuideNav = true);
    this.showNavbarPageBtn = (this.$location.path() === '/');
    this.deadline = moment(contextSrv.user.deadline).diff(moment(), 'days');
    this.priceUrl = '//cloudwiz.cn/product_price.html';
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
      text: "@",
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
