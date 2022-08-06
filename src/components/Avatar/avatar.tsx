import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AvatarProps } from './type';
import { AvatarWrapper, AvatarImg, UploadImg } from './style';
import defaultAvatar from 'assets/image/img.jpeg';
import Service from 'service/fetch';

const Avatar: React.FC<AvatarProps> = ({
  size = 'small',
  src = '',
  height,
  width,
  fix = false,
}) => {
  const [imgSrc, setImgSrc] = useState(defaultAvatar);

  enum Size {
    small = '2em',
    mid = '4em',
    large = '6em',
  }

  const nav = useNavigate();
  const id = localStorage.getItem('id');

  const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.currentTarget.files ? e.currentTarget.files[0] : null;
    const form = new FormData();
    form.append('photo', imgFile as File);
    Service.upload(form).then((res: any) => {
      const url = 'http://192.168.148.152:8080' + res.data;
      const form = {
        uid: +(localStorage.getItem('id') as string),
        photo: url,
      };
      Service.uploadImg(form).then((res: any) => {
        console.log(res);
      });
    });
    const reader = new FileReader();
    reader.readAsDataURL(imgFile as File);
    reader.onload = function () {
      setImgSrc(this.result as string);
    };
  };

  return (
    <AvatarWrapper
      onClick={() => {
        if (fix) return;
        else {
          nav(`/user/${id}`);
        }
      }}
      height={height ? height : Size[size]}
      width={width ? width : Size[size]}
    >
      <AvatarImg src={src ? src : imgSrc} alt="图片正在加载中" />
      {fix ? <UploadImg type="file" accept="image/*" onChange={uploadImg} /> : null}
    </AvatarWrapper>
  );
};

export default Avatar;
