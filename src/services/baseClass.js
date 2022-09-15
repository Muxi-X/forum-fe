export class FeedItem {
  /** action */
  action = '';

  /** date */
  date = '';

  /** id */
  id = undefined;

  /** 分割线 */
  show_divider = false;

  /** source */
  source = new Source();

  /** time */
  time = '';

  /** user */
  user = new FeedUser();
}

export class FeedListResponse {
  /** list */
  list = [];
}

export class FeedUser {
  /** avatar_url */
  avatar_url = '';

  /** id */
  id = undefined;

  /** name */
  name = '';
}

export class ListResponse {
  /** count */
  count = undefined;

  /** list */
  list = [];
}

export class Response {
  /** code */
  code = undefined;

  /** data */
  data = undefined;

  /** message */
  message = '';
}

export class Source {
  /** id */
  id = undefined;

  /** 类型，1 -> 团队，2 -> 项目，3 -> 文档，4 -> 文件，6 -> 进度（5 不使用） */
  kind = undefined;

  /** name */
  name = '';

  /** project_id */
  project_id = undefined;

  /** project_name */
  project_name = '';
}

export class StudentLoginRequest {
  /** password */
  password = '';

  /** student_id */
  student_id = '';
}

export class StudentLoginResponse {
  /** token */
  token = '';
}

export class TeamLoginRequest {
  /** oauth_code */
  oauth_code = '';
}

export class TeamLoginResponse {
  /** redirect_url */
  redirect_url = '';

  /** token */
  token = '';
}

export class UpdateInfoRequest {
  /** avatar_url */
  avatar_url = '';

  /** email */
  email = '';

  /** id */
  id = undefined;

  /** name */
  name = '';

  /** signature */
  signature = '';
}

export class UserProfile {
  /** avatar */
  avatar = '';

  /** email */
  email = '';

  /** id */
  id = undefined;

  /** name */
  name = '';

  /** role */
  role = '';

  /** signature */
  signature = '';
}

export class chat_Id {
  /** id */
  id = '';
}

export class collection_Collection {
  /** comment_num */
  comment_num = undefined;

  /** content */
  content = '';

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** id */
  id = undefined;

  /** post_id */
  post_id = undefined;

  /** time */
  time = '';

  /** title */
  title = '';
}

export class collection_CreateRequest {
  /** post_id */
  post_id = undefined;
}

export class comment_Comment {
  /** content */
  content = '';

  /** create_time */
  create_time = '';

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** father_id */
  father_id = undefined;

  /** id */
  id = undefined;

  /** is_liked */
  is_liked = false;

  /** like_num */
  like_num = undefined;

  /** first-level -> 一级评论; second-level -> 其它级 */
  type_name = '';
}

export class comment_CreateRequest {
  /** content */
  content = '';

  /** father_id */
  father_id = undefined;

  /** post_id */
  post_id = undefined;

  /** sub-post -> 从帖; first-level -> 一级评论; second-level -> 其它级 */
  type_name = '';
}

export class like_Item {
  /** target_id */
  target_id = undefined;

  /** post or comment */
  type_name = '';
}

export class like_ListResponse {}

export class post_Comment {
  /** comment_num */
  comment_num = undefined;

  /** content */
  content = '';

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** id */
  id = undefined;

  /** is_liked */
  is_liked = false;

  /** like_num */
  like_num = undefined;

  /** replies */
  replies = [];

  /** time */
  time = '';
}

export class post_CreateRequest {
  /** category */
  category = '';

  /** content */
  content = '';

  /** md or rtf */
  content_type = '';

  /** tags */
  tags = [];

  /** title */
  title = '';

  /** normal -> 团队外; muxi -> 团队内 (type_name暂时均填normal) */
  type_name = '';
}

export class post_GetPostResponse {
  /** category */
  category = '';

  /** comment_num */
  comment_num = undefined;

  /** content */
  content = '';

  /** md or rtf */
  content_type = '';

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** id */
  id = undefined;

  /** is_collection */
  is_collection = false;

  /** is_liked */
  is_liked = false;

  /** like_num */
  like_num = undefined;

  /** sub_posts */
  sub_posts = [];

  /** tags */
  tags = [];

  /** time */
  time = '';

  /** title */
  title = '';
}

export class post_Post {
  /** category */
  category = '';

  /** comment_num */
  comment_num = undefined;

  /** comments */
  comments = [];

  /** content */
  content = '';

  /** md or rtf */
  content_type = '';

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** id */
  id = undefined;

  /** is_collection */
  is_collection = false;

  /** is_liked */
  is_liked = false;

  /** like_num */
  like_num = undefined;

  /** tags */
  tags = [];

  /** time */
  time = '';

  /** title */
  title = '';
}

export class post_SubPost {
  /** comment_num */
  comment_num = undefined;

  /** comments */
  comments = [];

  /** content */
  content = '';

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** id */
  id = undefined;

  /** is_liked */
  is_liked = false;

  /** like_num */
  like_num = undefined;

  /** time */
  time = '';
}

export class post_UpdateInfoRequest {
  /** category */
  category = '';

  /** content */
  content = '';

  /** id */
  id = undefined;

  /** tags */
  tags = [];

  /** title */
  title = '';
}

export class post_info {
  /** comment_num */
  comment_num = undefined;

  /** content */
  content = '';

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** id */
  id = undefined;

  /** is_liked */
  is_liked = false;

  /** like_num */
  like_num = undefined;

  /** time */
  time = '';
}

export class user {
  /** avatar */
  avatar = '';

  /** email */
  email = '';

  /** id */
  id = undefined;

  /** name */
  name = '';

  /** role */
  role = '';
}
