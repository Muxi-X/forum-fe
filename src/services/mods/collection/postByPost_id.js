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
  return PontCore.fetch(
    PontCore.getUrl('/collection/{post_id}', params, 'POST'),
    {
      method: 'POST',

      ...options,
    },
  );
}
