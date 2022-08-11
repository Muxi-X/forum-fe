/**
     * @desc login api
login the student-forum
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
    Hooks.getUrlKey('/auth/login/student', params, 'POST'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/auth/login/student', params, 'POST'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  console.log(params)
  return Hooks.useRequest('/auth/login/student', params, swrOptions, {
    method: 'POST',
  });
}

export function request(params, body, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/auth/login/student', params, 'POST'),
    {
      method: 'POST',

      body,
      ...options,
    },
  );
}
