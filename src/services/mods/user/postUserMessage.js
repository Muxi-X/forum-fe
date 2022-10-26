/**
 * @desc 创建 公共 message api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'POST';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/message', params, 'POST'), {
    method: 'POST',

    body,
    ...options,
  });
}
