/**
     * @desc get user_list api
通过 group 和 team 获取 user_list
     */

import * as SWR from 'swr';

import * as defs from '../../baseClass';
import * as Hooks from '../../hooks';
import { PontCore } from '../../pontCore';

export class Params {
  /** limit */
  limit;
  /** page */
  page;
  /** last_id */
  last_id;
  /** group_id */
  group_id;
  /** team_id */
  team_id;
}

export const method = 'GET';

export function mutate(
  params = {},
  newValue = undefined,
  shouldRevalidate = true,
) {
  return SWR.mutate(
    Hooks.getUrlKey('/user/list/{group_id}/{team_id}', params, 'GET'),
    newValue,
    shouldRevalidate,
  );
}

export function trigger(params = {}, shouldRevalidate = true) {
  return SWR.trigger(
    Hooks.getUrlKey('/user/list/{group_id}/{team_id}', params, 'GET'),
    shouldRevalidate,
  );
}

export function useRequest(params = {}, swrOptions = {}) {
  return Hooks.useRequest(
    '/user/list/{group_id}/{team_id}',
    params,
    swrOptions,
  );
}

export function request(params, options = {}) {
  return PontCore.fetch(
    PontCore.getUrl('/user/list/{group_id}/{team_id}', params, 'GET'),
    {
      method: 'GET',

      ...options,
    },
  );
}
