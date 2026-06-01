import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import { mobilePalette, PrimaryButton } from '../styles';
import { DEFAULT_TABLE, MOBILE_TABLES } from '../constants';
import { mobileApi } from '../api';
import { mastergoAssets } from '../assets/mastergo';
import Drafts, { Draft } from 'utils/db_drafts';
import moment from 'utils/moment';

const Wrap = styled.div`
  min-height: calc(100vh - 52px);
  background: ${mobilePalette.paper};
  padding: 0 12px 118px;
`;

const TitleInput = styled.input`
  width: 100%;
  min-height: 58px;
  margin-bottom: 0;
  background: transparent;
  color: ${mobilePalette.ink};
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid #efefef;
  &::placeholder {
    color: #b0b5bd;
  }
`;

const FieldLabel = styled.label`
  display: block;
  margin: 18px 0 10px;
  color: ${mobilePalette.ink};
  font-size: 16px;
  font-weight: 700;
`;

const ContentInput = styled(Input.TextArea)`
  &.ant-input {
    padding: 18px 0 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    color: #1a202c;
    font-size: 15px;
    line-height: 1.62;
    resize: none;
    background: #fff;
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
  gap: 8px;
`;

const Tag = styled.button<{ active: boolean }>`
  height: 31px;
  padding: 0 14px;
  border-radius: 999px;
  background: ${(props) => (props.active ? '#fff2cc' : '#fff')};
  border: 1px solid ${(props) => (props.active ? '#ffd66e' : mobilePalette.line)};
  color: ${(props) => (props.active ? '#775700' : mobilePalette.muted)};
`;

const TablePicker = styled.div`
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: center;
  min-height: 70px;
  border-bottom: 1px solid #efefef;
  .current {
    justify-self: end;
    color: #1a202c;
    font-size: 16px;
  }
`;

const TableChips = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 10px 0 12px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TableChip = styled.button<{ active: boolean }>`
  flex: 0 0 79px;
  height: 31px;
  padding: 0 8px;
  border-radius: 999px;
  background: ${(props) => (props.active ? '#ffc641' : '#fff')};
  border: 1px solid ${(props) => (props.active ? '#ffc641' : '#fe9800')};
  color: ${(props) => (props.active ? '#fff' : '#fe9800')};
  font-size: 12px;
  white-space: nowrap;
`;

const ImageUploadWrap = styled.div`
  margin: 18px 0;
  width: 92px;
  label {
    color: #dedede;
    font-size: 28px;
  }
`;

const CustomTagRow = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  input {
    flex: 1;
    height: 32px;
    padding: 0 12px;
    border: 1px solid #d8d8d8;
    border-radius: 999px;
  }
  button {
    width: 38px;
    height: 32px;
    border-radius: 999px;
    background: #fff8e1;
    color: #fe9800;
    border: 1px solid #ffc641;
    img {
      width: 14px;
      height: 14px;
    }
  }
`;

const Bar = styled.div`
  position: fixed;
  left: 28px;
  right: 28px;
  bottom: calc(34px + env(safe-area-inset-bottom));
  z-index: 20;
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
      message.warning('最多选择四个标签');
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
        <TablePicker>
          <FieldLabel style={{ margin: 0 }}>所在茶桌</FieldLabel>
          <span className="current">{activeTable.name}</span>
        </TablePicker>
        <TableChips>
          {MOBILE_TABLES.slice(0, 5).map((item) => (
            <TableChip
              key={item.key}
              type="button"
              active={category === item.apiCategory}
              onClick={() => {
                setCategory(item.apiCategory);
                setTags([]);
              }}
            >
              {item.name.split(/\s+/)[0]}
            </TableChip>
          ))}
        </TableChips>
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="今日品得一款十年陈年普洱"
        />
        <ContentInput
          value={content}
          rows={7}
          maxLength={6000}
          showCount={false}
          placeholder="东一最好吃东一最好吃东一最好吃东一最好吃东一最好吃..."
          onChange={(event) => setContent(event.target.value)}
        />
        <ImageUploadWrap>
          <UploadField compact iconOnly value={image} onChange={setImage} />
        </ImageUploadWrap>
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
            placeholder="自定义标签"
            onChange={(event) => setCustomTag(event.target.value)}
          />
          <button type="submit" aria-label="添加标签">
            <img src={mastergoAssets.icons.addSmall} alt="" />
          </button>
        </CustomTagRow>
        <Bar>
          <PrimaryButton style={{ width: '100%' }} disabled={submitting} onClick={submit}>
            {submitting ? '提交中...' : isUpdate ? '更新' : '发布'}
          </PrimaryButton>
        </Bar>
      </Wrap>
    </MobileShell>
  );
};

export default Editor;
