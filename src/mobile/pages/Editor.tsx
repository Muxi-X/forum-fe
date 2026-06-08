import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import {
  FloatingSubmitBar,
  mobileMotion,
  mobilePalette,
  mobileRadius,
  PrimaryButton,
} from '../styles';
import { DEFAULT_TABLE, MOBILE_TABLES } from '../constants';
import { mobileApi } from '../api';
import { emitPostStatPatch } from '../postEvents';
import Drafts, { Draft } from 'utils/db_drafts';
import moment from 'utils/moment';

const MAX_TAG_COUNT = 4;

const Wrap = styled.div`
  min-height: calc(100vh - 52px);
  background: linear-gradient(180deg, #fffaf0 0%, #f7f8fb 34%, #f7f8fb 100%);
  padding: 12px 16px calc(22px + env(safe-area-inset-bottom));
`;

const TitleInput = styled.input`
  width: 100%;
  min-height: 50px;
  margin-top: 8px;
  background: transparent;
  color: ${mobilePalette.ink};
  font-size: 22px;
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
    min-height: 112px;
    padding: 14px 0 0;
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
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 13px;
  border-radius: 999px;
  background: ${(props) =>
    props.active ? 'rgba(255, 198, 65, 0.24)' : 'rgba(255, 255, 255, 0.78)'};
  border: 1px solid
    ${(props) => (props.active ? 'rgba(254, 152, 0, 0.28)' : mobilePalette.lineSoft)};
  color: ${(props) => (props.active ? '#a15a00' : mobilePalette.inkSoft)};
  font-size: 13px;
  font-weight: 700;
  transition: transform ${mobileMotion.fast}, background ${mobileMotion.fast};
  .remove {
    display: ${(props) => (props.active ? 'inline-grid' : 'none')};
    place-items: center;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: rgba(161, 90, 0, 0.12);
    color: rgba(161, 90, 0, 0.72);
    font-size: 13px;
    line-height: 1;
  }
  &:active {
    transform: scale(0.96);
  }
`;

const EditorCard = styled.section`
  padding: 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.06);
  backdrop-filter: blur(18px);
`;

const SectionBlock = styled.section`
  margin-top: 12px;
  padding: 14px 16px;
  margin-bottom: 4px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(60, 60, 67, 0.08);
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.045);
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
  gap: 8px;
  padding-bottom: 2px;
`;

const TableChip = styled.button<{ active: boolean }>`
  min-width: 0;
  height: 36px;
  padding: 0 8px;
  border-radius: 16px;
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
  margin: 8px 0 0;
  color: ${mobilePalette.muted};
  font-size: 12px;
  line-height: 1.5;
`;

const ImageUploadWrap = styled.div`
  margin-top: 12px;
  width: 88px;
  label {
    width: 88px;
    min-height: 88px;
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
    height: 38px;
    padding: 0 14px;
    border: 1px solid rgba(60, 60, 67, 0.14);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.86);
  }
  button {
    flex: 0 0 58px;
    width: 58px;
    height: 38px;
    border-radius: 999px;
    background: linear-gradient(135deg, #ffc641, #fe9800);
    color: #fff;
    border: 0;
    font-size: 13px;
    font-weight: 800;
    &:disabled {
      opacity: 0.45;
    }
  }
`;

const Bar = styled(FloatingSubmitBar)``;

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

  const draftKey = useMemo(() => id || 'mobile-editor-new', [id]);
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

  const contentWithImage = () => {
    const trimmed = content.trimEnd();
    if (!image) return content;
    if (content.includes(image)) return content;
    return `${trimmed}\n\n![](${image})`;
  };

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
    const finalContent = contentWithImage();
    const body = {
      title,
      content: finalContent,
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
      const postId = isUpdate ? Number(id) : Number(res.data.id || 0);
      if (postId) {
        emitPostStatPatch({
          id: postId,
          post: {
            id: postId,
            title,
            content: finalContent,
            summary: generatedSummary(),
            content_type: 'md',
            category,
            time: new Date().toISOString(),
            tags,
            img_url: image,
            images: image ? [image] : [],
            like_num: 0,
            comment_num: 0,
            collection_num: 0,
            is_liked: false,
            is_collection: false,
          },
          created: !isUpdate,
          updated: isUpdate,
        });
      }
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
    if (tags.length >= MAX_TAG_COUNT) {
      message.warning(`最多选择 ${MAX_TAG_COUNT} 个标签`);
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
            <span>
              {tags.length
                ? `${tags.length}/${MAX_TAG_COUNT}`
                : `可选 · 0/${MAX_TAG_COUNT}`}
            </span>
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
                <span className="remove" aria-hidden>
                  ×
                </span>
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
            <button type="submit" disabled={!customTag.trim()}>
              添加
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
