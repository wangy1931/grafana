import { RootStore, IRootStore } from './RootStore/RootStore';
import config from 'app/core/config';

export let store: IRootStore;

export function createStore(contextSrv, backendSrv, hostSrv, datasourceSrv) {
  store = RootStore.create(
    {},
    {
      contextSrv,
      backendSrv: backendSrv,
      hostSrv: hostSrv,
      datasourceSrv: datasourceSrv,
      navTree: config.bootData.navTree,
    }
  );

  return store;
}
