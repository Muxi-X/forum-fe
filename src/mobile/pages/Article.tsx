import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileBottomSheet from '../components/MobileBottomSheet';
import UploadField from '../components/UploadField';
import MobileAvatar from '../components/MobileAvatar';
import DesignIcon from '../components/DesignIcon';
import { mobileMotion, mobilePalette, mobileRadius, PrimaryButton } from '../styles';
import { mobileApi, MobileComment, MobilePost } from '../api';
import { TARGET_TYPE, TYPE_NAME, SORT_TYPE, mobileTableByCategory } from '../constants';
import { emitPostStatPatch } from '../postEvents';
import moment from 'utils/moment';

const ArticleWrap = styled.article`
  background: linear-gradient(180deg, #fffaf0 0%, #fff 108px);
  padding: 18px 20px 20px;
`;

const TableLabel = styled.button`
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 198, 65, 0.18);
  color: #c46c00;
  font-size: 12px;
  font-weight: 800;
`;

const Title = styled.h1`
  margin: 16px 0 12px;
  font-size: 22px;
  line-height: 1.35;
  font-weight: 900;
  color: ${mobilePalette.ink};
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const Content = styled.div`
  margin-top: 20px;
  color: #303745;
  font-size: 15px;
  line-height: 1.75;
  word-break: break-word;
  img {
    max-width: 100%;
    border-radius: ${mobileRadius.md};
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 8px;
  margin-top: 16px;
  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 14px;
    background: #f4f5f7;
  }
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 10px 14px 0;
  padding: 8px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.06);
`;

const ActionButton = styled.button<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
  height: 38px;
  padding: 0 6px;
  border-radius: 999px;
  background: ${(props) => (props.active ? 'rgba(255, 198, 65, 0.18)' : 'transparent')};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.ink)};
  border: 0;
  transition: transform ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
  }
`;

const CommentSection = styled.section`
  margin-top: 12px;
  padding-bottom: calc(92px + env(safe-area-inset-bottom));
  background: transparent;
  h2 {
    margin: 0 14px 10px;
    padding: 14px 4px 2px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    span {
      color: ${mobilePalette.muted};
      font-size: 12px;
      font-weight: 600;
      transform: translateY(1px);
    }
  }
`;

const CommentItem = styled.div`
  margin: 0 14px 10px;
  padding: 14px;
  border-radius: 18px;
  background: ${mobilePalette.paper};
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05);
`;

const CommentHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const CommentText = styled.p`
  margin: 9px 0 0 36px;
  color: ${mobilePalette.ink};
  line-height: 1.6;
`;

const ReplyButton = styled.button<{ active?: boolean }>`
  margin-left: auto;
  min-height: 26px;
  padding: 0 9px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) => (props.active ? 'rgba(255, 198, 65, 0.2)' : 'transparent')};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.muted)};
  font-size: 12px;
`;

const SubComments = styled.div`
  margin: 10px 0 0 36px;
  padding: 9px 10px;
  border-radius: 12px;
  background: #f6f7f9;
  color: #596170;
  font-size: 13px;
  p {
    margin: 0;
    line-height: 1.55;
    & + p {
      margin-top: 7px;
      padding-top: 7px;
      border-top: 1px solid rgba(60, 60, 67, 0.08);
    }
  }
  .time {
    margin-left: 5px;
    color: ${mobilePalette.mutedSoft};
    font-size: 11px;
  }
`;

