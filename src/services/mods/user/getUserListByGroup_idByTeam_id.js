/**
     * @desc get user_list api
通过 group 和 team 获取 user_list
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** limit */
  limit;
  /** page */
  page;
  /** last_id */
  last_id;
  /** group_id */
  group_id;
  /** team_id */
  team_id;
}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/user/list/{group_id}/{team_id}', params, 'GET'),
    {
      method: 'GET',

      ...options,
    },
  );
}
