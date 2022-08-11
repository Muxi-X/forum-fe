/**
 * @desc 删除帖子 api
 */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {
  /** post_id */
  post_id;
}

export const method = 'DELETE';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/post/{post_id}', params, 'DELETE'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/post/{post_id}', params, 'DELETE'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/post/{post_id}', params, swrOptions, {
    method: 'DELETE',
  });
}

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/post/{post_id}', params, 'DELETE'), {
    method: 'DELETE',

    ...options,
  });
}
