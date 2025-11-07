import * as auth from './auth';
import * as chat from './chat';
import * as collection from './collection';
import * as comment from './comment';
import * as feed from './feed';
import * as like from './like';
import * as post from './post';
import * as report from './report';
import * as user from './user';

const API = {
  auth,
  chat,
  collection,
  comment,
  feed,
  like,
  post,
  report,
  user,
};

window.API = API;
export default API;
