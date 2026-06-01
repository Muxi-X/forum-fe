import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import { mobilePalette, PrimaryButton } from '../styles';
import { DEFAULT_TABLE } from '../constants';
import { mobileApi } from '../api';

const Wrap = styled.div`
  padding: 16px;
  background: ${mobilePalette.paper};
  min-height: calc(100vh - 52px);
`;

const Label = styled.label`
  display: block;
  margin: 16px 0 8px;
  color: ${mobilePalette.muted};
`;

const Button = styled(PrimaryButton)`
  width: 100%;
  margin-top: 20px;
`;

const SipScoreNew: React.FC = () => {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name.trim() || !description.trim()) {
      message.warning('请填写榜单名称和简介');
      return;
    }
    setSubmitting(true);
    try {
      const res = await mobileApi.sipScore.create({
        name,
        description,
        cover_img: cover,
        tags: tags
          .split(/[,\s，]+/)
          .filter(Boolean)
          .slice(0, 5),
        domain: 'normal',
        category: DEFAULT_TABLE.apiCategory,
      });
      if (res.code !== 0) {
        message.error(res.message);
        return;
      }
      message.success('创建成功');
      nav(`/sip-score/${res.data.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileShell title="新建榜单" back tabs={false}>
      <Wrap>
        <Label>榜单名称</Label>
        <Input
          value={name}
          maxLength={30}
          showCount
          onChange={(event) => setName(event.target.value)}
        />
        <Label>榜单简介</Label>
        <Input.TextArea
          value={description}
          rows={5}
          maxLength={300}
          showCount
          onChange={(event) => setDescription(event.target.value)}
        />
        <Label>封面</Label>
        <UploadField value={cover} onChange={setCover} />
        <Label>标签</Label>
        <Input
          value={tags}
          placeholder="用空格或逗号分隔"
          onChange={(event) => setTags(event.target.value)}
        />
        <Button disabled={submitting} onClick={submit}>
          {submitting ? '发布中...' : '发布榜单'}
        </Button>
      </Wrap>
    </MobileShell>
  );
};

export default SipScoreNew;
