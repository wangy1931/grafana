
import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import coreModule from 'app/core/core_module';

var custom_metric;

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
  timeRange: any;
  periods: any;
  limitTime: number;

  /** @ngInject */
  constructor(
    private $scope, private associationSrv,
    private $rootScope, private $timeout,
    private $controller, private backendSrv,
    private contextSrv, private healthSrv,
    private alertMgrSrv, private timeSrv,
    private $translate
  ) {
    custom_metric = this.$translate.i18n.page_metrics_custom;
    this.isOpen = false;
    this.isLoding = true;
    this.groupType = 'metrics';
    this.limitTime = 2;

    var analysis = this.$rootScope.$on('analysis', (event, data) => {
      switch (data) {
        case 'thresholdSlider':
          this.associationSrv.updateRang(this.$scope.$parent.thresholdSlider.get());
          this.init();
          this.refresh();
          break;
        case 'updateTime':
          this.initByTime();
          break;
        default:
          var association = this.associationSrv.sourceAssociation;
          this.loadAssociatedPeriods({
            metric: association.metric,
            host: association.host
          }).then((res) => {
            this.init();
          });
          break;
      }
    });

    this.$scope.$on('$destroy', () => {
      analysis();
      this.associationSrv.sourceAssociation = {};
    });

    this.yaxisNumber = 3;
    this.prox = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';

    this.timeRange = {
      from: this.timeSrv.timeRange().from.unix(),
      to: this.timeSrv.timeRange().to.unix()
    };

    this.backendSrv.get('/api/static/config').then((res) => {
      this.limitTime = res.limit_association;
    })
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
      group: this.groupType,
      startSec: this.timeRange.from,
      endSec: this.timeRange.to
    }
    if (!_.isEmpty(association)) {
      if (this.periods) {
        this.loadAssociatedMetrics(params);
      } else {
        this.loadAssociatedPeriods({
          metric: association.metric,
          host: association.host
        }).then((res) => {
          params.startSec = res.from;
          params.endSec = res.to;
          this.loadAssociatedMetrics(params);
        });
      }
    }
  }

  loadAssociatedPeriods(params) {
    return this.alertMgrSrv.loadAssociatedPeriods(params).then((res) => {
      this.periods = res.data;
      if (this.periods.length) {
        this.updateTimeRange(this.periods[0])
      } else {
        this.periods = [];
        this.periods.push({
          o1: this.timeRange.from,
          o2: this.timeRange.to,
        });
      }
      return this.timeRange;
    });
  }

  loadAssociatedMetrics(params) {
    this.alertMgrSrv.loadAssociatedMetrics(params)
    .then((res) => {
      if (this.groupType === 'metrics') {
        this.correlationMetrics = res.data;
      } else {
        this.correlationHosts = res.data;
      }
      if (!_.isEmpty(res.data)) {
        this.isAssociation = true;
      }
      this.isLoding = false;
    }, () => {
      this.isLoding = false;
    });
  }

  showTree() {
    this.isOpen = !this.isOpen;
    this.$timeout(() => {
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
    var custom = null;
    if (this.groupType === 'metrics') {
      (!this.correlationMetrics[custom_metric]) && (this.correlationMetrics[custom_metric] = {});
      custom = this.correlationMetrics[custom_metric];
      var key = target.metric;
      var value = target.host;
      var type = 'hosts';
    } else {
      (!this.correlationHosts['']) && (this.correlationHosts[custom_metric] = {});
      custom = this.correlationHosts[custom_metric];
      key = target.host;
      value = target.metric;
      type = 'metrics';
    }
    (!custom[key]) && (custom[key] = {});
    custom[key][type] = _.union(custom[key][type], [value]);
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
    }
    $('[type="checkbox"]').prop({checked: false});
    $('[disabled="disabled"]').prop({checked: true});
  }

  addQuery(event, metric, host, otherMetric?) {
    if (host === custom_metric && this.groupType === 'hosts') {
      host = otherMetric;
    }
    if (this.checkSource(this.prox + metric, host)) {
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
          "downsampleInterval": this.panel.downsample,
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
        this.refresh();
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
    if (diff > this.limitTime) {
      this.$scope.appEvent('alert-warning', ['您仅可以关联' + this.limitTime + '天以内的数据', '请选择' + this.limitTime + '天以内的时间区间']);
      return;
    }
    diff = moment(end * 1000).diff(from, 'minutes');
    if (diff < 20) {
      this.$scope.appEvent('alert-warning', ['最小关联时间为20分钟', '请选择大于20分钟的时间区间']);
      return;
    }
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_confirm,
      text: this.$translate.i18n.page_association_info4,
      yesText: this.$translate.i18n.i18n_confirm,
      noText: this.$translate.i18n.i18n_cancel,
      onConfirm: () => {
        this.timeRange.from = start;
        this.timeRange.to = end;
        this.periods.push({
          o1: start,
          o2: end
        });
        this.init();
      }
    })
  }

  updateTimeRange(period) {
    this.timeRange.from = period.o1;
    this.timeRange.to = period.o2;
    this.timeSrv.setTime({from: moment(this.timeRange.from * 1000), to: moment(this.timeRange.to * 1000)}, false);
  }

  refresh() {
    this.$rootScope.$broadcast('refresh', this.panel.id)
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
