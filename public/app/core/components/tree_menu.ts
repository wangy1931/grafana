
import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from 'app/core/core_module';

var template = `<div class="tree-menu" ng-class="{true: 'open', false: 'close'}[ctrl.isOpen]">
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
    <div class="tree-content" id="tree-content" ng-show="ctrl.isAssociation"></div>
    <div class="tree-content no-data" ng-show="!ctrl.isAssociation">
      <p>没有关联结果？调整下相似度试试吧。</p>
      <p>还是没有？请点击"刷新结果"按钮</p>
      <button class="btn btn-outline-primary" ng-click="ctrl.init()">刷新结果</button>
    </div>
    <div class="slider-container"><span>调整相似度</span><div class="sliders" slider></div></div>
  </div>
  <cw-loading class="tree-container" ng-if="ctrl.isLoding" show="ctrl.isLoding" duration=6000></cw-loading>
</div>`;

export class TreeMenuCtrl {
  isAssociation: boolean;
  isOpen: boolean;
  isLoding: boolean;
  yaxisNumber: number;

  /** @ngInject */
  constructor(private $scope, private associationSrv,
    private $rootScope, private $timeout,
    private $controller, private backendSrv,
    private contextSrv, private healthSrv,
    private alertMgrSrv
  ) {
    this.isOpen = false;
    this.$timeout(() => {
      this.$rootScope.thresholdSlider.on('change', () => {
        this.associationSrv.updateDistance(this.$rootScope.thresholdSlider.get());
        this.init();
      });
    });

    var analysis = this.$rootScope.$on('analysis', (event, data) =>{
      this.associationSrv.updateDistance(this.$rootScope.thresholdSlider.get());
      this.init();
    });

    this.$scope.$on('$destroy', () => {
      analysis();
      this.associationSrv.correlationMetrics = {};
      this.associationSrv.sourceAssociation = {};
    });

    this.yaxisNumber = 3;
  }

  init() {
    this.isOpen = true;
    this.isLoding = true;
    this.isAssociation = false;
    if (this.associationSrv.sourceAssociation) {
      this.associationSrv.setCorrelationMetrics().then(()=>{
        if (!_.isEmpty(this.associationSrv.correlationMetrics)) {
          this.isAssociation = true;
        }
        this.clearSelected();
        this.isLoding = false;
      }, ()=>{
        this.isLoding = false;
      });
    }
  }

  showTree() {
    this.isOpen = !this.isOpen;
    this.$scope.broadcastRefresh();
    if (!_.isEmpty(this.associationSrv.correlationMetrics) && !this.isAssociation) {
      this.isAssociation = true;
      this.resetCorrelationAnalysis();
    }
  }

  getTree(obj, container) {
    var _ul = $('<ul class="tree_ul"></ul>');
    for (var i in obj) {
      var _li = $('<li class="tree_li"></li>');
      if (i === 'hosts') {
        var hostStr = '';
        for (var h in obj[i]) {
          var metric = container.children('.tree_node').find('p').text();
          var host = obj[i][h];
          var disabled = '';
          if (_.isEqual(_.getMetricName(this.associationSrv.sourceAssociation.metric), metric) &&
              _.isEqual(this.associationSrv.sourceAssociation.host, host)) {
                disabled = 'disabled="disabled" checked="true"';
          }
          hostStr += '<div class="tree_leaf"><input type="checkbox" '
            + disabled +' name="tree_leaf" value="'
            + obj[i][h] + '"/><p>'
            + obj[i][h] + '</p>';
          (disabled)
            ? hostStr += '</div>'
            : hostStr += '<span><i class="fa fa-thumbs-o-up add-rca"></i><i class="fa fa-thumbs-o-down"></i></span></div>';
        }
        _li.append(hostStr);
      } else {
        _li.append('<div class="tree_node"><i class="fa fa-plus-square-o"></i><p>' + _.getMetricName(i) + '</p></div>');
        this.getTree(obj[i], _li);
      }
      _ul.append(_li);
    }
    container.append(_ul);
  }

