/**
     * @desc list 从贴 api
type_id = 1 -> 团队内 (type_id暂时均填0); 根据 main_post_id 获取主贴的从贴list
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
  /** main_post_id */
  main_post_id;
}

export const method = 'GET';

export function request(params, body, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/post/list/{main_post_id}', params, 'GET'),
    {
      method: 'GET',

      body,
      ...options,
    },
  );
}
