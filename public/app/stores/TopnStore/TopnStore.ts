import _ from 'lodash';
import { types, getEnv, flow } from 'mobx-state-tree';
import { Process } from './Process';

export const TopnStore = types
  .model('TopnStore', {
    topn: types.optional(types.array(Process), []),
    orderby: types.optional(types.string, ''),
  })
  .views(self => ({
    get highTopn() {
      return _.take(_.orderBy(self.topn, [self.orderby], ['desc']), 5);
    },
    get orderedTopn() {
      return _.orderBy(self.topn, [self.orderby], ['desc']);
    }
  }))
  .actions(self => ({
    load: flow(function* load({ hostname, from, to }) {
      const hostSrv = getEnv(self).hostSrv;
      const res = yield hostSrv.getProcess({ hostname: hostname, from: from, to: to });
      self.topn.clear();

      // for (let item of topn) {
      //   self.topn.push(Process.create(item));
      // }

      self.topn = res.data;
    }),
    setOrderBy(orderby: string) {
      self.orderby = orderby;
    },
  }));
