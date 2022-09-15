import React, { useEffect, useState } from 'react';
import { IDomEditor } from '@wangeditor/editor';
import { useParams, useNavigate } from 'react-router-dom';
import { useDebounceFn, useRequest } from 'ahooks';
import { Form, Button, Radio, Select, Popover, message } from 'antd';
import { putDraft, searchDraft } from 'utils/db_drafts';
import useForm from 'hooks/useForm';
import Avatar from 'components/Avatar/avatar';
import MdEditor from 'components/Editor/MdEditor';
import RtfEditor from 'components/Editor/RtfEditor';
import { CATEGORY } from 'config';
import toggle from 'assets/svg/toggle.svg';
import * as style from './style';

export type EditorType = 'rtf' | 'md';

export interface Drafts {
  title: string;
  content: string;
  type: EditorType;
}

interface PostProps {
  handlePost: (val: PostInfo) => void;
}

interface PostInfo {
  category: string;
  tags: string[];
}

const { Option } = Select;

const children: React.ReactNode[] = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const Post: React.FC<PostProps> = ({ handlePost }) => {
  const onFinish = (values: PostInfo) => {
    handlePost(values);
  };
  return (
    <Form
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 12 }}
      layout="horizontal"
    >
      <Form.Item label="分类" name="category" required>
        <Radio.Group optionType="button" buttonStyle="solid">
          {CATEGORY.map((val, i) => (
            <Radio.Button style={{ margin: 3 }} key={`${i}`} value={`${i}`}>
              {val}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="标签" name="tags" required>
        <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
          {children}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          发表
        </Button>
      </Form.Item>
    </Form>
  );
};

const EditorPage: React.FC = () => {
  const [form, setFrom] = useForm<Drafts>({ title: '', content: '', type: 'md' }); // Draft表单状态
  const [saveBoolean, setSaveBoolean] = useState<'' | boolean>(''); // 显示是否正在保存中
  const [visible, setVisible] = useState(false);
  const nav = useNavigate();
  const { id: draftId } = useParams();
  const { title, type, content } = form;

  const { run } = useRequest(API.post.postPost.request, {
    onSuccess: () => {
      message.success('发布成功');
      nav('/');
    },
    manual: true,
  });

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

  const postArticle = (val: PostInfo) => {
    run({}, { ...val, title, content, type_name: 'normal', content_type: type });
  };

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

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
    <style.EditorPageWrapper>
      <style.Header>
        <style.TitleInput
          value={title}
          onChange={(e) => {
            setFrom('title', e.target.value);
            setSaveBoolean(true);
          }}
          placeholder="请输入文章标题..."
        />
        <style.RightBox
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
          <Popover
            content={<Post handlePost={postArticle} />}
            trigger="click"
            title={<h2>发布文章</h2>}
            placement="bottomRight"
            visible={visible}
            onVisibleChange={handleVisibleChange}
          >
            <Button type="primary">发布文章</Button>
          </Popover>
          <style.ToggleEditor
            data-tip={`切换成${type === 'md' ? 'rtf' : 'md'}编辑器`}
            onClick={selectEditor}
          >
            <img style={{ height: '100%' }} src={toggle} alt="toggle"></img>
          </style.ToggleEditor>
          <Avatar />
        </style.RightBox>
      </style.Header>
      <style.EditorWrapper>
        {type === 'rtf' ? (
          <RtfEditor editorContent={content} handleEditorContent={handleEditorContent} />
        ) : (
          <MdEditor editorContent={content} handleEditorContent={handleEditorContent} />
        )}
      </style.EditorWrapper>
    </style.EditorPageWrapper>
  );
};

export default EditorPage;