const Composer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  max-width: 520px;
  margin: 0 auto;
  bottom: 0;
  z-index: 40;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 62px;
  gap: 8px;
  padding: 9px 12px calc(9px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(60, 60, 67, 0.08);
  backdrop-filter: blur(18px);
  @supports (bottom: env(keyboard-inset-height)) {
    bottom: env(keyboard-inset-height);
  }
  textarea {
    resize: none;
    border-radius: ${mobileRadius.lg};
    min-height: 40px;
    max-height: 104px;
    padding: 9px 14px;
    line-height: 20px;
    display: block;
    overflow-y: auto;
  }
  button {
    height: 40px;
    align-self: end;
    padding: 0 12px;
  }
`;

const ReplyHint = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 26px;
  padding: 0 4px;
  color: ${mobilePalette.muted};
  font-size: 12px;
  button {
    width: auto;
    height: 24px;
    margin-left: auto;
    padding: 0 8px;
    border-radius: ${mobileRadius.pill};
    background: rgba(60, 60, 67, 0.06);
    color: ${mobilePalette.muted};
  }
`;

const ReportForm = styled.div`
  display: grid;
  gap: 12px;
  .actions {
    display: flex;
    justify-content: center;
  }
  .actions button {
    min-width: 132px;
  }
`;

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

const getTime = (comment: MobileComment) => comment.create_time || comment.time || '';

const getPostImages = (post: MobilePost) => {
  const values = [
    post.img_url,
    post.image_url,
    ...(Array.isArray(post.images) ? post.images : []),
  ];
  return Array.from(new Set(values.filter(Boolean))) as string[];
};

const CommentList: React.FC<{
  comments: MobileComment[];
  onReply: (comment: MobileComment) => void;
  replyingId?: number;
}> = ({ comments, onReply, replyingId }) => (
  <>
    {comments.map((comment) => (
      <CommentItem key={comment.id}>
        <CommentHead>
          <MobileAvatar url={comment.creator_avatar} size={28} />
          <strong>{comment.creator_name || '茶友'}</strong>
          <span>{getTime(comment) ? moment(getTime(comment)).fromNow() : ''}</span>
          <ReplyButton
            type="button"
            onClick={() => onReply(comment)}
            active={Boolean(replyingId && replyingId === comment.id)}
          >
            {replyingId && replyingId === comment.id ? '正在回复' : '回复'}
          </ReplyButton>
        </CommentHead>
        <CommentText>{comment.content}</CommentText>
        {comment.img_url ? (
          <img
            src={comment.img_url}
            alt=""
            style={{
              width: 88,
              height: 88,
              objectFit: 'cover',
              borderRadius: 8,
              margin: '10px 0 0 36px',
            }}
          />
        ) : null}
        {comment.sub_comments?.length ? (
          <SubComments>
            {comment.sub_comments.map((sub) => (
              <p key={sub.id}>
                <strong>{sub.creator_name || '茶友'}</strong>
                {sub.be_replied_user_name ? (
                  <>
                    {' '}
                    回复 <strong>{sub.be_replied_user_name}</strong>
                  </>
                ) : null}
                <span className="time">
                  {getTime(sub) ? moment(getTime(sub)).fromNow() : ''}
                </span>
                <br />
                {sub.content}
              </p>
            ))}
          </SubComments>
        ) : null}
      </CommentItem>
    ))}
  </>
);

const Article: React.FC = () => {
  const { article_id } = useParams();
  const postId = Number(article_id);
  const nav = useNavigate();
  const [post, setPost] = useState<MobilePost | null>(null);
  const [comments, setComments] = useState<MobileComment[]>([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<MobileComment | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportContact, setReportContact] = useState('');
  const [reportImg, setReportImg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const html = useMemo(() => {
    if (!post) return '';
    const raw =
      post.compiled_content ||
      (post.content_type === 'md' ? md.render(post.content || '') : post.content || '');
    return DOMPurify.sanitize(raw);
  }, [post]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await mobileApi.posts.get(postId);
      if (res.code !== 0) {
        setError(res.message || '帖子加载失败');
        return;
      }
      setPost(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '帖子加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    const res = await mobileApi.comments.list({
      target_id: postId,
      target_type: TYPE_NAME.post,
      sort_type: SORT_TYPE.newest,
      page_size: 50,
    });
    if (res.code === 0) setComments(res.data.comments || []);
  };

  useEffect(() => {
    if (!postId) return;
    load();
    loadComments();
  }, [postId]);

  const table = mobileTableByCategory(post?.category);
  const postImages = post ? getPostImages(post) : [];

  const toggleLike = async () => {
    if (!post?.id) return;
    if (!localStorage.getItem('token')) {
      nav('/login');
      return;
    }
    const nextPost = {
      ...post,
      is_liked: !post.is_liked,
      like_num: (post.like_num || 0) + (post.is_liked ? -1 : 1),
    };
    setPost(nextPost);
    emitPostStatPatch({
      id: post.id,
      is_liked: nextPost.is_liked,
      like_num: nextPost.like_num,
    });
    const res = await mobileApi.like(post.id, TYPE_NAME.post);
    if (res.code !== 0) {
      message.error(res.message || '操作失败');
      load();
    }
  };

  const toggleCollect = async () => {
    if (!post?.id) return;
    if (!localStorage.getItem('token')) {
      nav('/login');
      return;
    }
    const nextPost = {
      ...post,
      is_collection: !post.is_collection,
      collection_num: (post.collection_num || 0) + (post.is_collection ? -1 : 1),
    };
    setPost(nextPost);
    emitPostStatPatch({
      id: post.id,
      is_collection: nextPost.is_collection,
      collection_num: nextPost.collection_num,
    });
    const res = await mobileApi.collection.toggle(post.id, TARGET_TYPE.post);
    if (res.code !== 0) {
      message.error(res.message || '操作失败');
      load();
    }
  };

  const submitComment = async () => {
    if (!content.trim() || !post?.id) return;
    if (!localStorage.getItem('token')) {
      nav('/login');
      return;
    }
    setSubmitting(true);
    const body = replyTo
      ? {
          target_id: post.id,
          target_type: TYPE_NAME.post,
          content,
          father_id: replyTo.id,
          type_name: TYPE_NAME.secondLevel,
        }
      : {
          target_id: post.id,
          target_type: TYPE_NAME.post,
          content,
          father_id: post.id,
          type_name: TYPE_NAME.firstLevel,
        };
    try {
      const res = await mobileApi.comments.create(body);
      if (res.code !== 0) {
        message.error(res.message);
        return;
      }
      setContent('');
      setReplyTo(null);
      await loadComments();
      const nextCommentNum = (post.comment_num || 0) + 1;
      setPost({ ...post, comment_num: nextCommentNum });
      emitPostStatPatch({ id: post.id, comment_num: nextCommentNum });
    } finally {
      setSubmitting(false);
    }
  };

  const submitReport = async () => {
    if (!post?.id || !reportContent.trim()) {
      message.warning('请填写投诉内容');
      return;
    }
    const res = await mobileApi.report({
      id: post.id,
      type_name: TYPE_NAME.post,
      category: 'mobile',
      cause: reportContent,
      contact: reportContact,
      img_url: reportImg,
    });
    if (res.code === 0) {
      message.success('已提交');
      setReportOpen(false);
    } else {
      message.error(res.message);
    }
  };

  if (loading && !post) {
    return (
      <MobileShell title="帖子详情" back tabs={false}>
        <LoadingState text="正在打开帖子..." />
      </MobileShell>
    );
  }

  if (error && !post) {
    return (
      <MobileShell title="帖子详情" back tabs={false}>
        <ErrorState text={error} onRetry={load} />
      </MobileShell>
    );
  }

  if (!post) return null;

  return (
    <MobileShell title="帖子详情" back tabs={false}>
      <ArticleWrap>
        <TableLabel type="button" onClick={() => nav(`/${table.route}`)}>
          {table.name}
        </TableLabel>
        <Title>{post.title}</Title>
        <Author>
          <MobileAvatar url={post.creator_avatar} size={30} />
          <span>{post.creator_name || '茶友'}</span>
          <span>{post.time ? moment(post.time).fromNow() : ''}</span>
        </Author>
        <Content dangerouslySetInnerHTML={{ __html: html }} />
        {postImages.length ? (
          <ImageGrid>
            {postImages.map((url) => (
              <img key={url} src={url} alt="" />
            ))}
          </ImageGrid>
        ) : null}
      </ArticleWrap>
      <ActionRow>
        <ActionButton active={post.is_liked} onClick={toggleLike}>
          <DesignIcon
            name="like"
            size={18}
            color={post.is_liked ? mobilePalette.orange : mobilePalette.muted}
          />
          {post.like_num || 0}
        </ActionButton>
        <ActionButton active={post.is_collection} onClick={toggleCollect}>
          <DesignIcon
            name="bookmark"
            size={17}
            color={post.is_collection ? mobilePalette.orange : mobilePalette.muted}
          />
          {post.collection_num || 0}
        </ActionButton>
        <ActionButton onClick={() => setReportOpen(true)}>
          <DesignIcon name="warning" size={18} />
          投诉
        </ActionButton>
      </ActionRow>
      <CommentSection id="mobile-comments">
        <h2>
          评论
          <span>{comments.length || post.comment_num || 0}</span>
        </h2>
        {comments.length ? (
          <CommentList
            comments={comments}
            onReply={setReplyTo}
            replyingId={replyTo?.id}
          />
        ) : (
          <EmptyState title="还没有评论" minHeight={120} compact />
        )}
      </CommentSection>
      <Composer>
        {replyTo ? (
          <ReplyHint>
            正在回复 {replyTo.creator_name || '茶友'}
            <button
              type="button"
              onClick={() => {
                setReplyTo(null);
                setContent('');
              }}
            >
              取消
            </button>
          </ReplyHint>
        ) : null}
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 4 }}
          value={content}
          placeholder={replyTo ? `回复 ${replyTo.creator_name || '茶友'}` : '写评论...'}
          onChange={(event) => setContent(event.target.value)}
          onBlur={() => {
            if (!content) setReplyTo(null);
          }}
        />
        <PrimaryButton disabled={submitting || !content.trim()} onClick={submitComment}>
          发送
        </PrimaryButton>
      </Composer>
      <MobileBottomSheet
        open={reportOpen}
        title="投诉内容"
        onClose={() => setReportOpen(false)}
      >
        <ReportForm>
          <Input.TextArea
            rows={4}
            value={reportContent}
            onChange={(event) => setReportContent(event.target.value)}
            placeholder="说明你遇到的问题"
          />
          <Input
            value={reportContact}
            onChange={(event) => setReportContact(event.target.value)}
            placeholder="联系方式（可选）"
          />
          <UploadField value={reportImg} onChange={setReportImg} />
          <div className="actions">
            <PrimaryButton type="button" onClick={submitReport}>
              提交
            </PrimaryButton>
          </div>
        </ReportForm>
      </MobileBottomSheet>
    </MobileShell>
  );
};

export default Article;
