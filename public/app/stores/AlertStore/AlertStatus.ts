import { types, getEnv, flow } from 'mobx-state-tree';

export const AlertStatus = types.model('AlertStatus', {
  // alertEntity: types.enumeration,
  alertId: types.string,
  creationTime: types.number,
  level: types.string,
  levelChangedTime: types.number,
  monitoredEntity: types.string,
  rowKey: types.string,
  snoozeMinutes: types.number,
  triggeredValue: types.number
});
