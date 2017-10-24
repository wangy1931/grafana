import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import { coreModule } from  'app/core/core';
import kbn from 'app/core/utils/kbn';

declare var window: any;

export class TopNCtrl {
  dashboard: any;
  tableParams: any;

  /** @ngInject */
  constructor(private backendSrv, private hostSrv, private $location, private $scope, private $rootScope, private NgTableParams) {
  }

  init() {
    this.getDashboard();
    this.getProcess();
  }

  getDashboard() {
    this.backendSrv.get('/api/static/topn').then(response => {
      // store & init dashboard
      this.dashboard = response;
      this.$scope.initDashboard({
        dashboard: response,
        meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
      }, this.$scope);
    });
  }

  getProcess() {
    this.backendSrv.getHosts({
      "queries": [],
      "hostProperties": ["id"]
    }).then(response => {
      var host = this.$location.search().host;
      var id = _.find(response.data, { hostname: host }).id;
      return id;
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

};

coreModule.controller('TopNCtrl', TopNCtrl);
