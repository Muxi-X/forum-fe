/**
     * @desc 获取该用户的uuid
该用户发送信息前先获取自己的uuid，并放入query(id=?)，有效期24h
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/chat', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
