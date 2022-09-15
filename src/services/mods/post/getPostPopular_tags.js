/**
     * @desc list 热门tags api
降序
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post/popular_tags', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
