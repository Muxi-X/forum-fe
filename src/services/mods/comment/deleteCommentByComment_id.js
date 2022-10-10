/**
 * @desc 删除评论 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** comment_id */
  comment_id;
}

export const method = 'DELETE';

export function request(params, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/comment/{comment_id}', params, 'DELETE'),
    {
      method: 'DELETE',

      ...options,
    },
  );
}
