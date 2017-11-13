
import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from 'app/core/core_module';

var template = `<div ng-init="ctrl.init()" class="tree-menu" ng-class="{true: 'open', false: 'close'}[ctrl.isOpen]">
  <div class="open-tree">
    <button ng-click="ctrl.showTree()" class="btn btn-primary btn-isopen">
      <i class="fa" ng-class="{true: 'fa-chevron-right', false: 'fa-chevron-left'}[ctrl.isOpen]"></i>
    </button>
  </div>
  <div class="tree-container" ng-show="ctrl.isOpen && !ctrl.isLoding">
    <p class="header">关联指标
      <i class="fa fa-plus-square-o btn-add-metric" ng-click="ctrl.showNewAssociationManual()"></i>
      <button class="btn btn-outline-primary pull-right" ng-click="ctrl.clearSelected()">清除选中</button>
    </p>
    <div class="tree-content" id="tree-content" ng-show="ctrl.isAssociation">
      <ul class="tree_ul accordion" id="accordion2">
        <li class="tree_li" ng-repeat="(service, metrics) in ctrl.correlationMetrics">
          <a ng-click="ctrl.toggleAccordion($event)" class="tree_node accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#{{_.snakeCase(service)}}">
            <i class="fa fa-plus-square-o"></i>
            <p>{{service + ' (' + _.keys(metrics).length + ')'}}</p>
          </a>
          <ul id="{{_.snakeCase(service)}}" class="tree_ul accordion-body collapse accordion">
            <li class="tree_li" ng-repeat="(metric, hosts) in metrics">
              <a ng-click="ctrl.toggleAccordion($event)" class="tree_node accordion-toggle" data-toggle="collapse" data-parent="#{{_.snakeCase(service)}}" href="#{{_.snakeCase(service) + $index}}">
                <i class="fa fa-plus-square-o"></i>
                <p bs-tooltip="'{{_.getMetricName(metric)}}'" data-placement="top" data-container="body">{{_.getMetricName(metric)}}</p>
              </a>
              <ul id="{{_.snakeCase(service) + $index}}" class="tree_ul accordion-body collapse">
                <li class="tree_li" ng-repeat="host in hosts.hosts">
                  <label class="tree_leaf">
                    <input type="checkbox" name="host"
                      ng-model="model"
                      ng-change="ctrl.addQuery(_.getMetricName(metric), host)"
                      ng-checked="ctrl.checkSource(metric, host)"
                      ng-disabled="ctrl.checkSource(metric, host)"/>
                    <p>{{host}}</p>
                  </label>
                  <span class="pull-right" ng-if="!ctrl.checkSource(metric, host)" ng-click="ctrl.toggleClass($event, _.getMetricName(metric), host)">
                    <i class="fa fa-thumbs-o-up add-rca"></i>
                    <i class="fa fa-thumbs-o-down"></i>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="tree-content no-data" ng-show="!ctrl.isAssociation">
      <p>没有关联结果？调整下相似度试试吧。</p>
      <p>还是没有？请点击"刷新结果"按钮</p>
      <button class="btn btn-outline-primary" ng-click="ctrl.init()">刷新结果</button>
    </div>
    <div class="slider-container">
      <div class="sliders" slider></div>
      <div class="slider-level"><span>低</span><span>相似度</span><span>高</span></div>
    </div>
  </div>
  <cw-loading class="tree-container" ng-if="ctrl.isLoding" show="ctrl.isLoding" duration=6000></cw-loading>
</div>`;

export class TreeMenuCtrl {
  isAssociation: boolean;
  isOpen: boolean;
  isLoding: boolean;
  yaxisNumber: number;
  correlationMetrics: any;
  prox: any;
  panel: any;

  /** @ngInject */
  constructor(private $scope, private associationSrv,
    private $rootScope, private $timeout,
    private $controller, private backendSrv,
    private contextSrv, private healthSrv,
    private alertMgrSrv
  ) {
    this.isOpen = false;

    var analysis = this.$rootScope.$on('analysis', (event, data) =>{
      if (_.isEqual(data, 'thresholdSlider')) {
        this.associationSrv.updateDistance(this.$scope.$parent.thresholdSlider.get());
      }
      this.init();
    });

    this.$scope.$on('$destroy', () => {
      analysis();
      this.associationSrv.sourceAssociation = {};
    });

    this.yaxisNumber = 3;
    this.prox = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';
  }

  init() {
    this.isOpen = true;
    this.isLoding = true;
    this.isAssociation = false;
    var association = this.associationSrv.sourceAssociation;
    if (!_.isEmpty(association)) {
      this.alertMgrSrv.loadAssociatedMetrics(association.metric, association.host, association.distance, true)
      .then((response) => {
        this.correlationMetrics = response.data || {};
        if (!_.isEmpty(response.data)) {
          this.isAssociation = true;
        }
        this.clearSelected();
        this.isLoding = false;
      }, () => {
        this.isLoding = false;
      });
    }

  }

