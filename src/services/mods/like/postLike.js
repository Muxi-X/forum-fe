/**
 * @desc 点赞/取消点赞 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'POST';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/like', params, 'POST'), {
    method: 'POST',

    body,
    ...options,
  });
}
