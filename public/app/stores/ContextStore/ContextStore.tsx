import { types, getEnv } from 'mobx-state-tree';

export const ContextStore = types
  .model({
    collapsed: types.boolean,
    user: types.optional(types.frozen, {}),
    systemsMap: types.optional(types.frozen, {})
  })
  .actions(self => ({
    // toggleSideMenu(collapsed) {
    //   const contextSrv = getEnv(self).contextSrv;
    //   // contextSrv.toggleSideMenu();
    //   self.collapsed = collapsed;
    //   // self.collapsed = contextSrv.pinned;
    //   self.user = contextSrv.user;
    //   self.systemsMap = contextSrv.systemsMap;
    // }
  }))
