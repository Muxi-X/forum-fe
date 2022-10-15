/**
     * @desc get 我的 profile api
获取 my 完整 user 信息（权限 role: Normal-普通学生用户; NormalAdmin-学生管理员; Muxi-团队成员; MuxiAdmin-团队管理员; SuperAdmin-超级管理员）
     */

import * as defs from '../../baseClass';
import { PontCore } from '../../pontCore';

export class Params {}

export const method = 'GET';

export function request(params, options = {}) {
  return PontCore.fetch(PontCore.getUrl('/user/myprofile', params, 'GET'), {
    method: 'GET',

    ...options,
  });
}
