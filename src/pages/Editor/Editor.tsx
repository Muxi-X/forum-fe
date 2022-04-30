import React, { useEffect, useState, useCallback } from 'react';
import { IDomEditor } from '@wangeditor/editor';
import { useParams, useNavigate } from 'react-router-dom';

import debounce from 'utils/debounce';
import { putDraft, searchDraft } from 'db/db';
import useForm from 'hooks/useForm';

import Avatar from 'components/Avatar/avatar';
import MdEditor from 'components/Editor/MdEditor';
import RtfEditor from 'components/Editor/RtfEditor';
import Button from 'components/Button/button';

import {
  EditorPageWrapper,
  EditorWrapper,
  Header,
  TitleInput,
  RightBox,
  ToggleEditor,
} from './style';
import toggle from 'assets/svg/toggle.svg';

export type EditorType = 'rtf' | 'md';

export interface Drafts {
  title: string;
  content: string;
  // tag: string;
  // category: string;
  type: EditorType;
}

const EditorPage: React.FC = () => {
  const [form, setFrom] = useForm<Drafts>({ title: '', content: '', type: 'rtf' }); // Draft表单状态
  const [saveBoolean, setSaveBoolean] = useState<'' | boolean>(''); // 显示是否正在保存中

  const nav = useNavigate();
  const { id: draftId } = useParams();
  const { title, type, content } = form;

  // 更新草稿 不用useCallback的话无法使用防抖
  const putDraftData = useCallback(
    debounce((id: string, form: Drafts) => {
      putDraft(id, form);

      setSaveBoolean(false);
    }, 1000),
    [],
  );

  // 切换编辑器
  const selectEditor = () => {
    alert('确定要替换吗');
    type === 'rtf'
      ? setFrom({ title: '', content: '', type: 'md' })
      : setFrom({ title: '', content: '', type: 'rtf' });
    nav(`/editor/drafts/new__${new Date().getTime()}`); // 用nav跳转 拿到新id 开启新草稿
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
    <EditorPageWrapper>
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
          <ToggleEditor
            data-tip={`切换成${type === 'md' ? 'rtf' : 'md'}编辑器`}
            onClick={selectEditor}
          >
            <img style={{ height: '100%' }} src={toggle} alt="toggle"></img>
          </ToggleEditor>
          <Button>发布</Button>
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
