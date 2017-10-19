///<reference path="../../../headers/common.d.ts" />

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

  /** @ngInject */
  constructor(private $rootScope, private $scope, private hostSrv, private alertMgrSrv, private $timeout, private $q, private $location) {
    this.stepIndex = 0;
    this.steps = [];

    $rootScope.onAppEvent('show-guide-book', this.showGuide.bind(this), $scope);

    // params: guide metric host start
    var searchParams = $location.search();
    searchParams.guide && (this.show = true);
    searchParams.host = searchParams.host || '*';
    _.extend(this.selected, searchParams);
    // does not work
    $timeout(this.located.bind(this), 0);

    this.steps.push({
      title: '定位问题',
      icon: 'icon-gf icon-gf-check',
      href: '/',
      // target: '_blank',
      note: '系统报警<br/>服务KPI<br/>机器KPI',
      check: () => $q.when(true),
      jumpTo: () => {
        this.jump('/');
      }
    });

    this.steps.push({
      title: '故障溯源',
      cta: '故障溯源',
      icon: 'icon-gf icon-gf-apps',
      href: '/rca',
      note: '根据故障问题，寻找根源',
      // check: () => $q.when(false),
      check: () => $q.when(this.$location.path() !== '/rca'),
      jumpTo: () => {
        this.jump('/rca');
      }
    });

    this.steps.push({
      title: '关联分析',
      cta: '关联分析',
      icon: 'icon-gf iconfont fa-association',
      href: '/association',
      check: () => $q.when(this.$location.path() !== '/association'),
      jumpTo: () => {
        this.jump('/association');
      }
    });

    this.steps.push({
      title: '日志分析',
      cta: '日志分析',
      icon: 'fa fa-fw fa-file-text-o',
      href: '/association',
      check: () => $q.when(false),
      jumpTo: () => {
        this.jump('/association');
      }
      // check: () => {
      //   return  this.backendSrv.get('/api/org/users').then(res => {
      //     return res.length > 1;
      //   });
      // }
    });

    this.steps.push({
      title: '高消耗进程',
      cta: '高消耗进程',
      icon: 'icon-gf iconfont fa-process',
      href: '/dashboard/db/topn',
      check: () => $q.when(this.$location.path() !== '/dashboard/db/topn'),
      jumpTo: () => {
        this.jump('/dashboard/db/topn');
      }
    });

    this.init();
  }

  init() {
    this.stepIndex = -1;
    this.getExceptionMetrics();
    this.getExceptionHost();

    return this.nextStep().then(res => {
      // this.showGuide = true;
    });
  }

  nextStep() {
    if (this.stepIndex === this.steps.length - 1) {
      return this.$q.when();
    }

    this.stepIndex += 1;
    var currentStep = this.steps[this.stepIndex];
    return currentStep.check().then(passed => {
      if (passed) {
        currentStep.cssClass = 'completed';
        return this.nextStep();
      }

      currentStep.cssClass = 'active';
      return this.$q.when();
    });
  }

  showGuide() {
    this.show = true;
  }

  dismiss() {
    this.show = false;
  }

  located() {
    this.$rootScope.appEvent('exception-located', this.selected);
  }

  jump(path) {
    // var searchParams = this.$location.search();
    // var host = searchParams.host || '*';
    // var url = `${path}?guide&metric=${searchParams.metric}&host=${host}&start=${searchParams.start}`;
    var url = `${path}?guide&metric=${this.selected.metric}&host=${this.selected.host}&start=${this.selected.start}`;
    this.$location.url(url);
  }

  onSelectChange() {
    var search = _.extend(this.$location.search(), this.selected);
    this.$location.search(search);
  }

  getExceptionMetrics() {
    this.exceptionMetrics = [];

    this.alertMgrSrv.loadTriggeredAlerts().then(response => {
      response.data.forEach(item => {
        this.exceptionMetrics.push({
          name: _.getMetricName(item.metric),
          time: item.status.levelChangedTime,
          host: item.status.monitoredEntity
        });
      });
    });

    // kpi exception metrics
  }

  getExceptionHost() {
    if (_.isEmpty(this.hostSrv.hostInfo)) {
      this.hostSrv.getHostInfo().then(response => {
        this.exceptionHosts = response;
      });
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
      guideClass: '@'
    }
  };
}

coreModule.directive('guide', guideDirective);
