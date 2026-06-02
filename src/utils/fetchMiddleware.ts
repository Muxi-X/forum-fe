import { clearAuthStorage, getAuthToken, isLoginRoute } from './auth';

const handleAuthError = (res: any) => {
  if (res?.code !== 20005 || isLoginRoute(window.location.pathname)) return;
  clearAuthStorage();
  window.location.replace('/login');
};

const Request = (url: string, options: any = {}) => {
  url = `/api/v1${url}`;
  const isFile = options.body instanceof FormData;
  const authToken = getAuthToken();
  options.headers = isFile
    ? {}
    : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
  if (authToken) {
    options.headers.Authorization = authToken;
  }

  if (options.body) {
    options.body = isFile ? options.body : JSON.stringify(options.body);
  }
  return fetch(url, options)
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
      console.log(`服务端错误：${e.message}`);
      throw e;
    });
};

export default Request;
