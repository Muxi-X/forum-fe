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
import {
  mobileMotion,
  mobilePalette,
  mobileRadius,
  PrimaryButton,
  GhostButton,
} from '../styles';
import { mobileApi, MobileComment, MobilePost } from '../api';
import { TARGET_TYPE, TYPE_NAME, SORT_TYPE, mobileTableByCategory } from '../constants';
import moment from 'utils/moment';

const ArticleWrap = styled.article`
  background: ${mobilePalette.paper};
  padding: 16px 20px 18px;
`;

const TableLabel = styled.button`
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: transparent;
  color: #fe9800;
  font-size: 12px;
`;

const Title = styled.h1`
  margin: 14px 0 10px;
  font-size: 18px;
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
  margin-top: 18px;
  color: #303745;
  font-size: 15px;
  line-height: 1.75;
  word-break: break-word;
  img {
    max-width: 100%;
    border-radius: ${mobileRadius.md};
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 8px;
  padding: 10px 14px;
  background: ${mobilePalette.paper};
  border-top: 1px solid ${mobilePalette.lineSoft};
  border-bottom: 1px solid ${mobilePalette.lineSoft};
`;

const ActionButton = styled.button<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 2px;
  border-radius: 999px;
  background: transparent;
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.ink)};
  border: 0;
  transition: transform ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
  }
`;

const CommentSection = styled.section`
  margin-top: 10px;
  background: ${mobilePalette.paper};
  border-top: 1px solid ${mobilePalette.line};
  h2 {
    margin: 0;
    padding: 16px 20px;
    font-size: 16px;
  }
`;

const CommentItem = styled.div`
  padding: 14px 16px;
  border-top: 1px solid ${mobilePalette.line};
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

const SubComments = styled.div`
  margin: 10px 0 0 36px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f6f7f9;
  color: #596170;
  font-size: 13px;
  p {
    margin: 4px 0;
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
  grid-template-columns: minmax(0, 1fr) 64px;
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255, 254, 250, 0.98);
  border-top: 1px solid ${mobilePalette.lineSoft};
  backdrop-filter: blur(18px);
  textarea {
    resize: none;
    border-radius: ${mobileRadius.lg};
  }
`;

const ReportForm = styled.div`
  display: grid;
  gap: 12px;
  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

const getTime = (comment: MobileComment) => comment.create_time || comment.time || '';

const CommentList: React.FC<{
  comments: MobileComment[];
  onReply: (comment: MobileComment) => void;
}> = ({ comments, onReply }) => (
  <>
    {comments.map((comment) => (
      <CommentItem key={comment.id}>
        <CommentHead>
          <MobileAvatar url={comment.creator_avatar} size={28} />
          <strong>{comment.creator_name || '茶友'}</strong>
          <span>{getTime(comment) ? moment(getTime(comment)).fromNow() : ''}</span>
          <button
            type="button"
            onClick={() => onReply(comment)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              color: mobilePalette.muted,
            }}
          >
            回复
          </button>
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
                <strong>{sub.creator_name}：</strong>
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

  const toggleLike = async () => {
    if (!post?.id) return;
    if (!localStorage.getItem('token')) {
      nav('/login');
      return;
    }
    setPost({
      ...post,
      is_liked: !post.is_liked,
      like_num: (post.like_num || 0) + (post.is_liked ? -1 : 1),
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
    setPost({
      ...post,
      is_collection: !post.is_collection,
      collection_num: (post.collection_num || 0) + (post.is_collection ? -1 : 1),
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
      loadComments();
      setPost({ ...post, comment_num: (post.comment_num || 0) + 1 });
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
        <ActionButton
          onClick={() => document.getElementById('mobile-comments')?.scrollIntoView()}
        >
          <DesignIcon name="comment" size={18} />
          {post.comment_num || 0}
        </ActionButton>
        <ActionButton onClick={() => setReportOpen(true)}>
          <DesignIcon name="warning" size={18} />
          投诉
        </ActionButton>
      </ActionRow>
      <CommentSection id="mobile-comments">
        <h2>{comments.length ? `评论 ${comments.length}` : '评论'}</h2>
        {comments.length ? (
          <CommentList comments={comments} onReply={setReplyTo} />
        ) : (
          <EmptyState title="还没有评论" text="写下第一条评论。" />
        )}
      </CommentSection>
      <Composer>
        <Input.TextArea
          rows={1}
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
            <GhostButton type="button" onClick={() => setReportOpen(false)}>
              取消
            </GhostButton>
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
