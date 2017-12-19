
import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import coreModule from 'app/core/core_module';

export class TreeMenuCtrl {
  isAssociation: boolean;
  isOpen: boolean;
  isLoding: boolean;
  yaxisNumber: number;
  correlationMetrics: any;
  prox: any;
  panel: any;
  groupType: any;
  correlationHosts: any;
  isExpert: boolean;
  timeRange: any;

  /** @ngInject */
  constructor(private $scope, private associationSrv,
    private $rootScope, private $timeout,
    private $controller, private backendSrv,
    private contextSrv, private healthSrv,
    private alertMgrSrv, private timeSrv
  ) {
    this.isOpen = false;
    this.isLoding = true;
    this.groupType = 'metrics';

    var analysis = this.$rootScope.$on('analysis', (event, data) =>{
      if (_.isEqual(data, 'thresholdSlider')) {
        this.associationSrv.updateRang(this.$scope.$parent.thresholdSlider.get());
      }
      this.init();
    });

    this.$scope.$on('$destroy', () => {
      analysis();
      this.associationSrv.sourceAssociation = {};
    });

    this.yaxisNumber = 3;
    this.prox = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';

    this.timeRange = {};
    // this.timeRange.from = this.timeSrv.timeRange().from.unix();
    // this.timeRange.to = this.timeSrv.timeRange().to.unix();
  }

  init(type?) {
    this.groupType = type || this.groupType;
    this.isOpen = true;
    this.isLoding = true;
    this.isAssociation = false;
    var association = this.associationSrv.sourceAssociation;
    this.clearSelected();
    var params = {
      metric: association.metric,
      host: association.host,
      minDistance: 1000 - association.max,
      maxDistance: 1000 - association.min,
      group: this.groupType
    }
    if (this.isExpert) {
      this.isExpert = false;
      params['startSec'] = this.timeRange.from;
      params['endSec'] = this.timeRange.to;
    }
    if (!_.isEmpty(association)) {
      this.alertMgrSrv.loadAssociatedMetrics(params)
      .then((response) => {
        var res = response.data;
        this.timeRange.from = res.startSec;
        this.timeRange.to = res.endSec;
        if (this.groupType === 'metrics') {
          this.correlationMetrics = res.data || {};
        } else {
          this.correlationHosts = res.data || {};
        }
        if (!_.isEmpty(res.data)) {
          this.isAssociation = true;
        }
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
    if (this.groupType === 'metrics') {
      this.correlationMetrics['自定义指标'][target.metric] = {hosts: [target.host]};
    } else {
      this.correlationMetrics['自定义指标'][target.metric] = {metrics: [target.host]};
    }
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

  addQuery(event, metric, host, otherMetric?) {
    if (host === '自定义指标') {
      host = metric;
      metric = otherMetric;
    }
    if (this.checkSource(metric, host)) {
      return;
    } else {
      var $currentTarget = $(event.currentTarget);
      var $target = $(event.target);
      if (!$target.is('input')) {
        var $input = $currentTarget.find('input')
        var checked = $input.prop('checked');
        $input.prop({checked: !checked});
      }

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
          "downsampleInterval": "",
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
      this.healthSrv.transformPanelMetricType(this.panel).then(() => {
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
    if (!this.contextSrv.isViewer) {
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

  initByTime() {
    var start = this.timeSrv.timeRange().from.unix();
    var from = moment(start * 1000);
    var end = this.timeSrv.timeRange().to.unix();
    var diff = moment().diff(from, 'days', true);
    if (diff > 2) {
      this.$scope.appEvent('alert-warning', ['您仅可以关联两天以内的数据', '请选择两天以内的时间区间']);
      return;
    }
    diff = moment(end * 1000).diff(from, 'minutes');
    if (diff < 20) {
      this.$scope.appEvent('alert-warning', ['最小关联时间为20分钟', '请选择大于20分钟的时间区间']);
      return;
    }
    this.$scope.appEvent('confirm-modal', {
      title: '确定',
      text: '您确定要重新计算关联指标吗？\n该计算过程可能较长,请耐心等待',
      yesText: '确定',
      noText: '取消',
      onConfirm: () => {
        this.isExpert = true;
        this.timeRange.from = start;
        this.timeRange.to = end;
        this.init();
      }
    })
  }
}

export function treeMenu() {
  return {
    restrict: 'E',
    controller: TreeMenuCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'public/app/core/components/tree_menu/tree_menu.html',
    link: (scope, elem, attrs, ctrl) => {
      ctrl.panel = scope.$parent.panel;
    }
  };
}

coreModule.directive('cwTreeMenu', treeMenu);
