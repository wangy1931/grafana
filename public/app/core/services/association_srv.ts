///<reference path="../../headers/common.d.ts" />
import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class AssociationSrv {
  sourceAssociation: any;
  correlationMetrics: any;

  /** @ngInject */
  constructor(private alertMgrSrv) {}

  setSourceAssociation(metric, host, distance) {
    this.sourceAssociation = {
      metric: metric,
      host: host,
      distance: distance
    }
  }

  updateDistance(distance) {
    this.sourceAssociation.distance = distance;
  }

  setCorrelationMetrics() {
    return this.alertMgrSrv.loadAssociatedMetrics(this.sourceAssociation.metric, this.sourceAssociation.host, this.sourceAssociation.distance, true).then((response) => {
      this.correlationMetrics = _.mapKeys(response.data, (service, key) => {
        return key + '(' + this.countService(service, 0 ) + ')';
      });
      return this.correlationMetrics;
    });
  }

  countService(obj, num) {
    for (var i in obj) {
      (obj[i].hosts) ? num++ : (num = this.countService(obj[i], num));
    }
    return num;
  }
}

coreModule.service('associationSrv', AssociationSrv);
