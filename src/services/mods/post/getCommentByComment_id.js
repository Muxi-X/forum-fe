/**
 * @desc 获取评论 api
 */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {
  /** comment_id */
  comment_id;
}

export const method = 'GET';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/comment/{comment_id}', params, 'GET'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/comment/{comment_id}', params, 'GET'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/comment/{comment_id}', params, swrOptions);
}

export function request(params, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/comment/{comment_id}', params, 'GET'),
    {
      method: 'GET',

      ...options,
    },
  );
}
