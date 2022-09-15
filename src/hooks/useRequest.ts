import { useRequest as request } from 'ahooks';
import { message } from 'antd';

const useRequest: typeof request = (service, options, plugins) => {
  options = options?.onError
    ? options
    : {
        ...options,
        onError: () => {
          message.error('网络或服务器错误');
        },
      };
  return request(service, options, plugins);
};

export default useRequest;
