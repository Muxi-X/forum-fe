/**
 * @desc 获取用户点赞列表 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** user_id */
  user_id;
  /** limit */
  limit;
  /** page */
  page;
  /** last_id */
  last_id;
}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/like/list/{user_id}', params, 'GET'),
    {
      method: 'GET',

      ...options,
    },
  );
}
