/**
     * @desc update post info api
修改帖子信息
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
    Hooks.getUrlKey('/post', params, 'PUT'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(Hooks.getUrlKey('/post', params, 'PUT'), shouldRevalidate);
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/post', params, swrOptions, { method: 'PUT' });
}

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post', params, 'PUT'), {
    method: 'PUT',

    body,
    ...options,
  });
}
