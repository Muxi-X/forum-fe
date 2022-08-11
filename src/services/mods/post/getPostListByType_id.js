/**
     * @desc list post api
获取帖子 (type_id = 1 -> 团队内(type_id暂时均填0))
     */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {
  /** limit */
  limit;
  /** page */
  page;
  /** last_id */
  last_id;
  /** type_id */
  type_id;
}

export const method = 'GET';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/post/list/{type_id}', params, 'GET'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/post/list/{type_id}', params, 'GET'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/post/list/{type_id}', params, swrOptions);
}

export function request(params, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/post/list/{type_id}', params, 'GET'),
    {
      method: 'GET',

      ...options,
    },
  );
}
