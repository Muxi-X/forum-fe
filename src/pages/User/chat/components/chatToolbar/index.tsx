import React from 'react';
import { Emoji } from 'config';
import { FileImageOutlined, SmileOutlined } from '@ant-design/icons';
import * as style from './style';

const EmojiPopover: React.FC = () => {
  return <SmileOutlined></SmileOutlined>;
};

const ImgPopover: React.FC = () => {
  return <FileImageOutlined></FileImageOutlined>;
};

const ChatToolbar: React.FC = () => {
  const tools = [EmojiPopover, ImgPopover];
  return (
    <style.Toolbar>
      <EmojiPopover />
      <ImgPopover />
    </style.Toolbar>
  );
};

export default ChatToolbar;
