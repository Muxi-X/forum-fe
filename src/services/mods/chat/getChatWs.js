/**
     * @desc WebSocket
建立 WebSocket 连接
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {
  /** uuid */
  id;
}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/chat/ws', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
