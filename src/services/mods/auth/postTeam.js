/**
     * @desc 团队登录 api
login the team-forum
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'POST';

export function request(params, body, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/auth/login/team', params, 'POST'), {
    method: 'POST',

    body,
    ...options,
  });
}
