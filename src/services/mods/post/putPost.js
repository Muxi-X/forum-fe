/**
 * @desc 修改帖子信息 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'PUT';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post', params, 'PUT'), {
    method: 'PUT',

    body,
    ...options,
  });
}
