const Request = (url: string, options: any = {}) => {
  url = `/api/v1/${url}`;
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
          console.log(res);
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

Request(
  '/ClientWeb/pro/ajax/reserve.aspx?dialogid=&dev_id=101700102&lab_id=&kind_id=&room_id=&type=dev&prop=&test_id=&term=&Vnumber=&classkind=&test_name=&start=2022-11-27+17%3A00&end=2022-11-27+19%3A00&start_time=1700&end_time=1900&up_file=&memo=&act=set_resv&_=1669537164526',
);

export default Request;
