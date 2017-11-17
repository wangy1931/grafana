
import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
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

  /** @ngInject */
  constructor(private $scope, private associationSrv,
    private $rootScope, private $timeout,
    private $controller, private backendSrv,
    private contextSrv, private healthSrv,
    private alertMgrSrv
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
  }

  init(type?) {
    this.groupType = type || this.groupType;
    this.isOpen = true;
    this.isLoding = true;
    this.isAssociation = false;
    var association = this.associationSrv.sourceAssociation;
    this.clearSelected();
    if (!_.isEmpty(association)) {
      this.alertMgrSrv.loadAssociatedMetrics(association.metric, association.host, association.min, association.max, this.groupType)
      .then((response) => {
        if (this.groupType === 'metrics') {
          this.correlationMetrics = response.data || {};
        } else {
          this.correlationHosts = response.data || {};
        }
        if (!_.isEmpty(response.data)) {
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
    templateUrl: 'public/app/core/components/tree_menu/tree_menu.html',
    link: (scope, elem, attrs, ctrl) => {
      ctrl.panel = scope.$parent.panel;
    }
  };
}

coreModule.directive('cwTreeMenu', treeMenu);
