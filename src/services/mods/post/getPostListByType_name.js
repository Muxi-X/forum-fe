/**
     * @desc list 主帖 api
type_name : normal -> 团队外; muxi -> 团队内 (type_name暂时均填normal); 根据category获取主帖list
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** limit */
  limit;
  /** page */
  page;
  /** last_id */
  last_id;
  /** type_name */
  type_name;
  /** category */
  category;
}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/post/list/{type_name}', params, 'GET'),
    {
      method: 'GET',

      ...options,
    },
  );
}
