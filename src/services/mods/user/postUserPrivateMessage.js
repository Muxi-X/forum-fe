/**
 * @desc 创建私信 api
 * 发送私信给指定用户
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'POST';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/private_message', params, 'POST'), {
    method: 'POST',

    body,
    ...options,
  });
}
