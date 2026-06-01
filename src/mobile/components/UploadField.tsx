import React, { useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import useProfile from 'store/useProfile';
import qiniupload, { observer, CompleteRes } from 'utils/qiniup';
import { QiniuServer } from 'config';
import { mobilePalette } from '../styles';
import { mastergoAssets } from '../assets/mastergo';
import DesignIcon from './DesignIcon';

const Box = styled.label<{ compact?: boolean; round?: boolean }>`
  width: ${(props) => (props.compact ? '88px' : '100%')};
  min-height: ${(props) => (props.compact ? '88px' : '88px')};
  display: grid;
  place-items: center;
  border: 1px dashed #d8dce3;
  border-radius: ${(props) => (props.round ? '50%' : '8px')};
  background: #fff;
  color: ${mobilePalette.muted};
  overflow: hidden;
  input {
    display: none;
  }
`;

const Preview = styled.label<{ compact?: boolean; round?: boolean }>`
  position: relative;
  width: ${(props) => (props.compact ? '88px' : '96px')};
  height: ${(props) => (props.compact ? '88px' : '96px')};
  display: block;
  input {
    display: none;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${(props) => (props.round ? '50%' : '8px')};
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

const UploadField: React.FC<{
  value?: string;
  onChange: (url: string) => void;
  compact?: boolean;
  round?: boolean;
  iconOnly?: boolean;
  label?: string;
}> = ({ value, onChange, compact, round, iconOnly, label }) => {
  const { qiniuToken } = useProfile();
  const [uploading, setUploading] = useState(false);

  if (value) {
    return (
      <Preview compact={compact} round={round}>
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
        <img src={value} alt="" />
        <button type="button" onClick={() => onChange('')} aria-label="移除图片">
          <DesignIcon name="close" size={20} />
        </button>
      </Preview>
    );
  }

  return (
    <Box compact={compact} round={round}>
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
        {iconOnly ? (
          uploading ? (
            '...'
          ) : (
            <img src={mastergoAssets.icons.addSmall} alt="" width={14} height={14} />
          )
        ) : (
          <>
            <DesignIcon name="image" size={18} color="#fe9800" />{' '}
            {uploading ? '上传中...' : label || '上传图片'}
          </>
        )}
      </span>
    </Box>
  );
};

export default UploadField;
