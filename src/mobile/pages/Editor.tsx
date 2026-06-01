import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SegmentTabs from '../components/SegmentTabs';
import { mobilePalette, PrimaryButton, GhostButton } from '../styles';
import { DEFAULT_TABLE, MOBILE_TABLES } from '../constants';
import { mobileApi } from '../api';
import Drafts, { Draft } from 'utils/db_drafts';
import moment from 'utils/moment';

const Wrap = styled.div`
  min-height: calc(100vh - 52px);
  background: ${mobilePalette.paper};
  padding: 14px 16px 28px;
`;

const TitleInput = styled.input`
  width: 100%;
  min-height: 46px;
  margin-bottom: 12px;
  background: transparent;
  color: ${mobilePalette.ink};
  font-size: 24px;
  font-weight: 900;
  &::placeholder {
    color: #b0b5bd;
  }
`;

const FieldLabel = styled.label`
  display: block;
  margin: 16px 0 8px;
  color: ${mobilePalette.muted};
  font-size: 13px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.button<{ active: boolean }>`
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${(props) => (props.active ? '#fff2cc' : '#fff')};
  border: 1px solid ${(props) => (props.active ? '#ffd66e' : mobilePalette.line)};
  color: ${(props) => (props.active ? '#775700' : mobilePalette.muted)};
`;

const Bar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 18px;
`;

const Editor: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const isUpdate = !!(state as any)?.isUpdate;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>(DEFAULT_TABLE.apiCategory);
  const [tags, setTags] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const draftKey = id || `article${Date.now()}`;
  const activeTable = useMemo(
    () => MOBILE_TABLES.find((item) => item.apiCategory === category) || DEFAULT_TABLE,
    [category],
  );
  const candidateTags = Array.from(activeTable.tags).filter(
    (tag: string) => tag !== '全部',
  );

  useEffect(() => {
    (async () => {
      if (isUpdate && id) {
        const res = await mobileApi.posts.get(Number(id));
        if (res.code === 0) {
          setTitle(res.data.title || '');
          setContent(res.data.content || '');
          setCategory(res.data.category || DEFAULT_TABLE.apiCategory);
          setTags(res.data.tags || []);
          setSummary(res.data.summary || '');
        }
        return;
      }
      const draft = await Drafts.searchDraft(draftKey);
      if (draft) {
        setTitle(draft.title || '');
        setContent(draft.content || '');
      }
    })();
  }, [draftKey, id, isUpdate]);

  useEffect(() => {
    if (isUpdate || (!title && !content)) return;
    const timer = window.setTimeout(() => {
      Drafts.putDraft(draftKey, {
        title,
        content,
        type: 'md',
        time: moment(Date.now()).format('YYYY年MM月DD日 HH:mm'),
      } as Draft);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [title, content, draftKey, isUpdate]);

  const generatedSummary = () =>
    (
      summary ||
      content
        .replace(/[#>*_`-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    ).slice(0, 100);

  const submit = async () => {
    if (!title.trim()) {
      message.warning('请填写标题');
      return;
    }
    if (!content.trim()) {
      message.warning('请填写正文');
      return;
    }
    if (tags.length === 0) {
      message.warning('请选择至少一个标签');
      return;
    }
    setSubmitting(true);
    const body = {
      title,
      content,
      compiled_content: '',
      content_type: 'md',
      domain: 'normal',
      category,
      summary: generatedSummary(),
      tags,
      ...(isUpdate ? { id: Number(id) } : {}),
    };
    try {
      const res = isUpdate
        ? await mobileApi.posts.update(body)
        : await mobileApi.posts.create(body);
      if (res.code !== 0) {
        message.error(res.message);
        return;
      }
      if (!isUpdate) Drafts.deleteDraft(draftKey);
      message.success(isUpdate ? '更新成功' : '发布成功');
      nav(isUpdate ? `/article/${id}` : `/article/${res.data.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileShell title={isUpdate ? '编辑帖子' : '发布帖子'} back tabs={false}>
      <Wrap>
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入标题"
        />
        <FieldLabel>茶桌</FieldLabel>
        <SegmentTabs
          value={category}
          items={MOBILE_TABLES.map((item) => ({
            label: item.name,
            value: item.apiCategory,
          }))}
          onChange={(value) => {
            setCategory(String(value));
            setTags([]);
          }}
        />
        <FieldLabel>标签</FieldLabel>
        <Tags>
          {candidateTags.map((tag) => (
            <Tag
              key={tag}
              active={tags.includes(tag)}
              onClick={() => {
                if (tags.includes(tag)) {
                  setTags(tags.filter((item) => item !== tag));
                  return;
                }
                if (tags.length >= 2) {
                  message.warning('最多选择两个标签');
                  return;
                }
                setTags([...tags, tag]);
              }}
            >
              {tag}
            </Tag>
          ))}
        </Tags>
        <FieldLabel>正文</FieldLabel>
        <Input.TextArea
          value={content}
          rows={14}
          maxLength={6000}
          showCount
          placeholder="写下你想分享的内容"
          onChange={(event) => setContent(event.target.value)}
        />
        <FieldLabel>摘要</FieldLabel>
        <Input.TextArea
          value={summary}
          rows={3}
          maxLength={100}
          showCount
          placeholder="不填则自动生成"
          onChange={(event) => setSummary(event.target.value)}
        />
        <Bar>
          <GhostButton onClick={() => nav(-1)}>取消</GhostButton>
          <PrimaryButton disabled={submitting} onClick={submit}>
            {submitting ? '提交中...' : isUpdate ? '更新' : '发布'}
          </PrimaryButton>
        </Bar>
      </Wrap>
    </MobileShell>
  );
};

export default Editor;
