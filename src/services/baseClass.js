export class FeedItem {
  /** action */
  action = '';

  /** create_time */
  create_time = '';

  /** id */
  id = undefined;

  /** 分割线 */
  show_divider = false;

  /** source */
  source = new Source();

  /** user */
  user = new User();
}

export class FeedListResponse {
  /** list */
  list = [];
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

  /** name */
  name = '';

  /** type_name */
  type_name = '';
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

  /** is_public_collection_and_like */
  is_public_collection_and_like = false;

  /** is_public_feed */
  is_public_feed = false;

  /** name */
  name = '';

  /** signature */
  signature = '';
}

export class User {
  /** avatar_url */
  avatar_url = '';

  /** id */
  id = undefined;

  /** name */
  name = '';
}

export class UserProfile {
  /** avatar */
  avatar = '';

  /** email */
  email = '';

  /** id */
  id = undefined;

  /** is_public_collection_and_like */
  is_public_collection_and_like = false;

  /** is_public_feed */
  is_public_feed = false;

  /** name */
  name = '';

  /** role */
  role = '';

  /** signature */
  signature = '';
}

export class chat_Message {
  /** content */
  content = '';

  /** sender */
  sender = undefined;

  /** time */
  time = '';

  /** type_name */
  type_name = '';
}

export class comment_Comment {
  /** be_replied_content */
  be_replied_content = '';

  /** be_replied_user_id */
  be_replied_user_id = undefined;

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

  /** img_url */
  img_url = '';

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

  /** img_url */
  img_url = '';

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

export class post_Comment {
  /** be_replied_content */
  be_replied_content = '';

  /** be_replied_id */
  be_replied_id = undefined;

  /** be_replied_user_id */
  be_replied_user_id = undefined;

  /** be_replied_user_name */
  be_replied_user_name = '';

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

export class post_CreateRequest {
  /** category */
  category = '';

  /** compiled_content */
  compiled_content = '';

  /** content */
  content = '';

  /** md or rtf */
  content_type = '';

  /** normal -> 团队外; muxi -> 团队内 (type_name暂时均填normal) */
  domain = '';

  /** summary */
  summary = '';

  /** tags */
  tags = [];

  /** title */
  title = '';
}

export class post_GetPostResponse {
  /** category */
  category = '';

  /** collection_num */
  collection_num = undefined;

  /** comment_num */
  comment_num = undefined;

  /** compiled_content */
  compiled_content = '';

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

  /** summary */
  summary = '';

  /** tags */
  tags = [];

  /** time */
  time = '';

  /** title */
  title = '';
}

export class post_IdResponse {
  /** id */
  id = undefined;
}

export class post_ListMainPostResponse {
  /** posts */
  posts = [];
}

export class post_Post {
  /** category */
  category = '';

  /** collection_num */
  collection_num = undefined;

  /** comment_num */
  comment_num = undefined;

  /** comments */
  comments = [];

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

  /** summary */
  summary = '';

  /** tags */
  tags = [];

  /** time */
  time = '';

  /** title */
  title = '';
}

export class post_PostPartInfo {
  /** category */
  category = '';

  /** collection_num */
  collection_num = undefined;

  /** comment_num */
  comment_num = undefined;

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** id */
  id = undefined;

  /** like_num */
  like_num = undefined;

  /** summary */
  summary = '';

  /** tags */
  tags = [];

  /** time */
  time = '';

  /** title */
  title = '';
}

export class post_PostPartInfoResponse {
  /** posts */
  posts = [];
}

export class post_QiNiuToken {
  /** token */
  token = '';
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

  /** img_url */
  img_url = '';

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

  /** summary */
  summary = '';

  /** tags */
  tags = [];

  /** title */
  title = '';
}

export class report_CreateRequest {
  /** cause */
  cause = '';

  /** post_id */
  post_id = undefined;

  /** type_name */
  type_name = '';
}

export class report_HandleRequest {
  /** id */
  id = undefined;

  /** invalid or valid */
  result = '';
}

export class report_ListResponse {
  /** reports */
  reports = [];
}

export class report_Report {
  /** be_reported_user_id */
  be_reported_user_id = undefined;

  /** be_reported_user_name */
  be_reported_user_name = '';

  /** cause */
  cause = '';

  /** create_time */
  create_time = '';

  /** id */
  id = undefined;

  /** post_id */
  post_id = undefined;

  /** post_title */
  post_title = '';

  /** type_name */
  type_name = '';

  /** user_avatar */
  user_avatar = '';

  /** user_id */
  user_id = undefined;

  /** user_name */
  user_name = '';
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
