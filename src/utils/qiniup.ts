import * as qiniu from 'qiniu-js';
import { nanoid } from 'nanoid';
import { message } from 'antd';

export type CompleteRes = {
  hash: string;
  key: string;
};

export const observer = {
  next(res: any) {},
  error(err: any) {
    if (err) message.error(err);
  },
  complete(res: any) {},
};

const qiniupload = (file: File, token: string) => {
  const putExtra = {};
  const key = nanoid();
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z2,
  };
  //选择并上传文件到七牛云
  const observable = qiniu.upload(file, key, token, putExtra, config);

  observable.subscribe(observer); // 上传开始
};

export default qiniupload;
