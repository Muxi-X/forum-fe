import * as qiniu from 'qiniu-js';
import { nanoid } from 'nanoid';
import { message } from 'antd';

export type CompleteRes = {
  hash: string;
  key: string;
};

type UploadObserver = {
  next?: (res: unknown) => void;
  error?: (err: any) => void;
  complete: (res: CompleteRes) => void;
};

export const observer = {
  next(res: any) {},
  error(err: any) {
    if (err) message.error(err);
  },
  complete(res: any) {},
};

const qiniupload = (
  file: File,
  token: string,
  uploadObserver: UploadObserver = observer,
) => {
  const putExtra = {};
  const key = nanoid();
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z2,
  };
  //选择并上传文件到七牛云
  const observable = qiniu.upload(file, key, token, putExtra, config);

  return observable.subscribe(uploadObserver); // 上传开始
};

export default qiniupload;
