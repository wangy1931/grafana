import { types } from 'mobx-state-tree';

export const Process = types.model('Process', {
  pid: types.identifier(types.number),
  user: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  command: types.optional(types.string, ''),
  memPercent: types.optional(types.number, 0),
  cpuPercent: types.optional(types.number, 0),
  disk_io_write: types.optional(types.number, 0),
  disk_io_read: types.optional(types.number, 0),
  diskIoRead: types.optional(types.number, 0),
  diskIoWrite: types.optional(types.number, 0),
});
