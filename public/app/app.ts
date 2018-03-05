import 'babel-polyfill';
import 'file-saver';
import 'lodash';
import 'jquery';
import 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-native-dragdrop';
import 'angular-bindonce';
import 'react';
import 'react-dom';

// import 'angular-animate';
// import 'angular-ui';
// import 'ui.calendar';
// import 'fullcalendar';
// import 'spectrum';
import 'app/core/lodash_extended';

import 'vendor/bootstrap/bootstrap';
import 'vendor/angular-other/angular-strap';
import 'vendor/angular-ui/ui-bootstrap-tpls';
import 'vendor/angular-ui-calendar/src/calendar';

import 'vendor/angular-other/angular-strap.tpl';
import 'vendor/angular-other/angular-strap-old';

import 'vendor/jsPlumb/jsPlumbToolkit';

// import 'vendor/quill/ng-quill';
import 'vendor/angular-other/ng-table.min';

import * as locale_en from 'app/core/i18n/en';
import * as locale_zh_cn from 'app/core/i18n/zh_CN';

import $ from 'jquery';
import angular from 'angular';
import config from 'app/core/config';
import _ from 'lodash';
import moment from 'moment';
import {coreModule, registerAngularDirectives} from './core/core';
import { setupAngularRoutes } from './routes/routes';

declare var System: any;

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
    var app = angular.module('grafana', ['mgcrea.ngStrap', 'ngTable', 'cloudwiz.translate']);
    app.constant('grafanaVersion', '@grafanaVersion@');

    var locale = config.bootData.user.locale;
    /en/.test(locale) && (locale = 'en');
    /zh/.test(locale) && (locale = 'zh_CN');

    locale = window.localStorage.getItem('CLOUDWIZ_LANG_KEY') || locale;
    moment.locale(locale);

    app.config(['$translateProvider', ($translateProvider) => {
      $translateProvider.translations(locale, locale_en.default);
      $translateProvider.translations(locale, locale_zh_cn.default);
      $translateProvider.determinePreferredLanguage().fallbackLanguage('zh_CN');
      $translateProvider.useLocalStorage();
    }]);

    app.config(($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) => {
      //$compileProvider.debugInfoEnabled(false);
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension|javascript):/);

      this.registerFunctions.controller = $controllerProvider.register;
      this.registerFunctions.directive = $compileProvider.directive;
      this.registerFunctions.factory = $provide.factory;
      this.registerFunctions.service = $provide.service;
      this.registerFunctions.filter = $filterProvider.register;

      $provide.decorator('$http', [
        '$delegate',
        '$templateCache',
        function($delegate, $templateCache) {
          var get = $delegate.get;
          $delegate.get = function(url, config) {
            if (url.match(/\.html$/)) {
              // some template's already exist in the cache
              if (!$templateCache.get(url)) {
                url += '?v=' + new Date().getTime();
              }
            }
            return get(url, config);
          };
          return $delegate;
        },
      ]);
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
      'ngQuill',
      'react',
    ];

    var module_types = ['controllers', 'directives', 'factories', 'services', 'filters', 'routes'];

    _.each(module_types, type => {
      var moduleName = 'grafana.' + type;
      this.useModule(angular.module(moduleName, []));
    });

    // makes it possible to add dynamic stuff
    this.useModule(coreModule);

    // register react angular wrappers
    coreModule.config(setupAngularRoutes);
    registerAngularDirectives();

    var preBootRequires = [System.import('app/features/all')];

    Promise.all(preBootRequires)
      .then(() => {
        // disable tool tip animation
        $.fn.tooltip.defaults.animation = false;
        // bootstrap the app
        angular.bootstrap(document, this.ngModuleDependencies).invoke(() => {
          _.each(this.preBootModules, module => {
            _.extend(module, this.registerFunctions);
          });

          this.preBootModules = null;
        });
      })
      .catch(function(err) {
        console.log('Application boot failed:', err);
      });
  }
}

export default new GrafanaApp();
