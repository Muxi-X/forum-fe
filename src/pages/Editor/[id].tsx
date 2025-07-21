import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDebounceFn, useRequest } from 'ahooks';
import {
  Form,
  Button,
  Radio,
  Select,
  Popover,
  message,
  Tag,
  Input,
  Modal,
  Checkbox,
} from 'antd';
import { IDomEditor } from '@wangeditor/editor';
import Drafts, { Draft, EditorType } from 'utils/db_drafts';
import moment from 'utils/moment';
import useForm from 'hooks/useForm';
import useProfile from 'store/useProfile';
import Avatar from 'components/Avatar/avatar';
import MdEditor from 'components/Editor/MdEditor';
import RtfEditor from 'components/Editor/RtfEditor';
import { CATEGORY } from 'config';
import * as style from './style';
import useDocTitle from 'hooks/useDocTitle';

interface PostProps {
  handlePost: (val: defs.post_CreateRequest) => void;
  content: string;
  category: string;
  oldTags: string[];
  summary: string;
}

const { Option } = Select;
const { TextArea } = Input;
const { useForm: newForm } = Form;
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

const Post: React.FC<PostProps> = ({
  handlePost,
  content,
  oldTags,
  category,
  summary,
}) => {
  const [tags, setTags] = useState<JSX.Element[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [isOnlyTeam, setIsOnlyTeam] = useState(false);
  const {
    userProfile: { role },
  } = useProfile();
  const { run, data: res } = useRequest(API.post.getPostPopular_tag.request, {
    manual: true,
    onSuccess: (res) => {
      if (res.data) {
        const children = res.data.map((tag, i) => <Option key={i}>{tag}</Option>);
        setTags(children);
      } else setTags([]);
    },
  });
  const [form] = newForm();

  const onFinish = (values: defs.post_CreateRequest) => {
    handlePost({ ...values, domain: isOnlyTeam ? 'muxi' : 'normal' });
  };

  const handleChooseTags = (e: string[]) => {
    if (e.length === 2) message.warn('标签已满！');
    setSelectedTags(e);
    setValue('');
  };

  const handleCustomTag = (val: string) => {
    setValue(val);
  };

  const handleSummary = () => {
    let val = content.replace(/<[^>]*>/g, '').replace('\n', ' ');
    val = val.replace(/\r\n/g, ' ');
    val = val.replace(/\n/g, ' ');
    form.setFieldValue('summary', val.slice(0, 100));
  };

  return (
    <Form
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 12 }}
      initialValues={{ category, tags: oldTags, summary }}
      layout="horizontal"
      form={form}
    >
      <Form.Item
        rules={[{ required: true, message: '请给文章选择分类!' }]}
        requiredMark
        label="分类"
        name="category"
        required
      >
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            run({ category: e.target.value });
          }}
        >
          {CATEGORY.map((val, i) => (
            <Radio.Button style={{ margin: 3 }} key={`${i}`} value={val}>
              {val}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
      <style.ItemWrapper>
        <Form.Item
          rules={[{ required: true, message: '请给文章选择标签!' }]}
          label="标签"
          name="tags"
          required
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
            tagRender={tagRender}
            placeholder="最多选择两个标签"
            onChange={handleChooseTags}
            onSearch={handleCustomTag}
            searchValue={value}
            value={selectedTags}
            disabled={selectedTags.length >= 2}
          >
            {tags}
          </Select>
        </Form.Item>
        <Button
          id="tool"
          onClick={() => {
            setSelectedTags([]);
            form.setFieldValue('tags', []);
          }}
        >
          重置标签
        </Button>
      </style.ItemWrapper>
      <style.ItemWrapper>
        <Form.Item
          label="摘要"
          name="summary"
          rules={[{ required: true, message: '请给文章填写摘要!' }]}
        >
          <TextArea
            placeholder="摘要显示在主页用于展示文章的主要信息"
            maxLength={100}
            style={{ height: 100 }}
            showCount
          />
        </Form.Item>
        <Button id="tool" onClick={handleSummary}>
          一键生成摘要
        </Button>
      </style.ItemWrapper>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          发表
        </Button>
        {role?.includes('Normal') ? null : (
          <div>
            <Checkbox
              checked={isOnlyTeam}
              onChange={(e) => {
                setIsOnlyTeam(e.target.checked);
              }}
            />
            是否仅团队内可见
          </div>
        )}
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
  const [submitting, setSubmitting] = useState(false);
  const { state } = useLocation();

  const isUpdate = state ? (state.isUpdate as boolean) : false;

  const profileStore = useProfile();

  const nav = useNavigate();
  const { id: draftId } = useParams();
  const { title, type, content } = form;
  const { run: post } = useRequest(API.post.postPost.request, {
    onSuccess: (res) => {
      message.success('发布成功');
      nav('/result', { state: { type: 'published', id: res.data.id } });
      // 发布成功后删除草稿
      Drafts.deleteDraft(draftId as string);
    },
    manual: true,
  });

  const { run: put } = useRequest(API.post.putPost.request, {
    manual: true,
    onSuccess: () => {
      message.success('更新成功');
      nav('/result', { state: { type: 'updated', id: +(draftId as string) } });
    },
  });

  const { run: get, data: article } = useRequest(API.post.getPostByPost_id.request, {
    manual: true,
    onSuccess: (res) => {
      setFrom({
        title: res.data.title,
        content: res.data.content,
        type: res.data.content_type as EditorType,
      });
    },
  });

  useDocTitle(`落笔生花 - 茶馆`);

  // 首次进入 如果该id是草稿的话直接拿草稿setState
  useEffect(() => {
    (async () => {
      if (isUpdate) get({ post_id: +(draftId as string) });
      else {
        const draft = await Drafts.searchDraft(draftId as string);
        if (!draft) return;
        setFrom({ title: draft.title, content: draft.content, type: draft.type });
      }
    })();
  }, []);

  // 编辑后将数据存入IndexDB中
  useEffect(() => {
    if (isUpdate) return;
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

  const postArticle = (val: defs.post_CreateRequest) => {
    if (submitting) return;
    setSubmitting(true);
    if (!title) {
      message.warn('请填写标题!');
      return;
    }
    if (!content) {
      message.warn('请填写正文内容!');
    }
    if (isUpdate) {
      if (type === 'rtf') {
        put({}, { ...val, title, content, id: +(draftId as string) });
      } else {
        put(
          {},
          {
            ...val,
            title,
            content,
            id: +(draftId as string),
          },
        );
      }
    } else {
      if (type === 'rtf') {
        post({}, { ...val, title, content, content_type: type });
      } else {
        post(
          {},
          {
            ...val,
            title,
            content,
            content_type: type,
            compiled_content: mdToHtml,
          },
        );
      }
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

  let category = '';
  let oldTags: string[] = [];
  let summary = '';
  if (article?.data) {
    category = article?.data.category as string;
    oldTags = article.data.tags as string[];
    summary = article.data.summary as string;
  }

  return (
    <>
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
              loading={false}
            >
              草稿箱
            </Button>
            <Popover
              content={
                <Post
                  handlePost={postArticle}
                  category={category}
                  oldTags={oldTags}
                  summary={summary}
                  content={
                    type === 'md'
                      ? (mdToHtml as string).slice(0, 300)
                      : (content as string).slice(0, 300)
                  }
                />
              }
              trigger="click"
              title={<h2> {isUpdate ? '更新文章' : '发布文章'}</h2>}
              placement="bottomRight"
            >
              <Button type="primary" loading={false}>
                {isUpdate ? '更新文章' : '发布文章'}
              </Button>
            </Popover>
            <style.ToggleEditor
              data-tip={`切换成${type === 'md' ? 'rtf' : 'md'}编辑器`}
              onClick={selectEditor}
            >
              <img
                style={{ height: '100%' }}
                src="https://ossforum.muxixyz.com/default/toggle.svg"
                alt="toggle"
              ></img>
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
    </>
  );
};

export default EditorPage;
