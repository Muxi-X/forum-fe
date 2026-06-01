import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import { mobilePalette, PrimaryButton, mobileRadius } from '../styles';
import { DEFAULT_TABLE, MOBILE_TABLES } from '../constants';
import { mobileApi } from '../api';
import { mastergoAssets } from '../assets/mastergo';
import Drafts, { Draft } from 'utils/db_drafts';
import moment from 'utils/moment';

const Wrap = styled.div`
  min-height: calc(100vh - 52px);
  background: linear-gradient(180deg, #fffaf0 0%, #f7f8fb 34%, #f7f8fb 100%);
  padding: 14px 16px 168px;
`;

const TitleInput = styled.input`
  width: 100%;
  min-height: 52px;
  margin-top: 4px;
  background: transparent;
  color: ${mobilePalette.ink};
  font-size: 20px;
  font-weight: 800;
  border-bottom: 1px solid rgba(60, 60, 67, 0.1);
  &::placeholder {
    color: #b3b7bf;
  }
`;

const FieldLabel = styled.label`
  display: block;
  margin: 0;
  color: ${mobilePalette.ink};
  font-size: 13px;
  font-weight: 800;
`;

const ContentInput = styled(Input.TextArea)`
  &.ant-input {
    min-height: 202px;
    padding: 18px 0 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    color: #1a202c;
    font-size: 15px;
    line-height: 1.62;
    resize: none;
    background: transparent;
  }
  &.ant-input:focus {
    border: 0;
    box-shadow: none;
  }
  &.ant-input::placeholder {
    color: #9ca3af;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.button<{ active: boolean }>`
  height: 31px;
  padding: 0 13px;
  border-radius: 999px;
  background: ${(props) =>
    props.active ? 'rgba(255, 198, 65, 0.24)' : 'rgba(255, 255, 255, 0.78)'};
  border: 1px solid
    ${(props) => (props.active ? 'rgba(254, 152, 0, 0.28)' : mobilePalette.lineSoft)};
  color: ${(props) => (props.active ? '#a15a00' : mobilePalette.muted)};
  font-size: 13px;
`;

const EditorCard = styled.section`
  padding: 16px 16px 18px;
  border-radius: ${mobileRadius.xl};
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.06);
  backdrop-filter: blur(18px);
`;

const SectionBlock = styled.section`
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: ${mobileRadius.lg};
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(60, 60, 67, 0.08);
`;

const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  span {
    color: ${mobilePalette.muted};
    font-size: 12px;
  }
`;

const TableChips = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  padding-bottom: 2px;
`;

const TableChip = styled.button<{ active: boolean }>`
  min-width: 0;
  height: 36px;
  padding: 0 8px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) =>
    props.active ? 'linear-gradient(135deg, #ffc641, #fe9800)' : 'rgba(255,255,255,0.9)'};
  border: 1px solid
    ${(props) => (props.active ? 'transparent' : 'rgba(254, 152, 0, 0.2)')};
  color: ${(props) => (props.active ? '#fff' : '#b36200')};
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: ${(props) => (props.active ? '0 8px 16px rgba(254, 152, 0, 0.2)' : 'none')};
`;

const Helper = styled.p`
  margin: 10px 0 0;
  color: ${mobilePalette.muted};
  font-size: 12px;
  line-height: 1.5;
`;

const ImageUploadWrap = styled.div`
  margin-top: 12px;
  width: 72px;
  label {
    width: 72px;
    min-height: 72px;
    color: #dedede;
    font-size: 28px;
  }
`;

const CustomTagRow = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  input {
    flex: 1;
    min-width: 0;
    height: 36px;
    padding: 0 14px;
    border: 1px solid rgba(60, 60, 67, 0.14);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.86);
  }
  button {
    flex: 0 0 38px;
    width: 38px;
    height: 36px;
    border-radius: 999px;
    background: rgba(255, 248, 225, 0.9);
    color: #fe9800;
    border: 1px solid rgba(255, 198, 65, 0.9);
    img {
      width: 14px;
      height: 14px;
    }
  }
`;

const Bar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  max-width: 520px;
  margin: 0 auto;
  bottom: 0;
  z-index: 20;
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.82);
  border-top: 1px solid rgba(60, 60, 67, 0.08);
  backdrop-filter: blur(20px);
  button {
    width: 100%;
  }
`;

const Editor: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const isUpdate = !!(state as any)?.isUpdate;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>(
    (state as any)?.category || DEFAULT_TABLE.apiCategory,
  );
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [image, setImage] = useState('');
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
          setImage('');
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
      img_url: image,
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

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((item) => item !== tag));
      return;
    }
    if (tags.length >= 4) {
      message.warning('最多选择 4 个标签');
      return;
    }
    setTags([...tags, tag]);
  };

  const addCustomTag = () => {
    const next = customTag.replace(/^#/, '').trim();
    if (!next) return;
    if (next.length > 12) {
      message.warning('标签最多 12 个字');
      return;
    }
    toggleTag(next);
    setCustomTag('');
  };

  return (
    <MobileShell title={isUpdate ? '编辑帖子' : '发布帖子'} back tabs={false}>
      <Wrap>
        <EditorCard>
          <SectionHead>
            <FieldLabel>茶桌</FieldLabel>
            <span>{activeTable.intro}</span>
          </SectionHead>
          <TableChips>
            {MOBILE_TABLES.map((item) => (
              <TableChip
                key={item.key}
                type="button"
                active={category === item.apiCategory}
                onClick={() => {
                  setCategory(item.apiCategory);
                  setTags([]);
                }}
              >
                {item.name}
              </TableChip>
            ))}
          </TableChips>
          <TitleInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            placeholder="标题"
          />
          <ContentInput
            value={content}
            rows={7}
            maxLength={6000}
            showCount={false}
            placeholder="分享想法、提问、记录一件事..."
            onChange={(event) => setContent(event.target.value)}
          />
          <Helper>{content.length}/6000 · 发布后自动生成摘要</Helper>
          <ImageUploadWrap>
            <UploadField compact iconOnly value={image} onChange={setImage} />
          </ImageUploadWrap>
        </EditorCard>
        <SectionBlock>
          <SectionHead>
            <FieldLabel>标签</FieldLabel>
            <span>最多 4 个</span>
          </SectionHead>
          <Tags>
            {[...new Set([...candidateTags, ...tags])].map((tag) => (
              <Tag
                key={tag}
                type="button"
                active={tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Tag>
            ))}
          </Tags>
          <CustomTagRow
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
            <button type="submit" aria-label="添加标签">
              <img src={mastergoAssets.icons.addSmall} alt="" />
            </button>
          </CustomTagRow>
        </SectionBlock>
        <Bar>
          <PrimaryButton disabled={submitting} onClick={submit}>
            {submitting ? '提交中...' : isUpdate ? '更新' : '发布'}
          </PrimaryButton>
        </Bar>
      </Wrap>
    </MobileShell>
  );
};

export default Editor;
