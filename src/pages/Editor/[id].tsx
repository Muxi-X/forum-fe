import React, { useEffect, useState } from 'react';
import { IDomEditor } from '@wangeditor/editor';
import { useParams, useNavigate } from 'react-router-dom';
import { useDebounceFn } from 'ahooks';
import { Button, Card } from 'antd';
import { putDraft, searchDraft } from 'utils/db_drafts';
import useForm from 'hooks/useForm';
import Avatar from 'components/Avatar/avatar';
import MdEditor from 'components/Editor/MdEditor';
import RtfEditor from 'components/Editor/RtfEditor';
import Tag from 'components/Tag/tag';
import {
  EditorPageWrapper,
  EditorWrapper,
  Header,
  TitleInput,
  RightBox,
  ToggleEditor,
} from './style';
import styled from 'styled-components';
import toggle from 'assets/svg/toggle.svg';

export type EditorType = 'rtf' | 'md';

export interface Drafts {
  title: string;
  content: string;
  // tag: string;
  // category: string;
  type: EditorType;
}

interface ShowStyle {
  showCard: boolean;
}

const SurePost = styled.div`
  position: relative;
`;

const PostCard = styled.div<ShowStyle>`
  position: absolute;
  z-index: 999;
  display: ${(props) => (props.showCard ? 'block' : 'none')};
`;

const Tags = ['运动', '交友', '摄影', '动漫', '游戏', '校园', '生活', '美食'];

const EditorPage: React.FC = () => {
  const [form, setFrom] = useForm<Drafts>({ title: '', content: '', type: 'md' }); // Draft表单状态
  const [saveBoolean, setSaveBoolean] = useState<'' | boolean>(''); // 显示是否正在保存中
  const [tid, setTag] = useState<number>();
  const [showCard, setShow] = useState(false);
  const nav = useNavigate();
  const { id: draftId } = useParams();
  const { title, type, content } = form;

  // 更新草稿 不用useCallback的话无法使用防抖
  const { run: putDraftData } = useDebounceFn(
    (id: string, form: Drafts) => {
      putDraft(id, form);
      setSaveBoolean(false);
    },
    {
      wait: 1000,
    },
  );

  const postArticle = () => {
    // const id = localStorage.getItem('id');
    // Service.addArt(tid, id, form.title, form.content).then((res: any) => {
    //   if (res.result) nav('/');
    // });
    // setShow(false);
  };

  const handleTag = (tid: number) => {
    setTag(tid);
  };

  const Post = (
    <PostCard showCard={showCard}>
      <Card>
        <p>请选择标签</p>
        {Tags.map((tag, i) => (
          <Tag
            tag={tag}
            key={i}
            onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
              e.stopPropagation();
              handleTag(i);
            }}
            trigger={i === tid}
          />
        ))}
        <br />
        <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '2em' }}>
          <Button type="primary" onClick={postArticle}>
            确认发布
          </Button>
        </div>
      </Card>
    </PostCard>
  );

  // 切换编辑器
  const selectEditor = () => {
    alert('确定要替换吗');
    type === 'rtf'
      ? setFrom({ title: '', content: '', type: 'md' })
      : setFrom({ title: '', content: '', type: 'rtf' });
    nav(`/editor/article${new Date().getTime()}`); // 用nav跳转 拿到新id 开启新草稿
  };

  // 编辑器内容受控 编辑时读入草稿
  const handleEditorContent = (editor: IDomEditor | string) => {
    if (typeof editor !== 'string' && editor.getHtml() == '<p><br></p>') return; // Rtf下会直接调用该函数并存入 '<p><br></p>' 故用if 除开
    typeof editor == 'string'
      ? setFrom('content', editor)
      : setFrom('content', editor.getHtml());

    setSaveBoolean(true);
  };

  // 首次进入 如果该id是草稿的话直接拿草稿setState
  useEffect(() => {
    (async () => {
      const draft = await searchDraft(draftId as string);
      if (!draft) return;
      setFrom({ title: draft.title, content: draft.content, type: draft.type });
    })();
  }, []);

  // 编辑后将数据存入IndexDB中
  useEffect(() => {
    if (!title && !content) return;
    putDraftData(draftId, form);
  }, [content, title]);

  return (
    <EditorPageWrapper onClick={() => setShow(false)}>
      <Header>
        <TitleInput
          value={title}
          onChange={(e) => {
            setFrom('title', e.target.value);
            setSaveBoolean(true);
          }}
          placeholder="请输入文章标题..."
        />
        <RightBox
          data-save={
            saveBoolean === ''
              ? '文章内容自动存入草稿箱'
              : saveBoolean
              ? '输入中...'
              : '保存完成'
          }
        >
          <Button
            onClick={() => {
              nav('/user/drafts');
            }}
          >
            草稿箱
          </Button>
          <SurePost>
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                setShow(true);
              }}
            >
              发布文章
            </Button>
            {Post}
          </SurePost>
          <ToggleEditor
            data-tip={`切换成${type === 'md' ? 'rtf' : 'md'}编辑器`}
            onClick={selectEditor}
          >
            <img style={{ height: '100%' }} src={toggle} alt="toggle"></img>
          </ToggleEditor>
          <Avatar />
        </RightBox>
      </Header>
      <EditorWrapper>
        {type === 'rtf' ? (
          <RtfEditor editorContent={content} handleEditorContent={handleEditorContent} />
        ) : (
          <MdEditor editorContent={content} handleEditorContent={handleEditorContent} />
        )}
      </EditorWrapper>
    </EditorPageWrapper>
  );
};

export default EditorPage;
