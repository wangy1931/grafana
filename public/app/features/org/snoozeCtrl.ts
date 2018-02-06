import angular from 'angular';
import { coreModule } from 'app/core/core';
import 'app/plugins/datasource/opentsdb/queryCtrl';

export class SnoozeCtrl {

  snoozeMin: any;
  moreMinutes: any;

  /** @ngInject */
  constructor (
    private $scope, private $translate,
    private backendSrv, private alertSrv
  ) {
    this.snoozeMin = "120";
    this.moreMinutes = {
      "10": `10${$translate.i18n.i18n_minute}`,
      "30": `30${$translate.i18n.i18n_minute}`,
      "60": `1${$translate.i18n.i18n_hour}`,
      "120": `2${$translate.i18n.i18n_hour}`,
      "360": `6${$translate.i18n.i18n_hour}`,
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
      this.alertSrv.set(this.$translate.i18n.i18n_success, "", "success", 1000);
    }, err => {
      this.alertSrv.set("error", err.status + " " + (err.data || "Request failed"), err.severity, 10000);
    });
    this.$scope.dismiss();
  }

}

coreModule.controller('SnoozeCtrl', SnoozeCtrl);
