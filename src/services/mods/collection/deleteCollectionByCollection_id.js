/**
 * @desc 取消收藏 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** collection_id */
  collection_id;
}

export const method = 'DELETE';

export function request(params, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/collection/{collection_id}', params, 'DELETE'),
    {
      method: 'DELETE',

      ...options,
    },
  );
}
