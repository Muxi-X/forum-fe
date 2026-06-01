import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import MobileAvatar from '../components/MobileAvatar';
import MobileBottomSheet from '../components/MobileBottomSheet';
import { mobilePalette, mobileRadius, PrimaryButton } from '../styles';
import { mobileApi, MobileUser } from '../api';
import useProfile from 'store/useProfile';
import TeaCupHeroSvg from '../components/TeaCupHeroSvg';

const Wrap = styled.div`
  min-height: calc(100vh - 60px);
  padding: 28px 20px 112px;
  background: linear-gradient(180deg, #ffe6b6 0%, #fff4d8 38%, #ffffff 100%);
  position: relative;

  .ant-input {
    padding: 8px 0;
    border: 0 !important;
    border-bottom: 1px solid rgba(127, 131, 138, 0.22) !important;
    border-radius: 0;
    background: transparent !important;
    box-shadow: none !important;
    color: #1a202c;
  }
  .ant-input:focus {
    border-bottom-color: rgba(127, 131, 138, 0.32) !important;
    box-shadow: none !important;
  }
`;

const IdentityHero = styled.div`
  position: relative;
  min-height: 126px;
  display: grid;
  grid-template-columns: 91px 1fr;
  align-items: start;
  gap: 18px;
  margin-bottom: 12px;
  h1 {
    margin: 18px 0 0;
    color: #1a202c;
    font-size: 26px;
    line-height: 1.2;
    font-weight: 400;
  }
`;

const Cup = styled(TeaCupHeroSvg)`
  width: 80px;
  height: 86px;
  object-fit: contain;
`;

const AvatarField = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: -18px 6px 26px;
`;

const AvatarButton = styled.button`
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #d7dce4;
  overflow: visible;
  .badge {
    position: absolute;
    right: 0;
    bottom: 4px;
    width: 16px;
    height: 16px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #ffc641;
    color: #fff;
    font-size: 12px;
  }
`;

const Label = styled.label`
  display: block;
  margin: 24px 0 8px;
  color: #3d3d3d;
  font-size: 12px;
`;

const FixedSubmit = styled(PrimaryButton)`
  position: fixed;
  left: 24px;
  right: 24px;
  bottom: calc(20px + env(safe-area-inset-bottom));
  height: 50px;
`;

const AvatarSheet = styled.div`
  overflow: hidden;
  border-radius: ${mobileRadius.lg};
  background: #fff;
  button,
  label {
    width: 100%;
    height: 52px;
    display: grid;
    place-items: center;
    color: #3d3d3d;
    background: #fff;
    border-bottom: 1px solid #d8d8d8;
    input {
      display: none;
    }
  }
`;

const ProfileEdit: React.FC = () => {
  const nav = useNavigate();
  const { userProfile, setUser } = useProfile();
  const [form, setForm] = useState<MobileUser>(userProfile || {});
  const [avatarSheet, setAvatarSheet] = useState(false);

  useEffect(() => setForm(userProfile || {}), [userProfile]);

  const submit = async () => {
    const res = await mobileApi.user.update({
      name: form.name,
      avatar_url: form.avatar || form.avatar_url,
      signature: form.signature,
      is_public_collection_and_like: form.is_public_collection_and_like,
      is_public_feed: form.is_public_feed,
    });
    if (res.code !== 0) {
      message.error(res.message);
      return;
    }
    setUser({
      ...userProfile,
      ...form,
      avatar: form.avatar || form.avatar_url,
    } as defs.UserProfile);
    message.success('修改成功');
    const targetId =
      form.id || userProfile.id || Number(localStorage.getItem('userId')) || '';
    nav(`/user/${targetId}`, { state: { profileToast: '修改成功' } });
  };

  return (
    <MobileShell title="编辑资料" back tabs={false}>
      <Wrap>
        <IdentityHero>
          <Cup variant="small" />
          <h1>认领身份卡~</h1>
        </IdentityHero>
        <AvatarField>
          <AvatarButton type="button" onClick={() => setAvatarSheet(true)}>
            <MobileAvatar url={form.avatar || form.avatar_url} size={64} />
            <span className="badge">+</span>
          </AvatarButton>
        </AvatarField>
        <Label>昵称</Label>
        <Input
          value={form.name}
          maxLength={10}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <Label>个人介绍</Label>
        <Input.TextArea
          value={form.signature}
          rows={2}
          maxLength={40}
          onChange={(event) => setForm({ ...form, signature: event.target.value })}
        />
        <FixedSubmit onClick={submit}>确定</FixedSubmit>
        <MobileBottomSheet
          open={avatarSheet}
          title="更换头像"
          onClose={() => setAvatarSheet(false)}
        >
          <AvatarSheet>
            <UploadField
              label="从手机相册选择"
              value={form.avatar || form.avatar_url}
              onChange={(url) => {
                setForm({ ...form, avatar: url, avatar_url: url });
                setAvatarSheet(false);
              }}
            />
            <button type="button">相机拍摄</button>
            <button type="button" onClick={() => setAvatarSheet(false)}>
              取消
            </button>
          </AvatarSheet>
        </MobileBottomSheet>
      </Wrap>
    </MobileShell>
  );
};

export default ProfileEdit;
