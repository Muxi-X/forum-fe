import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import { mobilePalette, PrimaryButton, mobileRadius } from '../styles';
import { DEFAULT_TABLE } from '../constants';
import { mobileApi } from '../api';

const Wrap = styled.div`
  padding: 16px 18px 118px;
  background: linear-gradient(180deg, #fffaf0 0%, #f7f8fb 36%, #f7f8fb 100%);
  min-height: calc(100vh - 52px);

  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: ${mobileRadius.lg};
    border-color: rgba(60, 60, 67, 0.1);
    box-shadow: 0 8px 22px rgba(16, 24, 40, 0.04);
  }
`;

const Label = styled.label`
  display: block;
  margin: 22px 0 10px;
  color: #1a202c;
  font-weight: 700;
`;

const FixedBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 520px;
  margin: 0 auto;
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid ${mobilePalette.lineSoft};
  backdrop-filter: blur(18px);
`;

const SubmitButton = styled(PrimaryButton)`
  width: 100%;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TagChip = styled.button<{ active?: boolean }>`
  height: 36px;
  min-width: 82px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid ${(props) => (props.active ? '#feaa00' : 'rgba(60, 60, 67, 0.1)')};
  background: ${(props) => (props.active ? '#feaa00' : 'rgba(255, 255, 255, 0.86)')};
  color: ${(props) => (props.active ? '#fff' : '#1a202c')};
`;

const CustomTagForm = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  input {
    flex: 1;
    min-width: 0;
    height: 38px;
    padding: 0 14px;
    border: 1px solid rgba(60, 60, 67, 0.12);
    border-radius: ${mobileRadius.pill};
  }
  button {
    width: 58px;
    border-radius: ${mobileRadius.pill};
    background: rgba(255, 198, 65, 0.2);
    color: #c46c00;
    font-weight: 800;
  }
`;

const SipScoreNew: React.FC = () => {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [tags, setTags] = useState('');
  const [customTag, setCustomTag] = useState('');
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

  const tagList = tags.split(/[,\s，]+/).filter(Boolean);

  const addCustomTag = () => {
    const next = customTag.replace(/^#/, '').trim();
    if (!next) return;
    if (next.length > 12) {
      message.warning('标签最多 12 个字');
      return;
    }
    const merged = new Set(tagList);
    merged.add(next);
    setTags(Array.from(merged).slice(0, 5).join(' '));
    setCustomTag('');
  };

  return (
    <MobileShell title="创建榜单" back tabs={false}>
      <Wrap>
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
          {['校园生活', '学习资料', '美食', '课程', '宿舍', '工具'].map((tag) => {
            const value = tag.replace(/^#/, '');
            const active = tagList.includes(value);
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
        <CustomTagForm
          onSubmit={(event) => {
            event.preventDefault();
            addCustomTag();
          }}
        >
          <input
            value={customTag}
            maxLength={12}
            placeholder="添加自定义标签"
            onChange={(event) => setCustomTag(event.target.value)}
          />
          <button type="submit">添加</button>
        </CustomTagForm>
        <FixedBar>
          <SubmitButton disabled={submitting} onClick={submit}>
            {submitting ? '发布中...' : '发布榜单'}
          </SubmitButton>
        </FixedBar>
      </Wrap>
    </MobileShell>
  );
};

export default SipScoreNew;
