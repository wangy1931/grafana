import angular from 'angular';
import { coreModule } from 'app/core/core';
import 'app/plugins/datasource/opentsdb/queryCtrl';

export class SnoozeCtrl {

  snoozeMin: any;
  moreMinutes: any;

  /** @ngInject */
  constructor (
    private $scope,
    private backendSrv, private alertSrv
  ) {
    this.snoozeMin = "120";
    this.moreMinutes = {
      "10": "10分钟",
      "30": "半小时",
      "60": "一小时",
      "120": "两小时",
      "360": "六小时",
      "720": "半天"
    };
  }

  snooze() {
    var relativeMin = (new Date().getTime() - this.$scope.alertDetails.status.levelChangedTime)/60000;
    this.$scope.alertDetails.status.snoozeMinutes = relativeMin + parseInt(this.snoozeMin);

    this.backendSrv.alertD({
      method: "post",
      url: "/alert/status/snooze",
      params: {
        "id": this.$scope.alertDetails.status.alertId,
        "host": this.$scope.alertDetails.status.monitoredEntity,
        "moreMinutes": this.snoozeMin
      }
    }).then(() => {
      this.alertSrv.set("删除成功", "", "success", 1000);
    }, err => {
      this.alertSrv.set("error", err.status + " " + (err.data || "Request failed"), err.severity, 10000);
    });
    this.$scope.dismiss();
  }

}

coreModule.controller('SnoozeCtrl', SnoozeCtrl);
