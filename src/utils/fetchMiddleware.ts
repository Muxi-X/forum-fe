import { clearAuthStorage, getAuthToken, isLoginRoute } from './auth';

const handleAuthError = (res: any) => {
  if (res?.code !== 20005 || isLoginRoute(window.location.pathname)) return;
  clearAuthStorage();
  window.location.replace('/login');
};

const normalizeHeaders = (headers: any = {}) => {
  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return { ...headers };
};

const hasAuthHeader = (headers: Record<string, unknown>) =>
  Object.keys(headers).some((key) => key.toLowerCase() === 'authorization');

const Request = (url: string, options: any = {}) => {
  const { timeoutMs, ...fetchOptions } = options;
  url = `/api/v1${url}`;
  const isFile = fetchOptions.body instanceof FormData;
  const authToken = getAuthToken();
  const existingHeaders = normalizeHeaders(fetchOptions.headers);
  const defaultHeaders = isFile
    ? {}
    : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
  fetchOptions.headers = {
    ...defaultHeaders,
    ...existingHeaders,
  };
  if (authToken && !hasAuthHeader(fetchOptions.headers)) {
    fetchOptions.headers.Authorization = authToken;
  }

  if (fetchOptions.body) {
    fetchOptions.body = isFile ? fetchOptions.body : JSON.stringify(fetchOptions.body);
  }
  let timeoutId: number | undefined;
  let timedOut = false;
  if (timeoutMs && !fetchOptions.signal) {
    const controller = new AbortController();
    fetchOptions.signal = controller.signal;
    timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
  }
  return fetch(url, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json().then((res) => {
          handleAuthError(res);
          return res;
        });
      } else {
        return response.json().then((res) => {
          handleAuthError(res);
          return new Promise((_, reject) => {
            reject(res);
          });
        });
      }
    })
    .catch((e) => {
      if (timedOut) {
        throw new Error('请求超时，请稍后重试');
      }
      console.log(`服务端错误：${e.message}`);
      throw e;
    })
    .finally(() => {
      if (timeoutId) window.clearTimeout(timeoutId);
    });
};

export default Request;
