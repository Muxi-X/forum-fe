/**
     * @desc get my_profile api
获取 my 完整 user 信息
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/myprofile', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
