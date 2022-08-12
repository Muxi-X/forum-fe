/**
     * @desc 获取该用户的uuid
该用户发送信息前先获取自己的uuid，并放入query(id=?)，有效期24h
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
    Hooks.getUrlKey('/chat', params, 'GET'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(Hooks.getUrlKey('/chat', params, 'GET'), shouldRevalidate);
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest('/chat', params, swrOptions);
}

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/chat', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
