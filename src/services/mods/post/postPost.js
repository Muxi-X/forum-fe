/**
     * @desc 创建帖子 api
(type_id = 1 -> 团队内(type_id暂时不用管))
     */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'POST';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/post', params, 'POST'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/post', params, 'POST'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/post', params, swrOptions, { method: 'POST' });
}

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post', params, 'POST'), {
    method: 'POST',

    body,
    ...options,
  });
}
