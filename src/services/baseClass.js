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

export class post_CreateRequest {
  /** category */
  category = '';

  /** content */
  content = '';

  /** title */
  title = '';

  /** typeId */
  typeId = undefined;
}

export class post_ListResponse {}

export class post_UpdateInfoRequest {
  /** category */
  category = '';

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
