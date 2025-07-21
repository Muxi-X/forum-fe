import React, { useState, useEffect, useRef } from 'react';
import useRequest from 'hooks/useRequest';
import useNotification from 'store/useNotification';

interface PostObserverValues {
  like: number;
  comment: number;
  collection: number;
}

interface PostData {
  id: number;
  title: string;
  like_num: number;
  comment_num: number;
  collection_num: number;
}

const NotifListener: React.FC = () => {
  const postObservers = useRef<Map<number, PostObserverValues>>(new Map());
  const isFirstRun = useRef(true);
  const userId = localStorage.getItem('userId');
  const { addNotification } = useNotification();

  const { run } = useRequest(API.post.getPostPublishedByUser_id.request, {
    onSuccess: (res) => {
      const posts = res.data.posts as PostData[];
      if (posts) {
        if (isFirstRun.current) {
          posts.forEach((post) => {
            postObservers.current.set(post.id, {
              like: post.like_num,
              comment: post.comment_num,
              collection: post.collection_num,
            });
          });
          isFirstRun.current = false;
          return;
        }
        checkAndNotify(posts);
      }
    },
    manual: true,
  });

  const checkAndNotify = (posts: PostData[]) => {
    let totalNewLikes = 0;
    let totalNewComments = 0;
    let totalNewCollections = 0;

    posts.forEach((post) => {
      const prevValues = postObservers.current.get(post.id);
      if (prevValues) {
        const likeDiff = post.like_num - prevValues.like;
        const commentDiff = post.comment_num - prevValues.comment;
        const collectionDiff = post.collection_num - prevValues.collection;

        if (likeDiff > 0) {
          totalNewLikes += likeDiff;
          addNotification({
            id: `like-${post.id}-${Date.now()}`,
            postId: post.id,
            postTitle: post.title,
            type: 'like',
            content: `您的帖子"${post.title}"收到了新点赞`,
            read: false,
            timestamp: Date.now(),
          });
        }

        if (commentDiff > 0) {
          totalNewComments += commentDiff;
          addNotification({
            id: `comment-${post.id}-${Date.now()}`,
            postId: post.id,
            postTitle: post.title,
            type: 'comment',
            content: `您的帖子"${post.title}"收到了新评论`,
            read: false,
            timestamp: Date.now(),
          });
        }

        if (collectionDiff > 0) {
          totalNewCollections += collectionDiff;
          addNotification({
            id: `collection-${post.id}-${Date.now()}`,
            postId: post.id,
            postTitle: post.title,
            type: 'collection',
            content: `您的帖子"${post.title}"被收藏了`,
            read: false,
            timestamp: Date.now(),
          });
        }

        postObservers.current.set(post.id, {
          like: post.like_num,
          comment: post.comment_num,
          collection: post.collection_num,
        });
      } else {
        postObservers.current.set(post.id, {
          like: post.like_num,
          comment: post.comment_num,
          collection: post.collection_num,
        });
      }
    });
  };

  useEffect(() => {
    run({ user_id: +(userId as string), limit: 20, page: 0 });

    const polling = setInterval(() => {
      run({ user_id: +(userId as string), limit: 20, page: 0 });
    }, 20000);

    return () => clearInterval(polling);
  }, []);

  return null;
};

export default NotifListener;
