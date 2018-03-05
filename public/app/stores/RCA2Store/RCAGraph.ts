import { types, getEnv, flow } from 'mobx-state-tree';

export const node = types.model('nodes', {
  name: types.string,
  id: types.union(types.string, types.number),
  icon: types.string,
  type: types.union(types.string, types.null),
  left: types.number,
  top: types.number,
  healthType: types.string
});

export const edge = types.model('edges', {
  source: types.union(types.string, types.number),
  target: types.union(types.string, types.number),
  // data: {
  //   id: types.union(types.string, types.number),
  //   type: types.string
  // }
});

export const port = types.model('port', {});

export const group = types.model('group', {});

export const RCAGraph = types.model('RCAGraph', {
  nodes: types.array(node),
  edges: types.array(edge),
  ports: types.array(port),
  groups: types.array(group)
});
