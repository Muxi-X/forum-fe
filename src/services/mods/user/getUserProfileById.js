/**
     * @desc get user_profile api
通过 userId 获取完整 user 信息
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** user_id */
  id;
}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/profile/{id}', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
