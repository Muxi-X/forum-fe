import { useRequest as request } from 'ahooks';
import { message } from 'antd';

// 20005 token

const useRequest: typeof request = (service, options, plugins) => {
  options = options?.onError
    ? options
    : {
        ...options,
        onError: (e) => {
          message.error(e.message);
        },
      };
  return request(service, options, plugins);
};

export default useRequest;
