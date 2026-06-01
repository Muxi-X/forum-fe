import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Switch, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import { mobilePalette, PrimaryButton } from '../styles';
import { mobileApi, MobileUser } from '../api';
import useProfile from 'store/useProfile';

const Wrap = styled.div`
  min-height: calc(100vh - 52px);
  padding: 16px;
  background: ${mobilePalette.paper};
`;

const Label = styled.label`
  display: block;
  margin: 16px 0 8px;
  color: ${mobilePalette.muted};
`;

const ProfileEdit: React.FC = () => {
  const nav = useNavigate();
  const { userProfile, setUser } = useProfile();
  const [form, setForm] = useState<MobileUser>(userProfile || {});

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
    nav(`/user/${userProfile.id}`);
  };

  return (
    <MobileShell title="编辑资料" back tabs={false}>
      <Wrap>
        <Label>头像</Label>
        <UploadField
          value={form.avatar || form.avatar_url}
          onChange={(url) => setForm({ ...form, avatar: url, avatar_url: url })}
        />
        <Label>昵称</Label>
        <Input
          value={form.name}
          maxLength={10}
          showCount
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <Label>个人介绍</Label>
        <Input.TextArea
          value={form.signature}
          rows={3}
          maxLength={40}
          showCount
          onChange={(event) => setForm({ ...form, signature: event.target.value })}
        />
        <Label>公开动态</Label>
        <Switch
          checked={form.is_public_feed}
          onChange={(checked) => setForm({ ...form, is_public_feed: checked })}
        />
        <Label>公开收藏和点赞</Label>
        <Switch
          checked={form.is_public_collection_and_like}
          onChange={(checked) =>
            setForm({ ...form, is_public_collection_and_like: checked })
          }
        />
        <PrimaryButton style={{ width: '100%', marginTop: 22 }} onClick={submit}>
          保存
        </PrimaryButton>
      </Wrap>
    </MobileShell>
  );
};

export default ProfileEdit;
