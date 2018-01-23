import angular from 'angular';
import _ from 'lodash';
import { coreModule } from 'app/core/core';
import 'app/plugins/datasource/opentsdb/queryCtrl';

export class CloseAlertCtrl {

  reason: any;

  /** @ngInject */
  constructor (
    private $scope,
    private alertMgrSrv, private contextSrv
  ) {
  }

  close() {
    var status = this.$scope.alertData.status;

    if (this.reason) {
      this.alertMgrSrv.closeAlert(status.alertId, status.monitoredEntity, this.reason, this.contextSrv.user.name)
        .then(response => {
          _.remove(this.$scope.alertRows, alertDetail => {
            return (alertDetail.definition.id === status.alertId) &&  (alertDetail.status.monitoredEntity === status.monitoredEntity);
          });
         this.$scope.appEvent('alert-success', ['报警处理成功']);
        }).catch(err => {
          this.$scope.appEvent('alert-error', ['报警处理失败','请检查网络连接状态']);
        });
    }

    this.$scope.dismiss();
  }

}

coreModule.controller('CloseAlertCtrl', CloseAlertCtrl);
