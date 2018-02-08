 
import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class AssociationSrv {
  sourceAssociation: any;

  /** @ngInject */
  constructor(private alertMgrSrv) {}

  setSourceAssociation({ metric, host, min, max, start}) {
    this.sourceAssociation = {
      metric: metric,
      host: host,
      start: start,
      min: min,
      max: max
    }
  }

  updateRang(range) {
    this.sourceAssociation.min = range[0];
    this.sourceAssociation.max = range[1];
  }

}

coreModule.service('associationSrv', AssociationSrv);
