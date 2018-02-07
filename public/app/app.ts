///<reference path="headers/common.d.ts" />

import 'bootstrap';
import 'vendor/filesaver';
import 'lodash-src';
import 'angular-strap';
import 'angular-route';
import 'angular-sanitize';
import 'angular-dragdrop';
import 'angular-bindonce';
import 'angular-animate';
import 'angular-ui';
import 'ui.calendar';
import 'fullcalendar';

import 'angular-strap.tpl';
import 'angular-strap-old';

import 'jsPlumbToolkit';

import 'ng-quill';
import 'ng-table';

import $ from 'jquery';
import angular from 'angular';
import config from 'app/core/config';
import _ from 'lodash';
import moment from 'moment';
import {coreModule} from './core/core';

export class GrafanaApp {
  registerFunctions: any;
  ngModuleDependencies: any[];
  preBootModules: any[];

  constructor() {
    this.preBootModules = [];
    this.registerFunctions = {};
    this.ngModuleDependencies = [];
  }

  useModule(module) {
    if (this.preBootModules) {
      this.preBootModules.push(module);
    } else {
      _.extend(module, this.registerFunctions);
    }
    this.ngModuleDependencies.push(module.name);
    return module;
  }

  init() {
    var app = angular.module('grafana', ['mgcrea.ngStrap', 'ngAnimate', 'ngTable', 'cloudwiz.translate']);
    app.constant('grafanaVersion', "@grafanaVersion@");

    var locale = config.bootData.user.locale;
    /en/.test(locale) && (locale = 'en');
    /zh/.test(locale) && (locale = 'zh_CN');

    locale = window.localStorage.getItem('CLOUDWIZ_LANG_KEY') || locale;
    moment.locale(locale);

    // fullcalendar: 没有检测到英文, 均显示中文
    if (!/en/.test(locale)) {
      System.import('zh-cn')
    }

    app.config(['$translateProvider', ($translateProvider) => {
      $translateProvider.useStaticFilesLoader({
        prefix: 'public/app/core/i18n/',
        suffix: '.json'
      });
      $translateProvider.determinePreferredLanguage().fallbackLanguage('zh_CN');
      $translateProvider.useLocalStorage();
    }]);

    app.config(($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) => {
      //$compileProvider.debugInfoEnabled(false);
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension|javascript):/);

      this.registerFunctions.controller = $controllerProvider.register;
      this.registerFunctions.directive  = $compileProvider.directive;
      this.registerFunctions.factory    = $provide.factory;
      this.registerFunctions.service    = $provide.service;
      this.registerFunctions.filter     = $filterProvider.register;

      $provide.decorator("$http", ["$delegate", "$templateCache", function($delegate, $templateCache) {
        var get = $delegate.get;
        $delegate.get = function(url, config) {
          if (url.match(/\.html$/)) {
            // some template's already exist in the cache
            if (!$templateCache.get(url)) {
              url += "?v=" + new Date().getTime();
            }
          }
          return get(url, config);
        };
        return $delegate;
      }]);
    });

    this.ngModuleDependencies = [
      'grafana.core',
      'ngRoute',
      'ngSanitize',
      '$strap.directives',
      'ang-drag-drop',
      'grafana',
      'pasvaz.bindonce',
      'ui.bootstrap',
      'ui.bootstrap.tpls',
      'ui.calendar',
      'ngQuill'
    ];

    var module_types = ['controllers', 'directives', 'factories', 'services', 'filters', 'routes'];

    _.each(module_types, type => {
      var moduleName = 'grafana.' + type;
      this.useModule(angular.module(moduleName, []));
    });

    // makes it possible to add dynamic stuff
    this.useModule(coreModule);

    var preBootRequires = [System.import('app/features/all')];

    Promise.all(preBootRequires).then(() => {
      // disable tool tip animation
      $.fn.tooltip.defaults.animation = false;
      // bootstrap the app
      angular.bootstrap(document, this.ngModuleDependencies).invoke(() => {
        _.each(this.preBootModules, module => {
          _.extend(module, this.registerFunctions);
        });

        this.preBootModules = null;
      });
    }).catch(function(err) {
      console.log('Application boot failed:', err);
    });
  }
}

export default new GrafanaApp();
