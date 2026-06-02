import { MobilePost, SipScore, SipScoreEntry, SipScoreWithEntries } from './api';

export type MobilePostStatPatch = {
  id: number;
  post?: MobilePost;
  is_liked?: boolean;
  like_num?: number;
  is_collection?: boolean;
  collection_num?: number;
  comment_num?: number;
  removed_from_collection?: boolean;
  created?: boolean;
  updated?: boolean;
};

export const MOBILE_POST_STAT_EVENT = 'forum-mobile-post-stat';
export const MOBILE_POST_COLLECTION_EVENT = 'forum-mobile-post-collection';
export const MOBILE_POST_CREATED_EVENT = 'forum-mobile-post-created';
export const MOBILE_POST_UPDATED_EVENT = 'forum-mobile-post-updated';

export type SipScorePatch = {
  id: number;
  sipScore?: SipScore;
  withEntries?: SipScoreWithEntries;
  is_collected?: boolean;
  collect_count?: number;
  entry_count?: number;
  participant_count?: number;
  created?: boolean;
  updated?: boolean;
  removed_from_collection?: boolean;
};

export type SipScoreEntryPatch = {
  sipScoreId: number;
  entryId?: number;
  entry?: SipScoreEntry;
  score_avg?: number;
  participant_num?: number;
  comment_num?: number;
  created?: boolean;
  rated?: boolean;
};

export const MOBILE_SIP_SCORE_EVENT = 'forum-mobile-sip-score';
export const MOBILE_SIP_SCORE_COLLECTION_EVENT = 'forum-mobile-sip-score-collection';
export const MOBILE_SIP_SCORE_CREATED_EVENT = 'forum-mobile-sip-score-created';
export const MOBILE_SIP_SCORE_ENTRY_EVENT = 'forum-mobile-sip-score-entry';

const postStatPatches = new Map<number, MobilePostStatPatch>();
const sipScorePatches = new Map<number, SipScorePatch>();
const sipScoreEntryPatches = new Map<string, SipScoreEntryPatch>();
let postRevision = 0;
let sipScoreRevision = 0;

const normalizePostId = (post: MobilePost) => Number(post.id || 0);

const normalizeSipScoreId = (item: SipScoreWithEntries | SipScore) => {
  const sip =
    item && Object.prototype.hasOwnProperty.call(item, 'sip_score')
      ? (item as SipScoreWithEntries).sip_score || {}
      : (item as SipScore);
  return Number(sip.id || 0);
};

const sipEntryPatchKey = (sipScoreId: number, entryId?: number) =>
  `${Number(sipScoreId)}:${Number(entryId || 0)}`;

const applyEntryPatchesForSipScore = (
  sipScoreId: number,
  entries: SipScoreEntry[],
  options?: { includeCreated?: boolean },
) => {
  const nextEntries = entries.map((entry) => {
    const patch = sipScoreEntryPatches.get(sipEntryPatchKey(sipScoreId, entry.id));
    return patch ? applySipScoreEntryPatch(entry, patch) : entry;
  });

  if (!options?.includeCreated) {
    return nextEntries;
  }

  const existingIds = new Set(nextEntries.map((entry) => Number(entry.id || 0)));
  const createdEntries: SipScoreEntry[] = [];
  sipScoreEntryPatches.forEach((patch) => {
    if (
      Number(patch.sipScoreId) === Number(sipScoreId) &&
      patch.created &&
      patch.entry &&
      patch.entryId &&
      !existingIds.has(Number(patch.entryId))
    ) {
      createdEntries.push(applySipScoreEntryPatch(patch.entry, patch));
    }
  });

  return createdEntries.length ? [...createdEntries, ...nextEntries] : nextEntries;
};

export const getMobilePostId = normalizePostId;
export const getSipScoreItemId = normalizeSipScoreId;

export const emitPostStatPatch = (patch: MobilePostStatPatch) => {
  const previous = postStatPatches.get(Number(patch.id)) || { id: Number(patch.id) };
  const next = { ...previous, ...patch };
  postStatPatches.set(Number(patch.id), next);
  postRevision += 1;
  window.dispatchEvent(new CustomEvent(MOBILE_POST_STAT_EVENT, { detail: next }));
  if (patch.created) {
    window.dispatchEvent(new CustomEvent(MOBILE_POST_CREATED_EVENT, { detail: next }));
  }
  if (patch.updated) {
    window.dispatchEvent(new CustomEvent(MOBILE_POST_UPDATED_EVENT, { detail: next }));
  }
  if (patch.is_collection !== undefined || patch.removed_from_collection) {
    window.dispatchEvent(new CustomEvent(MOBILE_POST_COLLECTION_EVENT, { detail: next }));
  }
};

export const applyPostStatPatch = (post: MobilePost, patch: MobilePostStatPatch) => {
  if (!normalizePostId(post) || normalizePostId(post) !== Number(patch.id)) return post;
  return {
    ...post,
    ...(patch.post || {}),
    ...patch,
  };
};

