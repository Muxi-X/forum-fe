import React, { useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import useProfile from 'store/useProfile';
import qiniupload, { CompleteRes } from 'utils/qiniup';
import { QiniuServer } from 'config';
import { mobileMotion, mobilePalette, mobileRadius } from '../styles';
import { mastergoAssets } from '../assets/mastergo';
import DesignIcon from './DesignIcon';

const uploadTimeoutMs = 30000;

const Box = styled.label<{ compact?: boolean; round?: boolean }>`
  width: ${(props) => (props.compact ? '88px' : '100%')};
  min-height: ${(props) => (props.compact ? '88px' : '88px')};
  display: grid;
  place-items: center;
  border: 1px dashed rgba(127, 131, 138, 0.34);
  border-radius: ${(props) => (props.round ? '50%' : mobileRadius.lg)};
  background: rgba(255, 255, 255, 0.86);
  color: ${mobilePalette.muted};
  overflow: hidden;
  transition: background ${mobileMotion.fast}, border-color ${mobileMotion.fast},
    transform ${mobileMotion.fast};
  &:active {
    transform: scale(0.98);
    background: #fff;
    border-color: rgba(254, 152, 0, 0.35);
  }
  input {
    display: none;
  }
  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    color: ${mobilePalette.muted};
    font-size: 13px;
    font-weight: 600;
  }
`;

const Preview = styled.label<{ compact?: boolean; round?: boolean }>`
  position: relative;
  width: ${(props) => (props.compact ? '88px' : '96px')};
  height: ${(props) => (props.compact ? '88px' : '96px')};
  display: block;
  border-radius: ${(props) => (props.round ? '50%' : mobileRadius.lg)};
  box-shadow: 0 10px 26px rgba(16, 24, 40, 0.08);
  input {
    display: none;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${(props) => (props.round ? '50%' : mobileRadius.lg)};
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
  onUploadingChange?: (uploading: boolean) => void;
}> = ({ value, onChange, compact, round, iconOnly, label, onUploadingChange }) => {
  const { qiniuToken } = useProfile();
  const [uploading, setUploading] = useState(false);

  const setUploadState = (nextUploading: boolean) => {
    setUploading(nextUploading);
    onUploadingChange?.(nextUploading);
  };

  const handleUpload = (file: File) => {
    if (!qiniuToken) {
      message.error('图片上传凭证缺失，请重新登录后再试');
      return;
    }

    setUploadState(true);
    let settled = false;
    let subscription: ReturnType<typeof qiniupload> | undefined;
    const uploadTimer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      subscription?.unsubscribe();
      setUploadState(false);
      message.error('上传超时，请稍后重试');
    }, uploadTimeoutMs);

    const clearUploadState = () => {
      settled = true;
      window.clearTimeout(uploadTimer);
      setUploadState(false);
    };

    try {
      subscription = qiniupload(file, qiniuToken, {
        complete: (res: CompleteRes) => {
          if (settled) return;
          clearUploadState();
          onChange(QiniuServer + res.key);
          message.success('上传成功');
        },
        error: (err: any) => {
          if (settled) return;
          clearUploadState();
          message.error(err?.message || '上传失败');
        },
      });
    } catch (err) {
      if (!settled) {
        clearUploadState();
        message.error(err instanceof Error ? err.message : '上传失败');
      }
    }
  };

  if (value) {
    return (
      <Preview compact={compact} round={round}>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            handleUpload(file);
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
          handleUpload(file);
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
