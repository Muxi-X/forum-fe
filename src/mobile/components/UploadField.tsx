import React, { useState } from 'react';
import styled from 'styled-components';
import { PictureOutlined, CloseCircleFilled } from '@ant-design/icons';
import { message } from 'antd';
import useProfile from 'store/useProfile';
import qiniupload, { observer, CompleteRes } from 'utils/qiniup';
import { QiniuServer } from 'config';
import { mobilePalette } from '../styles';

const Box = styled.label`
  min-height: 88px;
  display: grid;
  place-items: center;
  border: 1px dashed #d8dce3;
  border-radius: 8px;
  background: #fff;
  color: ${mobilePalette.muted};
  input {
    display: none;
  }
`;

const Preview = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  button {
    position: absolute;
    top: -8px;
    right: -8px;
    background: transparent;
    color: ${mobilePalette.danger};
    font-size: 20px;
  }
`;

const UploadField: React.FC<{ value?: string; onChange: (url: string) => void }> = ({
  value,
  onChange,
}) => {
  const { qiniuToken } = useProfile();
  const [uploading, setUploading] = useState(false);

  if (value) {
    return (
      <Preview>
        <img src={value} alt="" />
        <button type="button" onClick={() => onChange('')} aria-label="移除图片">
          <CloseCircleFilled />
        </button>
      </Preview>
    );
  }

  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (!file) return;
          setUploading(true);
          observer.complete = (res: CompleteRes) => {
            setUploading(false);
            onChange(QiniuServer + res.key);
            message.success('上传成功');
          };
          observer.error = (err: any) => {
            setUploading(false);
            message.error(err?.message || '上传失败');
          };
          qiniupload(file, qiniuToken);
        }}
      />
      <span>
        <PictureOutlined /> {uploading ? '上传中...' : '上传图片'}
      </span>
    </Box>
  );
};

export default UploadField;
