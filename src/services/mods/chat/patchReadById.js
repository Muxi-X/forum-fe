/**
 * @desc 标记与某用户的私信为已读
 */

import { PontCore } from '../../pontCore';

export class Params {
  /** id */
  id;
}

export const method = 'PATCH';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/chat/read/{id}', params, 'PATCH'), {
    method: 'PATCH',

    ...options,
  });
}
