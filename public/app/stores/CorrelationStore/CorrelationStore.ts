import _ from 'lodash';
import { types, getEnv, flow } from 'mobx-state-tree';

export const CorrelationStore = types
  .model('CorrelationStore', {
    // panel: types.optional(types.array(Process), []),
    tree: types.optional(types.string, ''),
  })
  .views(self => ({
  }))
  .actions(self => ({
    load: flow(function* load({ hostname, from, to }) {
      // const hostSrv = getEnv(self).hostSrv;
      // const res = yield hostSrv.getProcess({ hostname: hostname, from: from, to: to });
      // self.topn.clear();

      // // for (let item of topn) {
      // //   self.topn.push(Process.create(item));
      // // }

      // self.topn = res.data;
    }),
    setOrderBy(orderby: string) {
      // self.orderby = orderby;
    },
  }));
