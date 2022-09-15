/**
 * @desc 收藏帖子 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'POST';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/collection', params, 'POST'), {
    method: 'POST',

    body,
    ...options,
  });
}
