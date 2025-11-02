/**
 * @desc 删除private message api
 * 删除所有的非管理员信息
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** post_id */
  id
}

export const method = 'DELETE';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/private_message/{id}', params, 'DELETE'), {
    method: 'DELETE',

    ...options,
  });
}