  showTree() {
    this.isOpen = !this.isOpen;
    this.$timeout(()=>{
      this.$rootScope.$broadcast('render');
    })
  }

  showNewAssociationManual() {
    var newScope = this.$scope.$new();
    newScope.datasource = this.$scope.datasource;
    newScope.addManualMetric = this.addManualMetric.bind(this);
    this.$controller('OpenTSDBQueryCtrl', {$scope: newScope});
    this.backendSrv.getHosts({
      "queries": [],
      "hostProperties": ["id"]
    }).then(response => {
      this.$scope.suggestTagHost = _.map(response.data, 'hostname');
    });
    this.$scope.appEvent('show-modal', {
      src: 'public/app/partials/manual_association.html',
      modalClass: 'modal-no-header confirm-modal',
      scope: newScope
    });
  }

  addManualMetric(target) {
    target.metric = this.prox + target.metric;
    if (!_.hasIn(this.correlationMetrics, '自定义指标')) {
      this.correlationMetrics['自定义指标'] = {};
    }
    this.correlationMetrics['自定义指标'][target.metric] = {hosts: [target.host]};
    this.isAssociation = true;
  }

  clearSelected() {
    if (this.panel) {
      var sourceMetric = this.associationSrv.sourceAssociation;
      _.each(this.panel.targets, (target) => {
        if (!this.checkSource(this.prox+target.metric, target.tags.host)) {
          target.hide = true;
        }
      });
      this.$rootScope.$broadcast('refresh', this.panel.id);
    }
    $('[type="checkbox"]').prop({checked: false});
    $('[disabled="disabled"]').prop({checked: true});
  }

  addQuery(metric, host) {
    if (this.checkSource(metric, host)) {
      return;
    } else {
      var targets = this.panel.targets;
      var isHidden = true;
      _.each(targets, (target) => {
        if (target.metric === metric && target.tags.host === host) {
          isHidden = false;
          target.hide = !target.hide;
        }
      });
      if (isHidden) {
        var target = {
          "aggregator": "avg",
          "currentTagKey": "",
          "currentTagValue": "",
          "downsampleAggregator": "avg",
          "downsampleInterval": "1m",
          "errors": {},
          "hide": false,
          "isCounter": false,
          "metric": metric,
          "shouldComputeRate": false,
          "tags": {"host": host}
        };
        targets.push(target);
        var seriesOverride = {
          "alias": metric+"{host"+"="+host+"}",
          "yaxis": this.yaxisNumber++
        };
        this.panel.seriesOverrides.push(seriesOverride);
      }
      this.healthSrv.transformMetricType(this.$scope.dashboard).then(() => {
        this.$rootScope.$broadcast('refresh', this.panel.id);
      });
    }
  }

  toggleClass(event, metric, host) {
    var _i = $(event.target);
    var _is = $(event.currentTarget).find('i');
    if (_i.hasClass('add-rca')) {
      _is[1].className = 'fa fa-thumbs-o-down';
      _i.hasClass('fa-thumbs-o-up')
        ? (_i.removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up') && this.addRCA(metric, host))
        : _i.removeClass('fa-thumbs-up').addClass('fa-thumbs-o-up');
    } else {
      _is[0].className = 'fa fa-thumbs-o-up add-rca';
      _i.hasClass('fa-thumbs-o-down')
        ? _i.removeClass('fa-thumbs-o-down').addClass('fa-thumbs-down')
        : _i.removeClass('fa-thumbs-down').addClass('fa-thumbs-o-down');
    }
  }

  addRCA(metric, host) {
    var rcaFeedback = {
      alertIds: [],
      timestampInSec: Math.round(new Date().getTime()/1000),
      triggerMetric: {
        name: this.associationSrv.sourceAssociation.metric,
        host: this.associationSrv.sourceAssociation.host,
      },
      rootCauseMetrics: [{
        name: this.prox + metric,
        host: host,
        confidenceLevel: 100
      }],
      relatedMetrics: [],
      org: this.contextSrv.user.orgId,
      sys: this.contextSrv.user.systemId
    };

    this.alertMgrSrv.rcaFeedback(rcaFeedback);
  }

  toggleAccordion(event) {
    var _i = $(event.currentTarget).find('i');
    _i.hasClass('fa-plus-square-o')
      ? _i.removeClass('fa-plus-square-o').addClass('fa-minus-square-o')
      : _i.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
  }

  checkSource(metric, host) {
    return _.isEqual(metric, this.associationSrv.sourceAssociation.metric) &&
      _.isEqual(host, this.associationSrv.sourceAssociation.host)
  }
}

export function treeMenu() {
  return {
    restrict: 'E',
    controller: TreeMenuCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    template: template,
    link: (scope, elem, attrs, ctrl) => {
      ctrl.panel = scope.$parent.panel;
    }
  };
}

coreModule.directive('cwTreeMenu', treeMenu);
