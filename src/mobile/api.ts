import Request from 'utils/fetchMiddleware';

type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

type QueryValue = string | number | boolean | undefined | null;

const buildQuery = (params?: Record<string, QueryValue>) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
};

const request = <T>(
  path: string,
  options?: { method?: string; query?: Record<string, QueryValue>; body?: unknown },
): Promise<ApiEnvelope<T>> =>
  Request(`${path}${buildQuery(options?.query)}`, {
    method: options?.method || 'GET',
    body: options?.body,
  });

export type MobileUser = {
  id?: number;
  name?: string;
  avatar?: string;
  avatar_url?: string;
  role?: string;
  email?: string;
  signature?: string;
  is_public_feed?: boolean;
  is_public_collection_and_like?: boolean;
  following_count?: number;
  follower_count?: number;
  is_following?: boolean;
};

export type MobilePost = {
  id?: number;
  title?: string;
  summary?: string;
  content?: string;
  compiled_content?: string;
  content_type?: string;
  category?: string;
  time?: string;
  creator_id?: number;
  creator_name?: string;
  creator_avatar?: string;
  like_num?: number;
  comment_num?: number;
  collection_num?: number;
  is_liked?: boolean;
  is_collection?: boolean;
  tags?: string[];
  img_url?: string;
  image_url?: string;
  images?: string[];
};

export type MobileComment = {
  id?: number;
  content?: string;
  type_name?: string;
  father_id?: number;
  create_time?: string;
  time?: string;
  creator_id?: number;
  creator_name?: string;
  creator_avatar?: string;
  like_num?: number;
  is_liked?: boolean;
  be_replied_user_id?: number;
  be_replied_user_name?: string;
  father_content?: string;
  img_url?: string;
  image_url?: string;
  images?: string[];
  target_id?: number;
  target_type?: string;
  sub_num?: number;
  sub_comments?: MobileComment[];
};

export type SipScore = {
  id?: number;
  created_at?: string;
  updated_at?: string;
  creator?: { id?: number; name?: string; avatar?: string };
  last_modified_by?: { id?: number; name?: string; avatar?: string };
  entry_count?: number;
  collect_count?: number;
  participant_count?: number;
  name?: string;
  description?: string;
  cover_img?: string;
  domain?: string;
  category?: string;
  tags?: string[];
  is_collected?: boolean;
};

export type SipScoreEntry = {
  id?: number;
  sip_score_id?: number;
  created_at?: string;
  updated_at?: string;
  creator?: { id?: number; name?: string; avatar?: string };
  name?: string;
  description?: string;
  cover_img?: string;
  participant_num?: number;
  participant_count?: number;
  comment_num?: number;
  score_total?: number;
  score_avg?: number;
};

export type SipScoreWithEntries = {
  sip_score?: SipScore;
  entries?: SipScoreEntry[];
};

export type SipScoreRating = {
  id?: number;
  sip_score_id?: number;
  sip_score_entry_id?: number;
  creator?: { id?: number; name?: string; avatar?: string };
  rating?: number;
  content?: string;
  comment_id?: number;
  like_num?: number;
  img_url?: string;
  created_at?: string;
  updated_at?: string;
  comment_num?: number;
  comments?: MobileComment[];
};

export type PrivateMessage = {
  id?: string;
  send_user_id?: string;
  post_id?: string;
  comment_id?: string;
  type?: string;
  content?: string;
  post_title?: string;
  comment_content?: string;
  avatar?: string;
  sender_name?: string;
};

export type ChatUser = {
  id?: number;
  name?: string;
  avatar?: string;
};

