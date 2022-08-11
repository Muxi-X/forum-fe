'use strict';
/**
 * @description 基于 swr 的取数hooks
 */
let __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (let s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (let p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
let __rest =
  (this && this.__rest) ||
  function (s, e) {
    let t = {};
    for (let p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (let i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
// Object.defineProperty(exports, '__esModule', { value: true });
import useSWR, {SWRConfig} from 'swr'
import React from 'react';
import { PontCore } from './pontCore';
let defaultOptions = {
  /** 错误重试，默认关闭 */
  shouldRetryOnError: false,
  /** 获取焦点时，不重新请求 */
  revalidateOnFocus: false,
  /** 接口缓存 1 分钟 */
  dedupingInterval: 60000,
};
export const SWRProvider = function (props) {
  const options = __rest(props, ['children']);
  return React.createElement(
    SWRConfig,
    { value: __assign(__assign({}, defaultOptions), options) },
    props.children,
  );
};
/**
 * 基于 swr 的取数 hooks
 * @param url 请求地址
 * @param params 请求参数
 * @param options 配置信息
 */
export function useRequest(url, params, swrOptions, fetchOptions) {
  if (params === void 0) {
    params = {};
  }
  if (swrOptions === void 0) {
    swrOptions = {};
  }
  if (fetchOptions === void 0) {
    fetchOptions = {};
  }
  let _a;
  let fetcher = function (requestUrl) {
    return PontCore.fetch(requestUrl, fetchOptions);
  };
  let method =
    ((_a = fetchOptions) === null || _a === void 0 ? void 0 : _a.method) ||
    'GET';
  let urlKey = getUrlKey(url, params, method);
  let _b = useSWR(urlKey, fetcher, swrOptions),
    data = _b.data,
    error = _b.error,
    isValidating = _b.isValidating,
    mutate = _b.mutate;
  return {
    data: data,
    error: error,
    mutate: mutate,
    isLoading: data === undefined || isValidating,
  };
}

export function getUrlKey(url, params, method) {
  if (params === void 0) {
    params = {};
  }
  let urlKey =
    typeof params === 'function'
      ? function () {
          return params
            ? PontCore.getUrl(url, params(), method)
            : null;
        }
      : params
      ? PontCore.getUrl(url, params, method)
      : null;
  return urlKey;
}

