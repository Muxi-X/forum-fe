import { useRequest as request } from 'ahooks';
import { message } from 'antd';

// 20005 token

const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth <= 576;

const useRequest: typeof request = (service, options, plugins) => {
  options = options?.onError
    ? options
    : {
        ...options,
        onError: (e: ErrorRes) => {
          if (e.code === 20005 && !(import.meta.env.DEV && isMobileViewport())) {
            location.href = location.origin + '/login';
          }
          message.error(e.message);
        },
      };
  return request(service, options, plugins);
};

export default useRequest;
