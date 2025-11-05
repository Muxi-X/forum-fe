/**
 * @desc 获取私信列表 api
 * 获取用户的私信列表
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/private_message/list', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
