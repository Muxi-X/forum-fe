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
  padding: 74px 30px 28px;
  background: ${mobilePalette.paper};
  min-height: calc(100vh - 52px);

  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: 10px;
    border-color: #dfe3ea;
  }
`;

const Label = styled.label`
  display: block;
  margin: 30px 0 14px;
  color: #1a202c;
  font-weight: 700;
`;

const Button = styled(PrimaryButton)`
  width: 242px;
  display: block;
  margin: 96px auto 0;
  background: #feaa00;
`;

const PageTitle = styled.h1`
  margin: 0 0 12px;
  color: #1a202c;
  font-size: 24px;
  font-weight: 800;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const TagChip = styled.button<{ active?: boolean }>`
  height: 38px;
  min-width: 90px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid ${(props) => (props.active ? '#feaa00' : '#dfe3ea')};
  background: ${(props) => (props.active ? '#feaa00' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#1a202c')};
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
    <MobileShell title="" back tabs={false} showTopBar={false}>
      <Wrap>
        <PageTitle>创建新榜单</PageTitle>
        <Label>榜单名称</Label>
        <Input
          value={name}
          maxLength={30}
          placeholder="例如：大一新生好物榜"
          onChange={(event) => setName(event.target.value)}
        />
        <Label>榜单简介</Label>
        <Input.TextArea
          value={description}
          rows={5}
          maxLength={300}
          placeholder="简单介绍一下你的榜单吧"
          onChange={(event) => setDescription(event.target.value)}
        />
        <Label>上传封面图</Label>
        <UploadField value={cover} onChange={setCover} />
        <Label>#标签</Label>
        <TagRow>
          {['校园生活', '学习资料', '#自定义'].map((tag) => {
            const value = tag.replace(/^#/, '');
            const active = tags.split(/[,\s，]+/).includes(value);
            return (
              <TagChip
                key={tag}
                type="button"
                active={active}
                onClick={() => {
                  const next = new Set(tags.split(/[,\s，]+/).filter(Boolean));
                  if (next.has(value)) next.delete(value);
                  else next.add(value);
                  setTags(Array.from(next).join(' '));
                }}
              >
                {tag}
              </TagChip>
            );
          })}
        </TagRow>
        <Button disabled={submitting} onClick={submit}>
          {submitting ? '发布中...' : '发布'}
        </Button>
      </Wrap>
    </MobileShell>
  );
};

export default SipScoreNew;
