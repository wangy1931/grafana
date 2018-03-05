import _ from 'lodash';
import { types, getEnv, flow } from 'mobx-state-tree';

export const DataPoint = types.model('DataPoint', {
  x: types.union(types.number, types.string, types.undefined),
  y: types.union(types.number, types.string, types.undefined),
});

export const Data = types.model('Data', {
});

export const GraphStore = types
  .model('GraphStore', {
    targets: types.maybe(types.map(types.frozen)),
    dps: types.optional(types.array(DataPoint), [{ x: 0 }]),
    loading: types.optional(types.boolean, true),
    error: types.optional(types.string, ''),
    data: types.maybe(types.array(types.map(types.frozen))),
  })
  .actions(self => ({
    issueQueries: flow(function* issueQueries(metricsQuery) {
      const datasourceSrv = getEnv(self).datasourceSrv;
      const opentsdb = yield datasourceSrv.get('opentsdb');
      const response = yield opentsdb.query(metricsQuery);
      self.dps.clear();
      let targets: any = {};
      let dps: any = [];

      self.loading = false;
      _.each(response.data, data => {
        _.each(data.datapoints, dps => {
          _.reverse(dps);
        });
      });
      self.data = response.data;

      // data format
      // { x: @timestamp, y1: value, y2: value }
      for (let item of response.data) {
        // self.targets.set('y', item.target);
        targets['y'] = item.target;
        for (let dp of item.datapoints) {
          dps.push({ x: dp[1], y: dp[0] });
        }
      }
      self.targets = targets;
      self.dps = dps;
    })
  }));
