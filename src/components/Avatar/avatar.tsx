import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AvatarProps } from './type';
import { AvatarWrapper, AvatarImg, UploadImg } from './style';

enum Size {
  small = '2em',
  mid = '4em',
  large = '6em',
}

const Avatar: React.FC<AvatarProps> = ({
  size = 'small',
  src = '',
  height,
  width,
  fix = false,
  userId,
  onChange,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState('');

  const nav = useNavigate();

  const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 在线浏览
    const imgFile = e.currentTarget.files ? e.currentTarget.files[0] : null;
    const form = new FormData();
    form.append('photo', imgFile as File);
    const reader = new FileReader();
    reader.readAsDataURL(imgFile as File);
    reader.onload = function () {
      setImgSrc(this.result as string);
    };
    onChange && onChange(imgFile as File);
  };

  const haveSrc = () => {
    return src ? src : 'http://ossforum.muxixyz.com/default/defaultAvatar.png';
  };

  return (
    <AvatarWrapper
      onClick={() => {
        if (fix) return;
        else {
          userId && nav(`/user/${userId}`);
        }
      }}
      height={height ? height : Size[size]}
      width={width ? width : Size[size]}
      className={className}
      style={{ cursor: userId ? `pointer` : 'auto' }}
      fix={fix}
    >
      <AvatarImg src={imgSrc ? imgSrc : haveSrc()} alt="图片正在加载中" />
      {fix ? <UploadImg type="file" accept="image/*" onChange={uploadImg} /> : null}
    </AvatarWrapper>
  );
};

export default Avatar;
