import React, { useEffect, useState, useRef } from 'react';
import { FileImageOutlined, SmileOutlined } from '@ant-design/icons';
import qiniupload, { observer, CompleteRes } from 'utils/qiniup';
import { QiniuServer } from 'config';
import useProfile from 'store/useProfile';
import 'emoji-mart/css/emoji-mart.css';
import { EmojiData, Picker } from 'emoji-mart';
import useOnClickOutside from 'hooks/useOnClickOutside';
import * as style from './style';
import './index.less';

interface PopoverProps {
  className: string;
}

interface EmojiPopoverProps extends PopoverProps {
  onSelectEmoji?: (emoji: EmojiData, e: React.MouseEvent<HTMLElement>) => void;
}

interface ImgPopoverProps extends PopoverProps {
  onUploadImg?: (data: string) => void;
}
// 可以根据这些Props来决定使用哪些工具组件
interface ToolbarProps {
  emoji?: boolean;
  img?: boolean;
  file?: boolean;
  onSelectEmoji?: (emoji: EmojiData, e: React.MouseEvent<HTMLElement>) => void;
  onUploadImg?: (data: string) => void;
}

const EmojiPopover: React.FC<EmojiPopoverProps> = ({ className, onSelectEmoji }) => {
  const [showPopover, setShowPopover] = useState(false);

  useOnClickOutside(
    document.getElementsByClassName('emoji-mart')[0],
    () => {
      if (showPopover) setShowPopover(false);
    },
    { class: 'anticon-smile' },
  );

  const handleShowEmojiPicker = () => {
    setShowPopover(true);
  };

  return (
    <>
      <Picker
        set="apple"
        color="#0757a6"
        showPreview={false}
        showSkinTones={false}
        include={['people']}
        style={{
          position: 'absolute',
          bottom: '45px',
          left: '-50px',
          visibility: `${showPopover ? 'visible' : 'hidden'}`,
        }}
        onClick={(emoji, e) => {
          setShowPopover(false);
          onSelectEmoji && onSelectEmoji(emoji, e);
        }}
      />

      <SmileOutlined onClick={handleShowEmojiPicker} className={className} />
    </>
  );
};

const ImgPopover: React.FC<ImgPopoverProps> = ({ className, onUploadImg }) => {
  const inputRef = useRef<HTMLInputElement>();
  const profileStore = useProfile();
  const handleSelectImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.currentTarget.files ? e.currentTarget.files[0] : null;
    observer.complete = (res: CompleteRes) => {
      onUploadImg && onUploadImg(QiniuServer + res.key);
    };
    qiniupload(imgFile as File, profileStore.qiniuToken);
  };
  return (
    <>
      <input
        onChange={handleSelectImg}
        ref={inputRef as React.LegacyRef<HTMLInputElement>}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
      />
      <FileImageOutlined
        onClick={() => {
          inputRef?.current?.click();
        }}
        className={className}
      />
    </>
  );
};

const ChatToolbar: React.FC<ToolbarProps> = ({
  emoji,
  img,
  onSelectEmoji,
  onUploadImg,
}) => {
  const tools = [
    { name: 'emoji', component: EmojiPopover },
    { name: 'img', component: ImgPopover },
  ];

  return (
    <style.Toolbar>
      {tools.map((tool, index) => {
        if (emoji && tool.name === 'emoji')
          return (
            <style.Tool key={index}>
              {tool.component({ className: 'tool', onSelectEmoji })}
            </style.Tool>
          );
        else if (img && tool.name === 'img')
          return (
            <style.Tool key={index}>
              {tool.component({ className: 'tool', onUploadImg })}
            </style.Tool>
          );
      })}
    </style.Toolbar>
  );
};

export default React.memo(ChatToolbar);
