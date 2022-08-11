/**
     * @desc update info api
修改用户个人信息
     */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'PUT';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/user', params, 'PUT'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(Hooks.getUrlKey('/user', params, 'PUT'), shouldRevalidate);
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/user', params, swrOptions, { method: 'PUT' });
}

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user', params, 'PUT'), {
    method: 'PUT',

    body,
    ...options,
  });
}
