/**
     * @desc 学生登录 api
login the student-forum
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'POST';

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
