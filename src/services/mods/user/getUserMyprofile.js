/**
     * @desc get my_profile api
获取 my 完整 user 信息
     */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/user/myprofile', params, 'GET'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/user/myprofile', params, 'GET'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/user/myprofile', params, swrOptions);
}

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/myprofile', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