export const applyStoredPostStatPatches = (posts: MobilePost[]) =>
  posts.map((post) => {
    const postId = normalizePostId(post);
    const patch = postStatPatches.get(postId);
    return patch ? applyPostStatPatch(post, patch) : post;
  });

export const getPostRevision = () => postRevision;

export const removeUncollectedPosts = (posts: MobilePost[]) =>
  posts.filter((post) => {
    const postId = normalizePostId(post);
    const patch = postStatPatches.get(postId);
    return !patch || patch.is_collection !== false;
  });

export const emitSipScorePatch = (patch: SipScorePatch) => {
  const previous = sipScorePatches.get(Number(patch.id)) || { id: Number(patch.id) };
  const next = { ...previous, ...patch };
  sipScorePatches.set(Number(patch.id), next);
  sipScoreRevision += 1;
  window.dispatchEvent(new CustomEvent(MOBILE_SIP_SCORE_EVENT, { detail: next }));
  if (patch.created) {
    window.dispatchEvent(
      new CustomEvent(MOBILE_SIP_SCORE_CREATED_EVENT, { detail: next }),
    );
  }
  if (patch.is_collected !== undefined || patch.removed_from_collection) {
    window.dispatchEvent(
      new CustomEvent(MOBILE_SIP_SCORE_COLLECTION_EVENT, { detail: next }),
    );
  }
};

export const applySipScorePatch = (
  item: SipScoreWithEntries,
  patch: SipScorePatch,
): SipScoreWithEntries => {
  const itemId = normalizeSipScoreId(item);
  if (!itemId || itemId !== Number(patch.id)) return item;
  return {
    ...item,
    sip_score: {
      ...(item.sip_score || {}),
      ...(patch.withEntries?.sip_score || {}),
      ...(patch.sipScore || {}),
      id: itemId,
      ...(patch.is_collected !== undefined ? { is_collected: patch.is_collected } : {}),
      ...(patch.collect_count !== undefined
        ? { collect_count: patch.collect_count }
        : {}),
      ...(patch.entry_count !== undefined ? { entry_count: patch.entry_count } : {}),
      ...(patch.participant_count !== undefined
        ? { participant_count: patch.participant_count }
        : {}),
    },
  };
};

export const applyStoredSipScorePatches = (
  items: SipScoreWithEntries[],
  options?: { includeCreated?: boolean },
) =>
  (() => {
    const existingIds = new Set<number>();
    const patchedItems = items.map((item) => {
      const id = normalizeSipScoreId(item);
      existingIds.add(id);
      const patch = sipScorePatches.get(id);
      const patched = patch ? applySipScorePatch(item, patch) : item;
      return {
        ...patched,
        entries: applyEntryPatchesForSipScore(id, patched.entries || [], {
          includeCreated: true,
        }),
      };
    });

    const createdItems: SipScoreWithEntries[] = [];
    sipScorePatches.forEach((patch) => {
      if (
        options?.includeCreated &&
        patch.created &&
        patch.withEntries &&
        !existingIds.has(Number(patch.id))
      ) {
        const id = normalizeSipScoreId(patch.withEntries);
        createdItems.push({
          ...patch.withEntries,
          entries: applyEntryPatchesForSipScore(id, patch.withEntries.entries || [], {
            includeCreated: true,
          }),
        });
      }
    });

    return createdItems.length ? [...createdItems, ...patchedItems] : patchedItems;
  })();

export const getSipScoreRevision = () => sipScoreRevision;

export const removeUncollectedSipScores = (items: SipScoreWithEntries[]) =>
  items.filter((item) => {
    const id = normalizeSipScoreId(item);
    const patch = sipScorePatches.get(id);
    return !patch || patch.is_collected !== false;
  });

export const emitSipScoreEntryPatch = (patch: SipScoreEntryPatch) => {
  const key = sipEntryPatchKey(patch.sipScoreId, patch.entryId);
  const previous = sipScoreEntryPatches.get(key) || {
    sipScoreId: Number(patch.sipScoreId),
    entryId: patch.entryId,
  };
  const next = { ...previous, ...patch };
  sipScoreEntryPatches.set(key, next);
  sipScoreRevision += 1;
  window.dispatchEvent(new CustomEvent(MOBILE_SIP_SCORE_ENTRY_EVENT, { detail: next }));
};

export const applySipScoreEntryPatch = (
  entry: SipScoreEntry,
  patch: SipScoreEntryPatch,
): SipScoreEntry => {
  if (!entry.id || Number(entry.id) !== Number(patch.entryId)) return entry;
  return {
    ...entry,
    ...(patch.entry || {}),
    ...(patch.score_avg !== undefined ? { score_avg: patch.score_avg } : {}),
    ...(patch.participant_num !== undefined
      ? { participant_num: patch.participant_num }
      : {}),
    ...(patch.comment_num !== undefined ? { comment_num: patch.comment_num } : {}),
  };
};

export const applyStoredSipScoreEntryPatches = (
  sipScoreId: number,
  entries: SipScoreEntry[],
) => applyEntryPatchesForSipScore(sipScoreId, entries);