  resetCorrelationAnalysis() {
    $('#tree-content').empty();
    this.getTree(this.associationSrv.correlationMetrics, $('#tree-content'));
    $('.tree_node').next('.tree_ul').hide();

    $('.tree_node').click((event) => {
      var _i = $(event.currentTarget).find('i');
      var _ul = $(event.currentTarget).next('.tree_ul');
      if (_i.hasClass('fa-plus-square-o')) {
        _i.removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
        _ul.show();
      } else {
        _i.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
        _ul.hide();
      }
    });

    $('.tree_leaf').click((event) => {
      var _input = $(event.currentTarget).find('input');
      if (_input.prop('disabled')) {
        return;
      } else {
        var metric = $(event.currentTarget).parent().parent().prev().find('p').text();
        var host = _input.val();
        if ($(event.target).is('i')) {
          this.toggleClass(event, metric, host);
        } else {
          this.addQuery(_input, metric, host);
        }
      }
    });
  }

  showNewAssociationManual() {
    var newScope = this.$scope.$new();
    newScope.datasource = this.$scope.datasource;
    this.$controller('OpenTSDBQueryCtrl', {$scope: newScope});
    newScope.addManualMetric = this.addManualMetric.bind(this);
    this.$scope.suggestTagHost = this.backendSrv.suggestTagHost;
    this.$scope.appEvent('show-modal', {
      src: 'public/app/partials/manual_association.html',
      modalClass: 'modal-no-header confirm-modal',
      scope: newScope
    });
  }

  addManualMetric(target) {
    target.metric = this.contextSrv.user.orgId + "." + this.contextSrv.user.systemId + "." + target.metric;
    if (!_.hasIn(this.associationSrv.correlationMetrics, '自定义指标')) {
      this.associationSrv.correlationMetrics['自定义指标'] = {};
    }
    this.associationSrv.correlationMetrics['自定义指标'][target.metric] = {hosts: [target.host]};
    this.isAssociation = true;
    this.resetCorrelationAnalysis();
  }

  clearSelected() {
    if (this.$scope.dashboard) {
      var sourceMetric = this.associationSrv.sourceAssociation;
      _.each(this.$scope.dashboard.rows[0].panels[0].targets, (target) => {
        if (!(target.metric === _.getMetricName(sourceMetric.metric) && target.tags.host === sourceMetric.host)) {
          target.hide = true;
        }
      });
      this.$scope.broadcastRefresh();
    }
    this.resetCorrelationAnalysis();
  }

  addQuery(_input, metric, host) {
    if (!$(event.target).is('input')) {
      var checked = !_input.prop('checked');
      _input.prop({checked : checked});
    }
    var targets = this.$scope.dashboard.rows[0].panels[0].targets;
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
      this.$scope.dashboard.rows[0].panels[0].targets.push(target);
      var seriesOverride = {
        "alias": metric+"{host"+"="+host+"}",
        "yaxis": this.yaxisNumber++
      };
      var yaxes = {
        'label': null,
        'show': true,
        'logBase': 1,
        'min': null,
        'max': null,
        'format': "short"
      };
      this.$scope.dashboard.rows[0].panels[0].seriesOverrides.push(seriesOverride);
      this.$scope.dashboard.rows[0].panels[0].yaxes.push(yaxes);
    }
    this.healthSrv.transformMetricType(this.$scope.dashboard).then(() => {
      this.$scope.broadcastRefresh();
    });
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
    var prox = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';
    var rcaFeedback = {
      alertIds: [],
      timestampInSec: Math.round(new Date().getTime()/1000),
      triggerMetric: {
        name: this.associationSrv.sourceAssociation.metric,
        host: this.associationSrv.sourceAssociation.host,
      },
      rootCauseMetrics: [{
        name: prox + metric,
        host: host,
        confidenceLevel: 100
      }],
      relatedMetrics: [],
      org: this.contextSrv.user.orgId,
      sys: this.contextSrv.user.systemId
    };

    this.alertMgrSrv.rcaFeedback(rcaFeedback);
  }
}

export function treeMenu() {
  return {
    restrict: 'E',
    controller: TreeMenuCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    template: template
  };
}

coreModule.directive('cwTreeMenu', treeMenu);
