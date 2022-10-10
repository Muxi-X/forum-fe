/**
 * @desc 获取七牛云token
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post/qiniu_token', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
