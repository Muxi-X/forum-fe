import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Comment, Form, Input, List } from 'antd';
import Avatar from 'components/Avatar/avatar';
import { LikeFilled, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import moment from 'utils/moment';
import useProfile from 'store/useProfile';
import useRequest from 'hooks/useRequest';
import * as style from './style';

const { TextArea } = Input;

type commentType = 'comment' | 'subComment';

interface IProps {
  commentList: defs.post_SubPost[];
  post_id: number;
}

interface EditorProps {
  onSubmit: () => void;
  autoFocus?: boolean;
  isSub?: boolean;
  reply?: boolean;
  content: string;
  submitting: boolean;
  setReply?: Function;
  setContent: Function;
  setSubmitting: Function;
}

interface CommentItemProps extends defs.post_Comment, defs.post_SubPost {
  replyName?: string | undefined;
  commentType?: commentType;
  post_id: number;
}

const SubList: React.FC<{ subComments: defs.post_Comment[]; post_id: number }> = ({
  subComments,
  post_id,
}) => {
  const { run } = useRequest(API.comment.postComment.request, {
    manual: true,
    onSuccess: (res) => {},
  });

  const handleSubmit = (
    value: string,
    runBody: typeof API.comment.postComment.request,
  ) => {
    if (!value) return;
    runBody({}, { ...runBody });
  };
  return (
    <style.SubComments>
      {subComments.map((sub) => (
        <CommentItem {...sub} key={sub.id} commentType={'subComment'} post_id={post_id} />
      ))}
    </style.SubComments>
  );
};

const ReplayList: React.FC = () => {
  return <></>;
};

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  comments,
  creator_avatar,
  time,
  creator_name,
  commentType = 'comment',
  post_id,
}) => {
  const [likes, setLikes] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [reply, setReply] = useState(false);
  const { run } = useRequest(API.comment.postComment.request, {
    manual: true,
  });

  const handleLike = () => {
    if (action === 'liked') {
      setLikes(0);
      setAction(null);
    } else {
      setLikes(1);
      setAction('liked');
    }
  };

  const handleReply = () => {
    setReply(!reply);
    setValue('');
  };

  const handleSubmit = () => {
    // run({})
  };

  const actions = [
    <>
      <style.CommentBack onClick={handleLike}>
        {React.createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
        <style.Number className="comment-action">{likes}</style.Number>
      </style.CommentBack>
      <style.CommentBack
        onClick={(e) => {
          e.stopPropagation();
          e.defaultPrevented = true;
          handleReply();
        }}
      >
        <MessageOutlined />
        <style.Number className="comment-action">
          {reply ? '取消回复' : '回复'}
        </style.Number>
      </style.CommentBack>
    </>,
  ];

  const getCommnets = () => {
    switch (commentType) {
      case 'comment':
        return <SubList subComments={comments ? comments : []} post_id={post_id} />;
      default:
        return <SubList subComments={comments ? comments : []} post_id={post_id} />;
    }
  };

  return (
    <Comment
      actions={actions}
      content={content}
      datetime={moment(time).fromNow()}
      author={creator_name}
      avatar={<Avatar src={creator_avatar} userId={id} />}
    >
      {reply ? (
        <div style={{ height: 'fit-content', marginBottom: '20px' }}>
          <Editor
            content={value}
            setContent={setValue}
            submitting={submitting}
            setSubmitting={setSubmitting}
            onSubmit={handleSubmit}
            reply={reply}
            setReply={setReply}
          />
        </div>
      ) : null}
      {getCommnets()}
    </Comment>
  );
};

// 一级
const CommentList: React.FC<{
  comments: defs.post_SubPost[];
  post_id: number;
}> = ({ comments, post_id }) => {
  return (
    <List
      dataSource={comments}
      header={`全部评论`}
      itemLayout="horizontal"
      renderItem={(props) => (
        <CommentItem {...props} commentType={'comment'} post_id={post_id} />
      )}
    />
  );
};

const Editor = ({
  onSubmit,
  content,
  submitting,
  autoFocus = false,
  isSub = false,
  reply,
  setReply,
  setContent,
  setSubmitting,
}: EditorProps) => {
  const [focus, setFocus] = useState(reply);

  const textareaStyle =
    content || (focus && !submitting)
      ? {
          borderColor: '#40a9ff',
          boxShadow: '0 0 0 2px rgb(24 144 255 / 20%)',
          borderRightWidth: '1px',
          outline: 0,
          backgroundColor: 'white',
        }
      : {};

  const handleOnBlur = () => {
    console.log(content);
    if (content) return;
    // 关于事件调用顺序
    setTimeout(() => {
      console.log(submitting);
      if (submitting) {
        setSubmitting(false);
        return;
      }
      setFocus(false);
      setReply && setReply(false);
      setContent('');
    });
  };

  const handleOnFocus = () => {
    setFocus(true);
  };

  const handleSubmit = () => {
    if (!content) return;
    setSubmitting(true);
    onSubmit();
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ctrlKey = e.ctrlKey || e.metaKey;
    if (ctrlKey && e.key === 'Enter') onSubmit();
  };

  return (
    <div style={isSub ? { display: content || focus ? 'block' : 'none' } : {}}>
      <Form.Item>
        <TextArea
          autoFocus={autoFocus}
          style={{ ...textareaStyle }}
          placeholder={
            /windows|win32/i.test(navigator.userAgent)
              ? '按 CTRL+ENTER 发送'
              : '按 CMD+ENTER 发送'
          }
          rows={4}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onKeyDown={handleOnKeyDown}
          value={content}
        />
      </Form.Item>
      {content || focus ? (
        <Form.Item>
          <Button
            style={{ position: 'absolute', right: 0, top: '10px' }}
            htmlType="submit"
            loading={submitting}
            onMouseDown={() => {
              setSubmitting(true);
              handleSubmit();
            }}
            disabled={content === ''}
            type="primary"
          >
            评论
          </Button>
        </Form.Item>
      ) : null}
    </div>
  );
};

const CommentCp = (props: IProps, ref: any) => {
  const { commentList, post_id } = props;
  const [comments, setComments] = useState<defs.post_SubPost[]>(
    commentList ? commentList : [],
  );

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    userProfile: { avatar, name },
  } = useProfile();

  const { run } = useRequest(API.comment.postComment.request, {
    manual: true,
    onSuccess: (res) => {
      setTimeout(() => {
        setComments([...comments, res.data]);
        setContent('');
        setSubmitting(false);
        setTimeout(() => {
          window.scrollBy({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
      }, 500);
    },
  });

  const handleSubmit = () => {
    run({}, { content, post_id, father_id: post_id, type_name: 'sub-post' });
  };

  return (
    <style.Wrapper ref={ref}>
      <h2>评论区</h2>
      <Comment
        avatar={<Avatar src={avatar} />}
        author={name}
        content={
          <Editor
            content={content}
            setContent={setContent}
            submitting={submitting}
            setSubmitting={setSubmitting}
            onSubmit={handleSubmit}
          />
        }
      />
      {comments.length > 0 && <CommentList comments={comments} post_id={post_id} />}
    </style.Wrapper>
  );
};

const CommentWithRef = React.forwardRef(CommentCp);

export default CommentWithRef;
