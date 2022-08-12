/**
     * @desc 创建帖子 api
(type_id = 1 -> 团队内(type_id暂时不用管))
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'POST';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post', params, 'POST'), {
    method: 'POST',

    body,
    ...options,
  });
}
