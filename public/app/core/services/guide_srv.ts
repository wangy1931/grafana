
import coreModule from 'app/core/core_module';

export class GuideSrv {

  /** @ngInject */
  constructor(private alertMgrSrv, private associationSrv) {}

}

coreModule.service('guideSrv', GuideSrv);
