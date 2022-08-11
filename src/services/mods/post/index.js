/**
 * @description 帖子服务
 */
import * as postComment from './postComment';
import * as getCommentByComment_id from './getCommentByComment_id';
import * as putPost from './putPost';
import * as postPost from './postPost';
import * as getPostListByType_id from './getPostListByType_id';
import * as getPostByPost_id from './getPostByPost_id';
import * as deletePostByPost_id from './deletePostByPost_id';

export {
  postComment,
  getCommentByComment_id,
  putPost,
  postPost,
  getPostListByType_id,
  getPostByPost_id,
  deletePostByPost_id,
};
