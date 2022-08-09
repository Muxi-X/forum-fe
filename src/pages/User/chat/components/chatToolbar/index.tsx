import React, { useEffect, useState, useRef, RefObject } from 'react';
import { FileImageOutlined, SmileOutlined } from '@ant-design/icons';
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
  onUploadImg?: (ref: RefObject<HTMLInputElement>) => void;
}
// 可以根据这些Props来决定使用哪些工具组件
interface ToolbarProps {
  emoji?: boolean;
  img?: boolean;
  file?: boolean;
  onSelectEmoji?: (emoji: EmojiData, e: React.MouseEvent<HTMLElement>) => void;
  onUploadImg?: (ref: RefObject<HTMLInputElement>) => void;
}

const EmojiPopover: React.FC<EmojiPopoverProps> = ({ className, onSelectEmoji }) => {
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    // if (showPopover) {
    //   let picker = document.getElementsByTagName('em-emoji-picker')[0];
    //   const style = document.createElement('style');
    //   style.innerHTML = `.sticky {display: none}`;
    //   picker.shadowRoot?.appendChild(style);
    //   (picker as unknown) = null;
    //   const root = document.getElementById('root');
    //   root?.addEventListener('click', () => {
    //     if (showPopover) setShowPopover(false);
    //     console.log(222);
    //   });
    // }
  }, []);

  useOnClickOutside(document.getElementsByClassName('emoji-mart')[0], () => {
    if (showPopover) setShowPopover(false);
  });

  const handleShowEmojiPicker = () => {
    // let picker = document.getElementsByTagName('em-emoji-picker')[0];
    // (picker as HTMLElement).style.display = 'block';
    // (picker as unknown) = null;
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
        onClick={onSelectEmoji}
      />

      <SmileOutlined onClick={handleShowEmojiPicker} className={className} />
    </>
  );
};

const ImgPopover: React.FC<ImgPopoverProps> = ({ className, onUploadImg }) => {
  const [img, setImg] = useState('');
  const inputRef = useRef(null);
  return (
    <>
      <input
        onChange={(e) => {
          console.log(e);
        }}
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
      />
      <FileImageOutlined
        onClick={() => {
          onUploadImg && onUploadImg(inputRef);
        }}
        className={className}
      />
    </>
  );
};

const ChatToolbar: React.FC<ToolbarProps> = ({
  emoji,
  img,
  file,
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
