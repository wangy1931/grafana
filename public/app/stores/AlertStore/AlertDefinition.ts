import { types, getEnv, flow } from 'mobx-state-tree';

export const AlertDefinition = types.model('AlertDefinition', {
  // alertDetails: types.enumeration,
  // creationTime: types.enumeration,
  description: types.string,
  hash: types.number,
  id: types.string,
  // modificationTime: types.enumeration,
  name: types.string,
  org: types.string,
  service: types.string
});
