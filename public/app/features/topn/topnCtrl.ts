import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import { coreModule } from  'app/core/core';
import kbn from 'app/core/utils/kbn';

declare var window: any;

export class TopNCtrl {
  dashboard: any;
  tableParams: any;
  hostlist: Array<any>;
  host: any;

  /** @ngInject */
  constructor(
    private backendSrv,
    private hostSrv,
    private $location,
    private $scope,
    private $rootScope,
    private NgTableParams,
    private templateValuesSrv,
    private dynamicDashboardSrv
  ) {}

  init() {
    this.getProcess();
    this.getDashboard();
  }

  getProcess() {
    this.backendSrv.getHosts({
      "queries": [],
      "hostProperties": ["id"]
    }).then(response => {
      this.hostlist = response.data;

      var host = this.$location.search().host;
      this.host = _.find(response.data, { hostname: host });
      return this.host.id;
    }).then(id => {
      id && this.hostSrv.getHostProcess(id).then(response => {
        response.data && response.data.forEach(item => {
          item.diskIoRead = kbn.valueFormats.Bps(item.diskIoRead);
          item.diskIoWrite = kbn.valueFormats.Bps(item.diskIoWrite);
        });
        this.$scope.bsTableData = response.data;
        this.$scope.$broadcast('load-table');
        // this.tableParams = new this.NgTableParams({ count: 10 }, {
        //   counts: [],
        //   dataset: response.data
        // });
      });
    });
  }

  getDashboard() {
    this.backendSrv.get('/api/static/topn').then(response => {
      // store & init dashboard
      this.dashboard = response;

      var hostname = this.$location.search().host;
      this.dashboard.templating.list[0].current = { "text": hostname || "All", "value": hostname || "$__all", "tags": [] };
      this.dashboard.templating.list[0].query = hostname;

      this.$scope.initDashboard({
        dashboard: this.dashboard,
        meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
      }, this.$scope);
    });
  }

};

coreModule.controller('TopNCtrl', TopNCtrl);
