/**
 * @desc 处理举报 api
 */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'PUT';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/report', params, 'PUT'), {
    method: 'PUT',

    body,
    ...options,
  });
}
