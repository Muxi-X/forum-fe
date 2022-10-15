/**
     * @desc list 主帖 api
根据category or tag 获取主帖list
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
  /** category */
  category;
  /** filter */
  filter;
  /** search_content */
  search_content;
  /** tag */
  tag;
  /** normal -> 团队外; muxi -> 团队内 */
  domain;
}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post/list/{domain}', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
