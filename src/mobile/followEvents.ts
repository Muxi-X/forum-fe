import type { MobileUser } from './api';

export type MobileFollowPatch = {
  targetUserId: number;
  currentUserId?: number;
  targetUser?: MobileUser;
  is_following?: boolean;
  following_count?: number;
  follower_count?: number;
};

export const MOBILE_FOLLOW_EVENT = 'forum-mobile-follow';

let followRevision = 0;

export const getFollowRevision = () => followRevision;

export const emitMobileFollowPatch = (patch: MobileFollowPatch) => {
  followRevision += 1;
  window.dispatchEvent(new CustomEvent(MOBILE_FOLLOW_EVENT, { detail: patch }));
};
