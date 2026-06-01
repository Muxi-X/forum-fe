const Request = (url: string, options: any = {}) => {
  url = `/api/v1${url}`;
  const isFile = options.body instanceof FormData;
  const authToken =
    localStorage.getItem('token') ||
    (import.meta.env.DEV ? import.meta.env.VITE_DEV_AUTH_TOKEN || '2' : '');
  options.headers = isFile
    ? {}
    : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
  options.headers.Authorization = authToken;

  if (options.body) {
    options.body = isFile ? options.body : JSON.stringify(options.body);
  }
  return fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json().then((res) => {
          return res;
        });
      } else {
        return response.json().then((res) => {
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
