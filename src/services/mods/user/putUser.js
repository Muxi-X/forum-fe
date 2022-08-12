/**
     * @desc update info api
修改用户个人信息
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'PUT';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user', params, 'PUT'), {
    method: 'PUT',

    body,
    ...options,
  });
}
