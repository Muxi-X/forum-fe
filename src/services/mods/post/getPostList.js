/**
     * @desc list 主贴 api
type_id = 1 -> 团队内 (type_id暂时均填0); 根据category获取主贴list
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
}

export const method = 'GET';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/post/list', params, 'GET'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/post/list', params, 'GET'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/post/list', params, swrOptions);
}

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post/list', params, 'GET'), {
    method: 'GET',

    body,
    ...options,
  });
}
