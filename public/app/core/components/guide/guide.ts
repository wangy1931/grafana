///<reference path="../../../headers/common.d.ts" />

import angular from 'angular';
import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

export class GuideCtrl {
  stepIndex: number;
  steps: Array<any>;
  show: boolean;
  exceptionMetrics: any = [];
  exceptionHosts: any = [];
  selected: any = {};
  collapsed: boolean = true;
  fixed: boolean = false;

  /** @ngInject */
  constructor(
    private $rootScope,
    private $scope,
    private hostSrv,
    private alertMgrSrv,
    private $timeout,
    private $q,
    private $location,
    private $controller,
    private datasourceSrv
  ) {
    this.stepIndex = 0;
    this.steps = [];

    $rootScope.onAppEvent('show-guide-book', this.showGuide.bind(this), $scope);

    // params: guide metric host start
    var searchParams = $location.search();
    searchParams.guide && (this.show = true);
    searchParams.host = searchParams.host || '*';
    _.extend(this.selected, searchParams);
    // TO FIX: does not work sometimes
    $timeout(() => { this.located(); }, 100);

    this.steps.push({
      title: '发现问题',
      cta: '发现问题',
      icon: 'icon-gf icon-gf-check',
      href: '/',
      note: '1) 系统报警<br/>2) 服务KPI<br/>3) 机器KPI',
      check: () => $q.when(this.$location.path() === '/'),
      jumpTo: () => {
        this.$location.url('/');
      }
    });

    this.steps.push({
      title: '故障溯源',
      cta: '故障溯源',
      icon: 'icon-gf icon-gf-apps',
      href: '/rca',
      note: '根据故障问题，寻找根本原因',
      check: () => $q.when(this.$location.path() === '/rca'),
      jumpTo: () => {
        this.jump('/rca');
      }
    });

    this.steps.push({
      title: '关联分析',
      cta: '关联分析',
      icon: 'iconfont fa-association',
      href: '/association',
      note: '比较高相关性指标',
      check: () => $q.when(this.$location.path() === '/association'),
      jumpTo: () => {
        this.jump('/association');
      }
    });

    this.steps.push({
      title: '日志分析',
      cta: '日志分析',
      icon: 'fa fa-fw fa-file-text-o',
      href: '/logs',
      note: '全文搜索系统日志',
      check: () => $q.when(this.$location.path() === '/logs'),
      jumpTo: () => {
        var type = _.metricPrefix2Type(this.selected.metric.split(".")[0]);
        var query = `type:${type} AND host:${this.selected.host}`;
        var path = '/logs';
        var url = `${path}?guide&metric=${this.selected.metric}&host=${this.selected.host}&start=${this.selected.start}&query=${query}`;
        this.$location.url(url);
      }
    });

    this.steps.push({
      title: '资源消耗',
      cta: '资源消耗',
      icon: 'iconfont fa-process',
      href: '/topn',
      note: '查看资源消耗情况',
      check: () => $q.when(this.$location.path() === '/topn'),
      jumpTo: () => {
        this.jump('/topn');
      }
    });

    $scope.$on('$routeUpdate', () => {
      var metric = this.$location.search().metric;
      metric && !~this.exceptionMetrics.indexOf(metric) && this.exceptionMetrics.push(metric);
      _.extend(this.selected, this.$location.search());
    });

    this.init();
  }

  init() {
    this.stepIndex = -1;
    this.getExceptionMetrics();
    this.getExceptionHost();

    return this.nextStep().then(res => {
    });
  }

  nextStep() {
    if (this.stepIndex === this.steps.length - 1) {
      return this.$q.when();
    }

    this.stepIndex += 1;
    var currentStep = this.steps[this.stepIndex];
    return currentStep.check().then(current => {
      if (current) {
        currentStep.cssClass = 'active';
        return this.$q.when();
      }

      currentStep.cssClass = 'completed';
      return this.nextStep();
    });
  }

  showGuide() {
    this.show = true;
  }

  dismiss() {
    this.show = false;
  }

  collapse() {
    this.collapsed = !this.collapsed;
  }

  located() {
    this.$rootScope.appEvent('exception-located', this.selected);
  }

  jump(path, hash?) {
    var url = `${path}?guide&metric=${this.selected.metric}&host=${this.selected.host}&start=${this.selected.start}`;
    url += hash ? hash : '';
    this.$location.url(url);
  }

  onSelectChange() {
    var search = _.extend(this.$location.search(), this.selected);
    this.$location.search(search);
  }

  // TO IMPROVE: how to get all exception metrics? here are only alert metrics
  getExceptionMetrics() {
    this.exceptionMetrics = [];

    this.alertMgrSrv.loadTriggeredAlerts().then(response => {
      response.data && response.data.forEach(item => {
        this.exceptionMetrics.push({
          name: _.getMetricName(item.metric),
          time: item.status.levelChangedTime,
          host: item.status.monitoredEntity
        });
      });
    });
  }

  getExceptionHost() {
    if (_.isEmpty(this.hostSrv.hostInfo)) {
      this.hostSrv.getHostInfo().then(response => {
        this.exceptionHosts = response;
      });
    } else {
      this.exceptionHosts = this.hostSrv.hostInfo;
    }
  }
}

export function guideDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/guide/guide.html',
    controller: GuideCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      needHost: '@',
      guideClass: '@',
      notMetric: '@'
    },
    link: function (scope, elem, attrs, ctrl) {
      var $scrollElement = elem.parent('.page-container');

      var scroll = function () {
        var scroll = $scrollElement.scrollTop();
        var shrinkHeader = ctrl.collapsed ? 90 : 230;
        ctrl.fixed = (scroll >= shrinkHeader) ? true : false;
        scope.$digest();
      }

      ctrl.show && $scrollElement.on('scroll', _.throttle(scroll.bind(this), 100));
    }
  };
}

coreModule.directive('guide', guideDirective);
