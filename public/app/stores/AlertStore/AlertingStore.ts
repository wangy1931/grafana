import _ from 'lodash';
import { types, getEnv, flow } from 'mobx-state-tree';
import { AlertStatus } from './AlertStatus';
import { AlertDefinition } from './AlertDefinition';

const TimeValueType = types.union(types.string, types.boolean, types.number);

export const AlertDetail = types.model('AlertDetail', {
  id: types.optional(types.string, ''),
  rowKey: types.optional(types.string, ''),
  metric: types.optional(types.string, ''),
  description: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  alertId: types.optional(types.string, ''),
  level: types.optional(types.string, ''),
  levelType: types.optional(types.string, ''),
  alertTime: types.optional(TimeValueType, 0),
  levelChangedTime: types.optional(TimeValueType, 0),
  levelWillChangeTime: types.optional(TimeValueType, 0),
  monitoredEntity: types.optional(types.string, ''),
  snoozeMinutes: types.optional(types.number, 0),
  triggeredValue: types.optional(TimeValueType, 0),
  alertType: types.optional(types.string, ''),
  type: types.optional(types.string, ''),
  thresholds: types.optional(types.array(types.number), [0, 0]),
  expression: types.optional(types.string, ''),
  creationTime: types.optional(types.number, 0),
  org: types.optional(types.string, ''),
  service: types.optional(types.string, ''),
});

export const AlertingStore = types
  .model('AlertingStore', {
    alerts: types.optional(types.array(AlertDetail), []),
    rowKey: types.optional(types.string, ''),
    error: types.optional(types.string, ''),
  })
  .views(self => ({
    get detail() {
      return _.find(self.alerts, { rowKey: self.rowKey }) || {};
    }
  }))
  .actions(self => ({
    load: flow(function* load(rowKey) {
      const backendSrv = getEnv(self).backendSrv;
      const res = yield backendSrv.alertD({
        method: "get",
        url: "/alert/status",
        params: {}
      });
      self.alerts.clear();
      let alerts: any = [];

      // format single-alert & multi-alert & log-alert
      for (let alert of res.data) {
        var alertType = alert.definition.alertDetails.alertType
        if (alertType === 'LOG_ALERT') {
          var output = ''
          alert.definition.alertDetails.alertLogQuery.logQueries.forEach((query, i) => {
            if (i === 0) {
              output = `type: ${query.key} `
            } else {
              output += `${query.condition} ${query.keyType.toLowerCase()}: ${query.key} `
            }
          })
          alert.metric = output;
        } else {
          !alert.metric && (alert.metric = alert.definition.alertDetails[this.alertTypeMap[alert.type]].metricQueries[0].metric)
          alert.metric = _.getMetricName(alert.metric)
        }

        const alertDetail = AlertDetail.create({
          rowKey: alert.status.rowKey,
          metric: alert.metric,
          description: alert.definition.description,
          name: alert.definition.name,
          alertId: alert.status.alertId,
          level: alert.status.level,
          levelType: alert.status.level === 'CRITICAL' ? '告警' : (alert.status.level === 'WARNING' ? '严重' : '正常'),  // _.translateAlertLevel(alert.status.level),
          alertTime: alert.status.levelChangedTime,
          levelChangedTime: _.transformMillionTime(alert.status.levelChangedTime),
          levelWillChangeTime: _.timeFrom(alert.status.levelChangedTime, alert.status.snoozeMinutes, 'm'),
          monitoredEntity: alert.status.monitoredEntity,
          snoozeMinutes: alert.status.snoozeMinutes,
          triggeredValue: alert.status.triggeredValue.toFixed(2),
          alertType: _.alertTypeFormatter(alert.definition.alertDetails.alertType),
          type: alert.definition.alertDetails.alertType,
          thresholds: [+alert.definition.alertDetails.crit.threshold, +alert.definition.alertDetails.warn.threshold],
          expression: alertType === 'SINGLE_ALERT'
              ? (alert.definition.alertDetails.alertSingleQuery.expression)
              : (alertType === 'MUTI_ALERT' ? alert.definition.alertDetails.alertMutiQuery.expression.split(';')[0] : '')
        });
        self.alerts.push(alertDetail);
      }

      return self.alerts;
    }),
    setRowKey(rowKey: any) {
      self.rowKey = rowKey;
    }
  }));
