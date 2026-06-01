import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import { mobilePalette, PrimaryButton } from '../styles';
import { mobileApi, MobileUser } from '../api';
import useProfile from 'store/useProfile';
import TeaCupHeroSvg from '../components/TeaCupHeroSvg';

const Wrap = styled.div`
  min-height: calc(100vh - 60px);
  padding: 28px 20px 28px;
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
  min-height: 116px;
  display: grid;
  grid-template-columns: 91px 1fr;
  align-items: start;
  gap: 18px;
  margin-bottom: 12px;
  h1 {
    margin: 20px 0 0;
    color: #1a202c;
    font-size: 27px;
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
  margin: -28px 6px 28px;
`;

const AvatarButton = styled.button`
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #d7dce4;
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
  margin: 26px 0 8px;
  color: #3d3d3d;
  font-size: 12px;
`;

const FixedSubmit = styled(PrimaryButton)`
  position: fixed;
  left: 24px;
  right: 24px;
  bottom: calc(35px + env(safe-area-inset-bottom));
  height: 38px;
  background: #ffc641;
`;

const SheetMask = styled.div`
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(18, 27, 41, 0.86);
`;

const AvatarSheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
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
    const targetId = form.id || userProfile.id || Number(localStorage.getItem('userId')) || '';
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
            {form.avatar || form.avatar_url ? (
              <img
                src={form.avatar || form.avatar_url}
                alt=""
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : null}
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
        <FixedSubmit onClick={submit}>
          确定
        </FixedSubmit>
        {avatarSheet ? (
          <>
            <SheetMask onClick={() => setAvatarSheet(false)} />
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
          </>
        ) : null}
      </Wrap>
    </MobileShell>
  );
};

export default ProfileEdit;
