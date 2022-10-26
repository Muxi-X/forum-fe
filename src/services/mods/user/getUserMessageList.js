/**
 * @desc list user message api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/message/list', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
