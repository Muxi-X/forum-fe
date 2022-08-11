/**
     * @desc get user_profile api
通过 userId 获取完整 user 信息
     */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {
  /** user_id */
  id;
}

export const method = 'GET';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/user/profile/{id}', params, 'GET'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/user/profile/{id}', params, 'GET'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/user/profile/{id}', params, swrOptions);
}

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/profile/{id}', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
