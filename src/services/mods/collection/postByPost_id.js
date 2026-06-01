/**
 * @desc 收藏/取消收藏帖子 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** post_id */
  post_id;
}

export const method = 'POST';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/collection', {}, 'POST'), {
    method: 'POST',
    body: {
      target_id: params.post_id,
      target_type: 1,
    },
    ...options,
  });
}
