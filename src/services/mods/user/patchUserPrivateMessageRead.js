/**
 * @desc 标记 private message 已读
 */

import { PontCore } from '../../pontCore';

export class Params {
  /** message_id */
  id
}

export const method = 'PATCH';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/private_message/read', params, 'PATCH'), {
    method: 'PATCH',

    ...options,
  });
}
