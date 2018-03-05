import _ from 'lodash';
import { types, getEnv } from 'mobx-state-tree';
import config from 'app/core/config';

export const OrgStore = types
  .model({
    orgs: types.optional(types.array(types.frozen), []),
  })
  .actions(self => ({
    load: (function* load() {
      const backendSrv = getEnv(self).backendSrv;
      const contextSrv = getEnv(self).contextSrv;
      backendSrv.get('/api/user/orgs').then(orgs => {
        self.orgs.push({
          label: contextSrv.user.orgName,
            value: contextSrv.user.orgId,
            children: [
              {
                label: contextSrv.systemsMap[_.findIndex(contextSrv.systemsMap, {'Id': contextSrv.user.systemId})].SystemsName,
                value: contextSrv.systemsMap[_.findIndex(contextSrv.systemsMap, {'Id': contextSrv.user.systemId})].SystemsName,
              }
            ]
        });
        orgs.forEach(org => {
          if (org.orgId !== contextSrv.user.orgId) {
            self.orgs.push({
              label: org.name,
              value: org.orgId,
              children: []
            });
          }
        });
      });
    }),
    switchOrg(orgId) {
      const backendSrv = getEnv(self).backendSrv;
      const contextSrv = getEnv(self).contextSrv;
      backendSrv.post('/api/user/using/' + orgId).then(() => {
        contextSrv.sidemenu = false;
        window.location.href = config.appSubUrl + '/systems';
      });
    }
  }))
