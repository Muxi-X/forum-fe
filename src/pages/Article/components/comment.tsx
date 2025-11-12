import React, { useEffect, useState } from 'react';
import { Button, Comment, Form, Input, List, message, Image } from 'antd';
import qiniupload, { observer, CompleteRes } from 'utils/qiniup';
import { QiniuServer } from 'config';
import Avatar from 'components/Avatar/avatar';
import {
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  CloseSquareFilled,
  createFromIconfontCN,
} from '@ant-design/icons';
import moment from 'utils/moment';
import useProfile from 'store/useProfile';
import useRequest from 'hooks/useRequest';
import { sizes } from 'styles/media';
import * as style from './style';

const { TextArea } = Input;

type commentType = 'comment' | 'subComment' | 'reply';

interface IProps {
  commentList: defs.post_SubPost[];
  post_id: number;
  handleAddComment: (num: number, content?: string, comment_id?: number) => void;
  commentNum: number;
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
  handleUpload: (src: string) => void;
  hasImg: boolean;
}

interface CommentItemProps extends defs.post_Comment, defs.post_SubPost {
  replyName?: string | undefined;
  commentType?: commentType;
  post_id: number;
  addReply?: (reply: defs.post_Comment) => void;
  handleAddComment: (num: number, content?: string, comment_id?: number) => void;
  commentNum: number;
}

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3699573_vczcgw5jf6p.js',
});

const SubList: React.FC<{
  subComments: defs.post_Comment[];
  post_id: number;
  syncSubComments: (subs: defs.post_Comment[]) => void;
  handleAddComment: (num: number, content?: string, comment_id?: number) => void;
  commentNum: number;
}> = ({ subComments, post_id, syncSubComments, commentNum, handleAddComment }) => {
  if (subComments.length === 0) return <></>;
  const [replies, setReplies] = useState(subComments);
  const handleReply = (reply: defs.post_Comment) => {
    setReplies([...replies, reply]);
  };

  const subLen = subComments.length;
  const rLen = replies.length;

  useEffect(() => {
    if (subLen !== rLen) {
      if (subLen > rLen) {
        setReplies(subComments);
      } else {
        syncSubComments(replies);
      }
    }
  }, [subComments, replies]);

  return (
    <style.SubComments>
      {replies.map((reply) => {
        return (
          <CommentItem
            {...reply}
            key={reply.id}
            commentType="subComment"
            post_id={post_id}
            addReply={handleReply}
            commentNum={commentNum}
            handleAddComment={handleAddComment}
          />
        );
      })}
    </style.SubComments>
  );
};

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  comments,
  creator_avatar,
  creator_id,
  time,
  is_liked,
  like_num,
  comment_num,
  creator_name,
  commentType = 'comment',
  post_id,
  be_replied_content,
  be_replied_user_name,
  addReply,
  commentNum,
  handleAddComment,
  img_url,
}) => {
  const [likes, setLikes] = useState(like_num as number);
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(is_liked);
  const [subComments, setSubComments] = useState(comments ? comments : []);
  const [replyContent, setReplyContent] = useState('');
  const [reply, setReply] = useState(false);
  const [img, setImg] = useState('');
  const [replyInfo, setReplyInfo] = useState({
    content: be_replied_content,
    name: be_replied_user_name,
  });
  // 这里的run处理子评论，根评论的发送逻辑在下面
  const { run } = useRequest(API.comment.postComment.request, {
    manual: true,
    onSuccess: (res) => {
      setTimeout(() => {
        if (commentType === 'comment') {
          setSubComments([...subComments, res.data]);
          setReplyContent('');
          setSubmitting(false);
          setReply(false);
        } else {
          setReplyContent('');
          setSubmitting(false);
          setReply(false);
          addReply && addReply(res.data);
        }
        handleAddComment(commentNum + 1, replyContent, id);
        setImg('');
      }, 500);
    },
  });

  const { run: zan } = useRequest(API.like.postLike.request, {
    manual: true,
  });

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
    zan({}, { target_id: id, type_name: 'comment' });
  };

  const handleReply = () => {
    setReply(!reply);
    setReplyContent('');
  };

  const handleSubmit = () => {
    let type: string;
    if (commentType === 'comment') type = 'first-level';
    else type = 'second-level';

    run(
      {},
      {
        content: replyContent,
        post_id,
        father_id: id,
        type_name: type,
        img_url: img,
      },
    );
  };

  const handleUpload = (src: string) => {
    setImg(src);
  };

  const actions = [
    <>
      <style.CommentBack onClick={handleLike}>
        {!isLiked ? (
          <>
            <LikeOutlined />
            <style.Number>{likes}</style.Number>
          </>
        ) : (
          <span className="like">
            <LikeFilled />
            <style.Number>{likes}</style.Number>
          </span>
        )}
      </style.CommentBack>
      <style.CommentBack
        onClick={(e) => {
          e.stopPropagation();
          e.defaultPrevented = true;
          handleReply();
        }}
      >
        <MessageOutlined />
        <style.Number>
          {reply ? '取消回复' : `${comment_num ? comment_num : '回复'}`}
        </style.Number>
      </style.CommentBack>
    </>,
  ];

  const handleAddSub = (subs: defs.post_Comment[]) => {
    setSubComments(subs);
  };

  const getComments = () => {
    switch (commentType) {
      case 'comment':
        return (
          <SubList
            syncSubComments={handleAddSub}
            subComments={subComments}
            post_id={post_id}
            commentNum={commentNum}
            handleAddComment={handleAddComment}
          />
        );
      default:
        return (
          <>
            {replyInfo.content ? (
              <style.ReplyComments>{`"  ${replyInfo.content}  "`}</style.ReplyComments>
            ) : (
              ''
            )}
          </>
        );
    }
  };

  return (
    <Comment
      actions={actions}
      content={
        <>
          <div>{content}</div>
          {img_url ? <Image width={64} height={64} src={img_url} /> : null}
        </>
      }
      datetime={moment(time).fromNow()}
      author={
        replyInfo.name ? (
          <>
            {creator_name}
            <b>回复了</b>
            {replyInfo.name}
          </>
        ) : (
          creator_name
        )
      }
      avatar={<Avatar src={creator_avatar} userId={creator_id} />}
    >
      {reply ? (
        <div style={{ height: 'fit-content', marginBottom: '20px' }}>
          <Editor
            content={replyContent}
            setContent={setReplyContent}
            submitting={submitting}
            setSubmitting={setSubmitting}
            onSubmit={handleSubmit}
            reply={reply}
            setReply={setReply}
            autoFocus={reply}
            handleUpload={handleUpload}
            hasImg={img === '' ? false : true}
          />
          {img ? (
            <style.Img img={img}>
              <CloseSquareFilled
                onClick={() => {
                  setImg('');
                }}
              />
            </style.Img>
          ) : null}
        </div>
      ) : null}
      {getComments()}
    </Comment>
  );
};

