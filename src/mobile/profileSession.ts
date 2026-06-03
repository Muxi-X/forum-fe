export type MobileProfileRouteState = {
  forceReload?: unknown;
  refreshProfile?: boolean;
  preserveCache?: boolean;
  profileOwnerId?: number;
  profileSessionId?: string;
  source?: string;
};

export type MobileProfileRefreshPatch = {
  userId?: number;
  revision: number;
};

export const MOBILE_PROFILE_REFRESH_EVENT = 'forum-mobile-profile-refresh';

let profileRefreshRevision = 0;
let globalProfileRefreshRevision = 0;
const userProfileRefreshRevisions = new Map<number, number>();

const bumpMobileProfileRefreshRevision = (userId?: number) => {
  profileRefreshRevision += 1;
  if (userId) {
    userProfileRefreshRevisions.set(Number(userId), profileRefreshRevision);
  } else {
    globalProfileRefreshRevision = profileRefreshRevision;
  }
  return profileRefreshRevision;
};

export const getMobileProfileRefreshRevision = (userId?: number | string) => {
  const scopedRevision = userId
    ? userProfileRefreshRevisions.get(Number(userId)) || 0
    : 0;
  return Math.max(globalProfileRefreshRevision, scopedRevision);
};

export const emitMobileProfileRefresh = (userId?: number) => {
  const revision = bumpMobileProfileRefreshRevision(userId);
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<MobileProfileRefreshPatch>(MOBILE_PROFILE_REFRESH_EVENT, {
      detail: { userId, revision },
    }),
  );
};

type ActiveMobileProfileSession = {
  ownerId: number;
  sessionId: string;
};

let activeMobileProfileSession: ActiveMobileProfileSession | null = null;

export const createMobileProfileSessionState = (
  profileId: number,
): MobileProfileRouteState => {
  const sessionId = `${profileId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  activeMobileProfileSession = {
    ownerId: profileId,
    sessionId,
  };
  return {
    preserveCache: true,
    profileOwnerId: profileId,
    profileSessionId: sessionId,
    source: 'profile',
  };
};

export const hasMobileProfileSession = (
  state: MobileProfileRouteState | null | undefined,
  profileId?: number | string,
) =>
  Boolean(
    profileId &&
      state?.preserveCache &&
      state.profileSessionId &&
      Number(state.profileOwnerId) === Number(profileId),
  );

export const hasActiveMobileProfileSession = (
  state: MobileProfileRouteState | null | undefined,
  profileId?: number | string,
) => {
  if (!profileId || !activeMobileProfileSession) return false;
  if (Number(activeMobileProfileSession.ownerId) !== Number(profileId)) return false;
  if (state?.profileSessionId) {
    return (
      hasMobileProfileSession(state, profileId) &&
      activeMobileProfileSession.sessionId === state.profileSessionId
    );
  }
  return true;
};

const isInsideProfileSessionRoute = (
  ownerId: number,
  pathname: string,
  search: string,
) => {
  if (pathname === `/user/${ownerId}` || pathname.startsWith(`/user/${ownerId}/`)) {
    return true;
  }
  if (pathname === '/user/chat') {
    const params = new URLSearchParams(search);
    return Number(params.get('target_id')) === ownerId;
  }
  if (/^\/article\/\d+/.test(pathname)) return true;
  if (/^\/sip-score\/\d+/.test(pathname)) return true;
  return false;
};

export const syncMobileProfileSessionForRoute = (pathname: string, search = '') => {
  if (!activeMobileProfileSession) return;
  if (
    !isInsideProfileSessionRoute(activeMobileProfileSession.ownerId, pathname, search)
  ) {
    activeMobileProfileSession = null;
  }
};
