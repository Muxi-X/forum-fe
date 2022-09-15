/**
 * @desc list 我发布的帖子 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post/my/list', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
