import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import { coreModule } from  'app/core/core';
import kbn from 'app/core/utils/kbn';

declare var window: any;

export class TopNCtrl {
  dashboard: any;

  /** @ngInject */
  constructor(private backendSrv, private hostSrv, private $location, private $scope, private $rootScope) {
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
    var id = this.$location.search().id;
    this.hostSrv.getHostProcess(id).then(response => {
      response.data && response.data.forEach(item => {
        item.diskIoRead = kbn.valueFormats.Bps(item.diskIoRead);
        item.diskIoWrite = kbn.valueFormats.Bps(item.diskIoWrite);
      });
      this.$scope.bsTableData = response.data;
      this.$scope.$broadcast('load-table');
    });
  }

};

coreModule.controller('TopNCtrl', TopNCtrl);
