/**
 * @desc 获取该用户的聊天记录
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** limit */
  limit;
  /** page */
  page;
  /** id */
  id;
}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/chat/history/{id}', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
