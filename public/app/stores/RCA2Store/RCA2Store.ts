import _ from 'lodash';
import moment from 'moment';
import { types, getEnv, flow } from 'mobx-state-tree';
import { toJS } from 'mobx';
import { RCAGraph } from './RCAGraph';

export const Event = types.model('Event', {
  hostname: types.optional(types.string, ''),
  pid: types.identifier(types.number),
  service: types.optional(types.string, ''),
  time: types.optional(types.string, ''),
  timestamp: types.optional(types.Date, (new Date).getTime()),
  type: types.optional(types.string, '')
});

export const RCA2Store = types
  .model('RCA2Store', {
    symptomMetric: types.optional(types.string, ''),
    symptomHost: types.optional(types.string, ''),
    symptomService: types.optional(types.string, ''),
    rcaGraph: types.maybe(RCAGraph),
    middleCauseSvcs: types.frozen,
    rootCauseSvcs: types.frozen,
    affectedSvcs: types.frozen,
    RCs: types.optional(types.array(types.frozen), []),
    ICs: types.optional(types.array(types.frozen), []),
    rootCauseSvcsText: types.optional(types.string, '...'),
    affectedSvcsText: types.optional(types.string, '...'),
    events: types.optional(types.array(Event), []),
    suggested: types.optional(types.array(types.frozen), [])
  })
  .views(self => ({
    get annotations() {
      let list = [];
      self.events.forEach((item, index) => {
        list.push({
          id: index + 100,
          min: moment(item.time).valueOf(),
          max: moment(item.time).valueOf(),
          title: item.service,
          text: item.type,
          eventType: "event",
        });
      });
      return list;
    }
  }))
  .actions(self => ({
    load: flow(function* load({ metric, host }) {
      const backendSrv = getEnv(self).backendSrv;
      const contextSrv = getEnv(self).contextSrv;
      const prefix = contextSrv.user.orgId + "." + contextSrv.user.systemId + "."
      const response = yield backendSrv.alertD({
        method: "get",
        url: "/rca/alert",
        params: {
          metric: prefix + metric,
          host: host
        }
      });

      response.data.graph && response.data.graph.nodes.forEach(item => {
        item.healthType = item.healthType.toLowerCase();
      });

      // [suggestedRC ordered by sigVal].concat([ICs ordered by sigVal ])
      function handleRCANode(item) {
        item.name = _.getMetricName(item.name);
        switch (item.type) {
          case 1: item.nodeType = '指标'; break;
          case 2: item.nodeType = '日志'; break;
          default: item.nodeType = '其他'; break;
        }
      }
      response.data.ICs && _.orderBy(response.data.ICs, ['sigVal'], ['desc']);
      response.data.RCs && _.orderBy(response.data.RCs, ['sigVal'], ['desc']);

      response.data.ICs && response.data.ICs.forEach(handleRCANode);
      response.data.RCs && response.data.RCs.forEach(handleRCANode);
      self.suggested = response.data.RCs.concat(response.data.ICs);

      self.symptomMetric = response.data.symptomMetric;
      self.symptomHost = response.data.symptomHost;
      self.symptomService = response.data.symptomService;
      self.rcaGraph = response.data.graph;
      self.middleCauseSvcs = response.data.middleCauseSvcs;
      self.rootCauseSvcs = response.data.rootCauseSvcs;
      self.affectedSvcs = response.data.affectedSvcs;
      self.RCs = response.data.RCs;
      self.ICs = response.data.ICs;

      const rootCauseSvcs = Object.keys(response.data.rootCauseSvcs || {});
      const affectedSvcs = Object.keys(response.data.affectedSvcs || {});
      self.rootCauseSvcsText = rootCauseSvcs.length < 1 ? self.suggested[0].name : (rootCauseSvcs.length > 1 ? `${rootCauseSvcs[0]}等${rootCauseSvcs.length}个` : rootCauseSvcs[0]);
      self.affectedSvcsText = affectedSvcs.length < 1 ? '无' : (affectedSvcs.length > 1 ? `${affectedSvcs[0]}等${affectedSvcs.length}个` : affectedSvcs[0]);
    }),
    loadEvents: flow(function* getEvents({ hostname, range }) {
      const backendSrv = getEnv(self).backendSrv;
      const response = yield backendSrv.alertD({
        method: 'GET',
        url   : '/service/events',
        params: range
      });
      self.events.clear();

      response.data.forEach((item) => {
        item.type = (item.type === 'Start') ? '启动' : '停止';
        item.time = _.transformTime(item.timestamp);
        item.hostname === hostname && self.events.push(Event.create(item));
      });
    })
  }));
