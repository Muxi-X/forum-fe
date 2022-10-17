const Request = (url: string, options: any = {}) => {
  url = `/api/v1${url}`;
  const isFile = options.body instanceof FormData;
  options.headers = isFile
    ? {}
    : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
  options.headers.Authorization = localStorage.getItem('token');

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