export const mobileApi = {
  posts: {
    list: (params: {
      domain?: string;
      category?: string;
      filter?: string;
      search_content?: string;
      tag?: string;
      page?: number;
      limit?: number;
    }) =>
      request<{ posts?: MobilePost[] }>(`/post/list/${params.domain || 'normal'}`, {
        query: { ...params, domain: undefined },
      }),
    get: (postId: number) => request<MobilePost>(`/post/${postId}`),
    create: (body: Record<string, unknown>) =>
      request<{ id?: number }>('/post', { method: 'POST', body }),
    update: (body: Record<string, unknown>) =>
      request<Record<string, never>>('/post', { method: 'PUT', body }),
    published: (userId: number, query?: Record<string, QueryValue>) =>
      request<{ posts?: MobilePost[] }>(`/post/published/${userId}`, { query }),
  },
  comments: {
    list: (body: Record<string, unknown>) =>
      request<{ comments?: MobileComment[]; page_token?: string; has_more?: boolean }>(
        '/comment/list',
        { method: 'POST', body },
      ),
    create: (body: Record<string, unknown>) =>
      request<MobileComment>('/comment', { method: 'POST', body }),
  },
  like: (target_id: number, type_name: string) =>
    request<Record<string, never>>('/like', {
      method: 'POST',
      body: { target_id, type_name },
    }),
  collection: {
    toggle: (target_id: number, target_type: number) =>
      request<Record<string, never>>('/collection', {
        method: 'POST',
        body: { target_id, target_type },
      }),
    list: (userId: number, query?: Record<string, QueryValue>) =>
      request<{ posts?: MobilePost[] }>(`/collection/list/${userId}`, { query }),
  },
  report: (body: Record<string, unknown>) =>
    request<Record<string, never>>('/report', { method: 'POST', body }),
  feedback: (body: Record<string, unknown>) =>
    request<Record<string, never>>('/feedback', { method: 'POST', body }),
  user: {
    profile: (userId: number) => request<MobileUser>(`/user/profile/${userId}`),
    myProfile: () => request<MobileUser>('/user/myprofile'),
    update: (body: Record<string, unknown>) =>
      request<Record<string, never>>('/user', { method: 'PUT', body }),
    follow: (target_user_id: number) =>
      request<{
        is_following?: boolean;
        following_count?: number;
        follower_count?: number;
      }>('/user/follow', { method: 'POST', body: { target_user_id } }),
    messages: () => request<{ messages?: string[] }>('/user/message/list'),
    privateMessages: () =>
      request<{ messages?: PrivateMessage[] }>('/user/private_message/list'),
    sendPrivateMessage: (body: Record<string, unknown>) =>
      request<Record<string, never>>('/user/private_message', { method: 'POST', body }),
  },
  chat: {
    history: (id: number, query?: Record<string, QueryValue>) =>
      request<
        Array<{
          sender_id?: number;
          receiver_id?: number;
          content?: string;
          time?: string;
        }>
      >(`/chat/history/${id}`, { query }),
    users: (query?: Record<string, QueryValue>) =>
      request<ChatUser[]>('/chat/userList', { query }),
  },
  feed: (userId: number, query?: Record<string, QueryValue>) =>
    request<{ list?: Array<Record<string, unknown>> }>(`/feed/list/${userId}`, { query }),
  sipScore: {
    list: (query?: Record<string, QueryValue>) =>
      request<{
        sip_scores?: SipScoreWithEntries[];
        page_token?: string;
        has_more?: boolean;
      }>('/sip-score/list', { query }),
    search: (query?: Record<string, QueryValue>) =>
      request<{
        sip_scores?: SipScoreWithEntries[];
        page_token?: string;
        has_more?: boolean;
      }>('/sip-score/search', { query }),
    create: (body: Record<string, unknown>) =>
      request<{ id?: number }>('/sip-score', { method: 'POST', body }),
    get: (id: number) => request<{ sip_score?: SipScore }>(`/sip-score/${id}`),
    entries: (id: number, query?: Record<string, QueryValue>) =>
      request<{ entries?: SipScoreEntry[]; page_token?: string; has_more?: boolean }>(
        `/sip-score/entries/list/${id}`,
        { query },
      ),
    createEntries: (body: Record<string, unknown>) =>
      request<{ ids?: number[] }>('/sip-score/entries', { method: 'POST', body }),
    entryDetail: (sipScoreId: number, entryId: number) =>
      request<{ entry?: SipScoreEntry; my_rating?: SipScoreRating }>(
        `/sip-score/entry/${sipScoreId}/${entryId}`,
      ),
    rateEntry: (body: Record<string, unknown>) =>
      request<Record<string, never>>('/sip-score/entry/rating', {
        method: 'POST',
        body,
      }),
    ratings: (sipScoreId: number, entryId: number, query?: Record<string, QueryValue>) =>
      request<{ ratings?: SipScoreRating[]; page_token?: string; has_more?: boolean }>(
        `/sip-score/entry-rating/list/${sipScoreId}/${entryId}`,
        { query },
      ),
    created: (userId: number, query?: Record<string, QueryValue>) =>
      request<{ sip_scores?: SipScoreWithEntries[] }>(`/sip-score/created/${userId}`, {
        query,
      }),
    collected: (userId: number, query?: Record<string, QueryValue>) =>
      request<{ sip_scores?: SipScoreWithEntries[] }>(`/sip-score/collected/${userId}`, {
        query,
      }),
  },
};

export const isOk = <T>(res: ApiEnvelope<T>) => res.code === 0;
