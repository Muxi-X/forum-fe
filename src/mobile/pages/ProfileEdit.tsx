import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Switch, message } from 'antd';
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
  padding: 18px 18px calc(118px + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #fff8e6 0%, #f7f8fb 34%, #f7f8fb 100%);
  position: relative;

  .ant-input {
    padding: 7px 0 0;
    border: 0 !important;
    border-radius: 0;
    background: transparent !important;
    box-shadow: none !important;
    color: #1a202c;
    font-size: 16px;
    line-height: 1.45;
  }
  .ant-input:focus {
    box-shadow: none !important;
  }
`;

const FormCard = styled.section`
  overflow: hidden;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(60, 60, 67, 0.08);
  box-shadow: 0 18px 42px rgba(16, 24, 40, 0.08);
  backdrop-filter: blur(18px);
`;

const IdentityHero = styled.div`
  position: relative;
  min-height: 106px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 18px 16px;
  background: linear-gradient(
    135deg,
    rgba(255, 198, 65, 0.28),
    rgba(255, 250, 240, 0.82)
  );
  h1 {
    margin: 0;
    color: #1a202c;
    font-size: 24px;
    line-height: 1.2;
    font-weight: 800;
  }
  p {
    margin: 7px 0 0;
    color: ${mobilePalette.muted};
    font-size: 13px;
    line-height: 1.45;
  }
`;

const Cup = styled(TeaCupHeroSvg)`
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  object-fit: contain;
`;

const AvatarField = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-bottom: 1px solid rgba(60, 60, 67, 0.08);
`;

const AvatarCopy = styled.div`
  min-width: 0;
  h2 {
    margin: 0 0 5px;
    color: ${mobilePalette.ink};
    font-size: 16px;
    line-height: 1.3;
    font-weight: 800;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    font-size: 12px;
  }
`;

const AvatarButton = styled.button`
  position: relative;
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  border-radius: 50%;
  background: #d7dce4;
  overflow: visible;
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.08);
  transition: transform 150ms ease;
  &:active {
    transform: scale(0.96);
  }
  .badge {
    position: absolute;
    right: -1px;
    bottom: 5px;
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #ffc641;
    color: #fff;
    font-size: 14px;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.92);
  }
`;

const Field = styled.label`
  display: grid;
  gap: 3px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.72);
  color: ${mobilePalette.muted};
  font-size: 12px;
  & + & {
    border-top: 1px solid rgba(60, 60, 67, 0.08);
  }
`;

const ToggleField = styled.div`
  min-height: 68px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.72);
  border-top: 1px solid rgba(60, 60, 67, 0.08);
  .copy {
    min-width: 0;
  }
  h3 {
    margin: 0 0 4px;
    color: ${mobilePalette.ink};
    font-size: 14px;
    line-height: 1.35;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    font-size: 12px;
    line-height: 1.45;
  }
  .ant-switch-checked {
    background: ${mobilePalette.orange};
  }
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
  button:last-child,
  label:last-child {
    border-bottom: 0;
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
      is_public_collection_and_like: form.is_public_collection_and_like !== false,
      is_public_feed: form.is_public_feed !== false,
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
    nav(`/user/${targetId}`, {
      replace: true,
      state: { refreshProfile: true },
    });
  };

  return (
    <MobileShell title="编辑资料" back tabs={false}>
      <Wrap>
        <FormCard>
          <IdentityHero>
            <Cup variant="small" />
            <div>
              <h1>身份卡</h1>
              <p>让大家一眼认出你。</p>
            </div>
          </IdentityHero>
          <AvatarField>
            <AvatarButton type="button" onClick={() => setAvatarSheet(true)}>
              <MobileAvatar url={form.avatar || form.avatar_url} size={72} />
              <span className="badge">+</span>
            </AvatarButton>
            <AvatarCopy>
              <h2>头像</h2>
              <p>点击更换</p>
            </AvatarCopy>
          </AvatarField>
          <Field>
            <span>昵称</span>
            <Input
              value={form.name}
              maxLength={10}
              placeholder="取一个好记的名字"
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </Field>
          <Field>
            <span>个人介绍</span>
            <Input.TextArea
              value={form.signature}
              rows={3}
              maxLength={40}
              placeholder="简单介绍一下自己"
              onChange={(event) => setForm({ ...form, signature: event.target.value })}
            />
          </Field>
          <ToggleField>
            <div className="copy">
              <h3>公开动态</h3>
              <p>允许其他茶友查看你的动态。</p>
            </div>
            <Switch
              checked={form.is_public_feed !== false}
              onChange={(checked) => setForm({ ...form, is_public_feed: checked })}
            />
          </ToggleField>
          <ToggleField>
            <div className="copy">
              <h3>公开收藏和点赞</h3>
              <p>允许其他茶友查看你的收藏与点赞。</p>
            </div>
            <Switch
              checked={form.is_public_collection_and_like !== false}
              onChange={(checked) =>
                setForm({ ...form, is_public_collection_and_like: checked })
              }
            />
          </ToggleField>
        </FormCard>
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
          </AvatarSheet>
        </MobileBottomSheet>
      </Wrap>
    </MobileShell>
  );
};

export default ProfileEdit;
