/**
 * @desc 创建评论 api
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
    Hooks.getUrlKey('/comment', params, 'POST'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/comment', params, 'POST'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/comment', params, swrOptions, { method: 'POST' });
}

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/comment', params, 'POST'), {
    method: 'POST',

    body,
    ...options,
  });
}
