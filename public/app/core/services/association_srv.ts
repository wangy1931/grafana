///<reference path="../../headers/common.d.ts" />
import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class AssociationSrv {
  sourceAssociation: any;

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

}

coreModule.service('associationSrv', AssociationSrv);
