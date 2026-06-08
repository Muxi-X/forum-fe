import { mobileApi, MobilePost } from './api';

type InteractionNotificationType = 'like' | 'collection' | 'comment' | 'reply_comment';

const currentUserId = () => Number(localStorage.getItem('userId')) || 0;

const truncate = (value: string | undefined, max = 180) => {
  const text = (value || '').trim();
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

export const sendPostInteractionNotification = async (
  post: MobilePost,
  type: InteractionNotificationType,
  options: {
    targetUserId?: number;
    targetUserIds?: Array<number | undefined>;
    content?: string;
    commentId?: number;
    commentContent?: string;
  } = {},
) => {
  const postId = Number(post.id || 0);
  const requestedReceiverIds = options.targetUserIds?.length
    ? options.targetUserIds
    : [options.targetUserId || post.creator_id];
  const receiverIds = Array.from(
    new Set(
      requestedReceiverIds
        .map((id) => Number(id || 0))
        .filter((id) => Number.isFinite(id) && id > 0),
    ),
  );
  const selfId = currentUserId();

  if (!localStorage.getItem('token') || !postId || !receiverIds.length) {
    return;
  }

  try {
    await Promise.all(
      receiverIds
        .filter((receiverId) => receiverId !== selfId)
        .map((receiverId) =>
          mobileApi.user.sendPrivateMessage({
            receive_userid: receiverId,
            type,
            content: truncate(options.content || post.title || '有新的互动'),
            post_id: postId,
            comment_id: options.commentId || 0,
            post_title: truncate(post.title || '未命名帖子', 100),
            comment_content: truncate(options.commentContent || ''),
          }),
        ),
    );
  } catch {
    // 互动本身已经成功，通知发送失败不打断用户操作。
  }
};
