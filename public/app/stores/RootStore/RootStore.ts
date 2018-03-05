import { types } from 'mobx-state-tree';
import { ViewStore } from './../ViewStore/ViewStore';
import { RCA2Store } from './../RCA2Store/RCA2Store';
import { AlertingStore } from './../AlertStore/AlertingStore';
import { TopnStore } from './../TopnStore/TopnStore';
import { GraphStore } from './../PanelStore/GraphStore';
import { ContextStore } from './../ContextStore/ContextStore';

export const RootStore = types.model({
  view: types.optional(ViewStore, {
    path: '',
    query: {},
    routeParams: {},
  }),
  rca2: types.optional(RCA2Store, {}),
  alerting: types.optional(AlertingStore, {}),
  topn: types.optional(TopnStore, {}),
  graph: types.optional(GraphStore, {}),
  context: types.optional(ContextStore, {
    collapsed: false
  }),
});

type IRootStoreType = typeof RootStore.Type;
export interface IRootStore extends IRootStoreType {}
