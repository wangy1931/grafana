 

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from 'app/core/core_module';
import 'd3.graph';

declare var window: any;

var template = `
  <div class="search" ng-show="ctrl.search">
    <form class="gf-form-group tidy-form">
      <div>
          <div class="gf-form">
              <ul class="gf-form-list tidy-form-list" style="text-align:right; overflow: inherit; width: 100%;">
                  <li class="tidy-form-item">
                      <em translate="i18n_search"></em>{{ ctrl.types[ctrl.type] }}
                  </li>
                  <li class="tidy-form-item tidy-form-item-dropdown">
                      <input type="text" class="input-xlarge tidy-form-input last"
                            ng-model='ctrl.query'
                            spellcheck='false'
                            bs-typeahead-old="ctrl.searchList"
                            placeholder="{{ ctrl.$translate.i18n.page_topology_search_input }}"
                            ng-enter="ctrl.searchItem()"
                            ng-blur="ctrl.searchItem()" />
                  </li>
                  <li class="tidy-form-item" ng-hide="ctrl.type === 'service'">
                      <em translate="page_topology_group_tag"></em>
                  </li>
                  <li class="tidy-form-item" ng-hide="ctrl.type === 'service'">
                      <button type="button" class="kpi-btn btn btn-default" ng-model="ctrl.group" data-placement="bottom-auto"
                              bs-options="f.value as f.text for f in ctrl.groupOptions" bs-select ng-change="ctrl.getGraph();" placeholder="{{ ctrl.$translate.i18n.i18n_select_choose }}">
                          <span class="caret"></span>
                      </button>
                  </li>
                  <li class="tidy-form-item" translate="page_host_kpi_stat"></li>
                  <li class="tidy-form-item">
                      <button type="button" class="kpi-btn btn btn-default" ng-model="ctrl.filter" data-placement="bottom-auto"
                              bs-options="f.value as f.text for f in ctrl.filterOptions" bs-select ng-change="ctrl.filterBy();" placeholder="{{ ctrl.$translate.i18n.i18n_select_choose }}">
                          <span class="caret"></span>
                      </button>
                  </li>
                  <li class="tidy-form-item pull-right" ng-hide="ctrl.hideClear">
                      <button class="btn btn-primary" style="padding: 0.4rem 1rem;" ng-click="ctrl.clearSelected();"><em translate="page_topology_clear_select"></em>{{ ctrl.types[ctrl.type] }}</button>
                  </li>
              </ul>
              <div class="clearfix"></div>
          </div>
      </div>
    </form>
  </div>

  <div class="heatmap">
    <div id="heatmap"></div>
    <div class="clearfix"></div>
  </div>
`;

export class TopologyGraphCtrl {
  rendered: boolean;
  heatmap: any;
  data: any;
  currentItem: any;
  searchList: any;
  search: boolean = true;
  query: string;
  group: string;
  filter: string;
  groupOptions: any;
  filterOptions: any;
  hideClear: any;
  types: any;

  /** @ngInject */
  constructor(
    private $scope,
    private $location,
    private $timeout,
    private backendSrv,
    private contextSrv,
    private $rootScope,
    private hostSrv,
    private serviceDepSrv,
    private alertSrv,
    private $translate
  ) {
    this.groupOptions = [{ 'text': $translate.i18n.i18n_empty, 'value': '' }];
    this.filterOptions = [
      { 'text': $translate.i18n.i18n_all, 'value': '' },
      { 'text': $translate.i18n.i18n_normal, 'value': 'GREEN' },
      { 'text': $translate.i18n.i18n_warning, 'value': 'YELLOW' },
      { 'text': $translate.i18n.i18n_critical, 'value': 'RED' },
      { 'text': $translate.i18n.i18n_breakdown, 'value': 'GREY' }
    ];
    this.heatmap = window.d3.select('#heatmap');

    this.types = {
      'host': $translate.i18n.i18n_host,
      'service': $translate.i18n.i18n_service
    };
    !this.$scope.ctrl.type && (this.$scope.ctrl.type = 'host');

    this.hideClear = (this.$location.path() === '/');

    this.getGraph();
    this.getAllTagsKey();

    this.$scope.$on('topology-update', this.updateTopology.bind(this));
  }

  getGraph() {
    var params = {};
    this.group && (params['groupby'] = this.group);

    // reset data empty
    this.data = [];

    // default: type === 'host'
    var type = this.$scope.ctrl.type;
    if (type === 'service') {
      this.serviceDepSrv.getServiceTopologyData().then(this.renderGraph.bind(this));
    } else {
      this.hostSrv.getHostTopologyData(params).then(this.renderGraph.bind(this));
    }
  }

  renderGraph(response) {
    this.searchList = _.map(response, 'name');
    this.searchList = _.uniq(this.searchList);
    this.data = response;

    !this.rendered && (this.heatmap = window.d3.select('#heatmap').relationshipGraph(this.$scope.ctrl.params));

    this.rendered = true;
    this.heatmap.data(this.data);

    // 有 query 机器查询时, 先做groupby 再filter
    if (this.query && this.query !== '*') {
      this.searchItem();
    }

    this.$scope.$emit('topology-loaded', this.data);
  }

  openSearch() {
    this.search = true;
  }

  closeSearch() {
    this.search = false;
  }

  clearSelected() {
    this.query = '';
    this.currentItem = {};
    this.heatmap.data(this.data);
  }

  searchItem(event?) {
    if (this.query === '' || this.query === '*') {
      this.clearSelected();
    } else if (!~this.searchList.indexOf(this.query)) {
      this.alertSrv.set(this.$translate.i18n.page_topology_search_invalid, '', "warning", 2000);
    } else {
      var searchResult = this.heatmap.search({ name: this.query });
      searchResult = !_.isEmpty(searchResult) ? searchResult : _.filter(this.data, { name: this.query });

      this.heatmap.data(searchResult);
      this.currentItem = searchResult[0];
    }
  }

  getAllTagsKey() {
    // init, get all tags key for group-options
    this.hostSrv.getAllTagsKey().then(response => {
      response.data && response.data.forEach((item, index) => {
        response.data[index] = { 'text': item, 'value': item }
      });
      this.groupOptions = [this.groupOptions[0]].concat(response.data);
    });
  }

  filterBy() {
    // 有 query 机器查询时, filterby 没有意义
    if (this.query && this.query !== '*') { return; }

    var filteredData = this.filter.toLowerCase() ? _.filter(this.data, { value: this.filter.toLowerCase() }) : this.data;
    this.heatmap.data(filteredData);
  }

  updateTopology(evt, payload) {
    this.data = payload || this.data;
    this.clearSelected();
  }

}

export function topologyGraphDirective() {
  return {
    restrict: 'E',
    template: template,
    controller: TopologyGraphCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      type: "@",
      params: "=",
      currentItem: "="
    },
    link: function(scope, elem) {
    }
  };
}

coreModule.directive('topologyGraph', topologyGraphDirective);
