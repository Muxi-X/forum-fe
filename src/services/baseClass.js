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
  role = undefined;
}

export class chat_Id {
  /** id */
  id = '';
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

  /** type_id */
  type_id = undefined;
}

export class comment_CreateRequest {
  /** content */
  content = '';

  /** fatherId */
  fatherId = undefined;

  /** postId */
  postId = undefined;

  /** typeId */
  typeId = undefined;
}

export class like_Item {
  /** target_id */
  target_id = undefined;

  /** type_id */
  type_id = undefined;
}

export class like_ListResponse {}

export class post_CreateRequest {
  /** category_id */
  category_id = undefined;

  /** content */
  content = '';

  /** main_post_id */
  main_post_id = undefined;

  /** title */
  title = '';

  /** type_id */
  type_id = undefined;
}

export class post_ListMainPostRequest {
  /** category_id */
  category_id = undefined;

  /** type_id */
  type_id = undefined;
}

export class post_ListResponse {
  /** posts */
  posts = [];
}

export class post_ListSubPostRequest {
  /** main_post_id */
  main_post_id = undefined;

  /** type_id */
  type_id = undefined;
}

export class post_Post {
  /** category_id */
  category_id = undefined;

  /** content */
  content = '';

  /** creator_avatar */
  creator_avatar = '';

  /** creator_id */
  creator_id = undefined;

  /** creator_name */
  creator_name = '';

  /** is_favorite */
  is_favorite = false;

  /** is_liked */
  is_liked = false;

  /** last_edit_time */
  last_edit_time = '';

  /** title */
  title = '';
}

export class post_UpdateInfoRequest {
  /** category_id */
  category_id = undefined;

  /** content */
  content = '';

  /** id */
  id = undefined;

  /** title */
  title = '';
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
  role = undefined;
}
