/**
     * @desc WebSocket
建立 WebSocket 连接
     */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {
  /** uuid */
  id;
}

export const method = 'GET';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/chat/ws', params, 'GET'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/chat/ws', params, 'GET'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/chat/ws', params, swrOptions);
}

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/chat/ws', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
