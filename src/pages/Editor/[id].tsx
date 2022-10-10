import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDebounceFn, useRequest } from 'ahooks';
import { Form, Button, Radio, Select, Popover, message, Tag, Input, Modal } from 'antd';
import { IDomEditor } from '@wangeditor/editor';
import Drafts, { Draft, EditorType } from 'utils/db_drafts';
import moment from 'utils/moment';
import useForm from 'hooks/useForm';
import useProfile from 'store/useProfile';
import Avatar from 'components/Avatar/avatar';
import MdEditor from 'components/Editor/MdEditor';
import RtfEditor from 'components/Editor/RtfEditor';
import { CATEGORY } from 'config';
import toggle from 'assets/svg/toggle.svg';
import * as style from './style';

interface PostProps {
  handlePost: (val: PostInfo) => void;
  content: string;
}

interface PostInfo {
  category: string;
  tags: string[];
  summay: string;
}

const { Option } = Select;
const { TextArea } = Input;
const tagRender = (props: any) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={'gold'}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const children: React.ReactNode[] = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const Post: React.FC<PostProps> = ({ handlePost, content }) => {
  const [tags, setTags] = useState(children);
  const onFinish = (values: PostInfo) => {
    handlePost(values);
  };

  const handleChooseTags = (e: string) => {
    if (e.length === 2) {
      setTags([]);
      message.warn('标签已满', 1);
    } else {
      setTags(children);
    }
  };
  return (
    <Form
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 12 }}
      layout="horizontal"
    >
      <Form.Item
        rules={[{ required: true, message: '请给文章选择分类!' }]}
        requiredMark
        label="分类"
        name="category"
        required
      >
        <Radio.Group optionType="button" buttonStyle="solid">
          {CATEGORY.map((val, i) => (
            <Radio.Button style={{ margin: 3 }} key={`${i}`} value={val}>
              {val}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: '请给文章选择标签!' }]}
        label="标签"
        name="tags"
        required
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          tokenSeparators={[',']}
          tagRender={tagRender}
          placeholder="最多选择两个标签"
          onChange={handleChooseTags}
        >
          {tags}
        </Select>
      </Form.Item>
      <Form.Item
        label="摘要"
        name="summary"
        rules={[{ required: true, message: '请给文章填写摘要!' }]}
      >
        <TextArea
          placeholder="摘要会显示在主页用于展示文章的主要信息"
          maxLength={100}
          showCount
        />
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
  const {
    userProfile: { id: userId },
  } = useProfile();
  const [form, setFrom] = useForm<Partial<Draft>>({
    title: '',
    content: '',
    type:
      localStorage.getItem('editorType') === null
        ? 'md'
        : (localStorage.getItem('editorType') as EditorType),
  }); // Draft表单状态
  const [saveBoolean, setSaveBoolean] = useState<'' | boolean>(''); // 显示是否正在保存中
  const [mdToHtml, setMdToHtml] = useState(''); // 存储Markdown下的html内容
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileStore = useProfile();

  const nav = useNavigate();
  const { id: draftId } = useParams();
  const { title, type, content } = form;
  const { run: post } = useRequest(API.post.postPost.request, {
    onSuccess: () => {
      message.success('发布成功');
      nav('/result', { state: { type: 'published' } });
    },
    manual: true,
  });

  // 首次进入 如果该id是草稿的话直接拿草稿setState
  useEffect(() => {
    (async () => {
      const draft = await Drafts.searchDraft(draftId as string);
      if (!draft) return;
      setFrom({ title: draft.title, content: draft.content, type: draft.type });
    })();
  }, []);

  // 编辑后将数据存入IndexDB中
  useEffect(() => {
    if (!title && !content) return;
    putDraftData(draftId, form);
  }, [content, title]);

  // 更新草稿 不用useCallback的话无法使用防抖
  const { run: putDraftData } = useDebounceFn(
    (id: string, form: Draft) => {
      Drafts.putDraft(id, {
        ...form,
        userId,
        time: moment(new Date().getTime()).format('YYYY年MM月DD日 HH:mm'),
      });
      setSaveBoolean(false);
    },
    {
      wait: 1000,
    },
  );

  const postArticle = (val: PostInfo) => {
    if (!title) {
      message.warn('请填写标题!');
      return;
    }
    if (!content) {
      message.warn('请填写正文内容!');
    }
    if (type === 'rtf') {
      post({}, { ...val, title, content, type_name: 'normal', content_type: type });
    } else {
      post(
        {},
        {
          ...val,
          title,
          content,
          type_name: 'normal',
          content_type: type,
          compiled_content: mdToHtml,
        },
      );
    }
  };

  // 切换编辑器
  const selectEditor = () => {
    setIsModalOpen(true);
  };

  // 编辑器内容受控 编辑时读入草稿
  const handleEditorContent = (editor: IDomEditor | string) => {
    if (typeof editor !== 'string' && editor.getHtml() == '<p><br></p>') return; // Rtf下会直接调用该函数并存入 '<p><br></p>' 故用if 除开
    typeof editor == 'string'
      ? setFrom('content', editor)
      : setFrom('content', editor.getHtml());

    setSaveBoolean(true);
  };

  const handleOk = () => {
    if (type === 'rtf') {
      setFrom({ title: '', content: '', type: 'md' });
      localStorage.setItem('editorType', 'md');
    } else {
      setFrom({ title: '', content: '', type: 'rtf' });
      localStorage.setItem('editorType', 'rtf');
    }
    message.success(type === 'rtf' ? 'markdown编辑器' : '富文本编辑器', 1);
    setIsModalOpen(false);
    nav(`/editor/article${new Date().getTime()}`); // 用nav跳转 拿到新id 开启新草稿
  };

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
              nav(`/user/${userId}/drafts`);
            }}
          >
            草稿箱
          </Button>
          <Popover
            content={<Post handlePost={postArticle} content={content as string} />}
            trigger="click"
            title={<h2>发布文章</h2>}
            placement="bottomRight"
          >
            <Button type="primary">发布文章</Button>
          </Popover>
          <style.ToggleEditor
            data-tip={`切换成${type === 'md' ? 'rtf' : 'md'}编辑器`}
            onClick={selectEditor}
          >
            <img style={{ height: '100%' }} src={toggle} alt="toggle"></img>
          </style.ToggleEditor>
          <Avatar userId={userId} src={profileStore.userProfile.avatar as string} />
        </style.RightBox>
      </style.Header>
      <style.EditorWrapper>
        {type === 'rtf' ? (
          <RtfEditor
            token={profileStore.qiniuToken}
            editorContent={content as string}
            handleEditorContent={handleEditorContent}
          />
        ) : (
          <MdEditor
            token={profileStore.qiniuToken}
            editorContent={content as string}
            handleEditorContent={handleEditorContent}
            onHtmlChanged={(e) => {
              setMdToHtml(e);
            }}
          />
        )}
      </style.EditorWrapper>
      <Modal
        centered
        title={`切换为${type === 'md' ? '富文本' : 'Markdown'}编辑器`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>切换写作模式后，当前内容不会迁移，但会自动保存为草稿。</p>
      </Modal>
    </style.EditorPageWrapper>
  );
};

export default EditorPage;
