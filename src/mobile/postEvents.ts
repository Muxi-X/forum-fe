import { MobilePost } from './api';

export type MobilePostStatPatch = {
  id: number;
  is_liked?: boolean;
  like_num?: number;
  is_collection?: boolean;
  collection_num?: number;
  comment_num?: number;
};

export const MOBILE_POST_STAT_EVENT = 'forum-mobile-post-stat';

const postStatPatches = new Map<number, MobilePostStatPatch>();

export const emitPostStatPatch = (patch: MobilePostStatPatch) => {
  const previous = postStatPatches.get(Number(patch.id)) || { id: Number(patch.id) };
  postStatPatches.set(Number(patch.id), { ...previous, ...patch });
  window.dispatchEvent(new CustomEvent(MOBILE_POST_STAT_EVENT, { detail: patch }));
};

export const applyPostStatPatch = (post: MobilePost, patch: MobilePostStatPatch) => {
  if (!post.id || Number(post.id) !== Number(patch.id)) return post;
  return {
    ...post,
    ...patch,
  };
};

export const applyStoredPostStatPatches = (posts: MobilePost[]) =>
  posts.map((post) => {
    const postId = Number(
      post.id || (post as any).post_id || (post as any).article_id || 0,
    );
    const patch = postStatPatches.get(postId);
    return patch ? applyPostStatPatch(post, patch) : post;
  });