// 一级
const CommentList: React.FC<{
  comments: defs.post_SubPost[];
  post_id: number;
  handleAddComment: (num: number, content?: string, comment_id?: number) => void;
  commentNum: number;
}> = ({ comments, post_id, commentNum, handleAddComment }) => {
  return (
    <List
      dataSource={comments}
      header={`全部评论`}
      itemLayout="horizontal"
      renderItem={(props) => (
        <CommentItem
          {...props}
          key={props.id}
          commentType={'comment'}
          post_id={post_id}
          commentNum={commentNum}
          handleAddComment={handleAddComment}
        />
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
  handleUpload,
  hasImg,
}: EditorProps) => {
  const [focus, setFocus] = useState(reply);
  const [upload, setUpload] = useState(false);
  const { qiniuToken } = useProfile();
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
    if (content || upload) return;
    // 关于事件调用顺序
    setTimeout(() => {
      if (submitting) {
        setSubmitting(false);
        return;
      }
      setFocus(false);
      setReply && setReply(false);
      setContent('');
      handleUpload('');
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
    if (ctrlKey && e.key === 'Enter') {
      setSubmitting(true);
      onSubmit();
    }
  };

  const Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasImg) {
      message.warn('一条评论最多上传一张照片哦');
      return;
    }
    const imgFile = e.currentTarget.files ? e.currentTarget.files[0] : null;
    observer.complete = (res: CompleteRes) => {
      handleUpload(QiniuServer + res.key);
      message.success('上传成功');
    };
    setUpload(false);
    qiniupload(imgFile as File, qiniuToken);
  };

  return (
    <div style={isSub ? { display: content || focus ? 'block' : 'none' } : {}}>
      <Form.Item>
        <TextArea
          autoFocus={autoFocus}
          style={{ ...textareaStyle }}
          placeholder={
            window.matchMedia &&
            window.matchMedia(`(max-width: ${sizes.desktop}px)`).matches
              ? '发表你的评论...'
              : /windows|win32/i.test(navigator.userAgent)
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
          <style.Upload
            onMouseDown={() => {
              setUpload(true);
            }}
          >
            <span>
              <input onChange={Upload} type="file" />
              <IconFont className="upload" type="icon-image" />
              <span>图片</span>
            </span>
          </style.Upload>
        </Form.Item>
      ) : null}
    </div>
  );
};

const CommentCp = (props: IProps, ref: any) => {
  const { commentList, post_id, commentNum, handleAddComment } = props;
  const [comments, setComments] = useState<defs.post_SubPost[]>(
    commentList ? commentList : [],
  );

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [img, setImg] = useState('');

  const {
    userProfile: { avatar, name },
  } = useProfile();

  const descOrder = (comments: Array<defs.post_Comment>) => {
    return [...comments].sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : 0;
      const timeB = b.time ? new Date(b.time).getTime() : 0;
      return timeB - timeA;
    });
  };

  const { run } = useRequest(API.comment.postComment.request, {
    manual: true,
    onSuccess: (res) => {
      const newComment = {
        ...res.data,
        time: res.data.create_time, //因为res.data没有time属性，这里用于倒序排列
      };
      const updatedComments = descOrder([...comments, newComment]);
      setTimeout(() => {
        setComments(updatedComments);
        setContent('');
        setSubmitting(false);
        handleAddComment(commentNum + 1, content);
        setImg('');
      }, 500);
    },
  }); //这是用于处理根评论

  const handleSubmit = () => {
    run(
      {},
      { content, post_id, father_id: post_id, type_name: 'sub-post', img_url: img },
    );
  };

  const handleUpload = (src: string) => {
    setImg(src);
  };

  return (
    <style.Wrapper ref={ref}>
      <h2>评论区</h2>
      <Comment
        avatar={<Avatar src={avatar} />}
        author={name}
        content={
          <>
            <Editor
              content={content}
              setContent={setContent}
              submitting={submitting}
              setSubmitting={setSubmitting}
              onSubmit={handleSubmit}
              handleUpload={handleUpload}
              hasImg={img === '' ? false : true}
            />
            {img ? (
              <style.Img img={img}>
                <CloseSquareFilled
                  onClick={() => {
                    setImg('');
                  }}
                />
              </style.Img>
            ) : null}
          </>
        }
      />
      {comments.length > 0 && (
        <CommentList
          handleAddComment={handleAddComment}
          commentNum={commentNum}
          comments={descOrder(comments)}
          post_id={post_id}
        />
      )}
    </style.Wrapper>
  );
};

const CommentWithRef = React.forwardRef(CommentCp);

export default CommentWithRef;
