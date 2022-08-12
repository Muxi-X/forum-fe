/**
 * @desc 删除帖子 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** post_id */
  post_id;
}

export const method = 'DELETE';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post/{post_id}', params, 'DELETE'), {
    method: 'DELETE',

    ...options,
  });
}
