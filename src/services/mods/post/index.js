/**
 * @description 帖子服务
 */
import * as putPost from './putPost';
import * as postPost from './postPost';
import * as getPostListByType_name from './getPostListByType_name';
import * as getPostPopular_tag from './getPostPopular_tag';
import * as getPostPublishedByUser_id from './getPostPublishedByUser_id';
import * as getPostQiniu_token from './getPostQiniu_token';
import * as getPostByPost_id from './getPostByPost_id';
import * as deletePostByPost_id from './deletePostByPost_id';

export {
  putPost,
  postPost,
  getPostListByType_name,
  getPostPopular_tag,
  getPostPublishedByUser_id,
  getPostQiniu_token,
  getPostByPost_id,
  deletePostByPost_id,
};
