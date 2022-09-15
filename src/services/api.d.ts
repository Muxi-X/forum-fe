type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
};

interface ResponseTypeWarpper<T> {
  code: number;
  data: T;
  message: string;
}

declare namespace defs {
  export class FeedItem {
    /** action */
    action?: string;

    /** date */
    date?: string;

    /** id */
    id?: number;

    /** 分割线 */
    show_divider?: boolean;

    /** source */
    source?: defs.Source;

    /** time */
    time?: string;

    /** user */
    user?: defs.FeedUser;
  }

  export class FeedListResponse {
    /** list */
    list?: Array<defs.FeedItem>;
  }

  export class FeedUser {
    /** avatar_url */
    avatar_url?: string;

    /** id */
    id?: number;

    /** name */
    name?: string;
  }

  export class ListResponse {
    /** count */
    count?: number;

    /** list */
    list?: Array<defs.user>;
  }

  export class Response {
    /** code */
    code?: number;

    /** data */
    data?: any;

    /** message */
    message?: string;
  }

  export class Source {
    /** id */
    id?: number;

    /** 类型，1 -> 团队，2 -> 项目，3 -> 文档，4 -> 文件，6 -> 进度（5 不使用） */
    kind?: number;

    /** name */
    name?: string;

    /** project_id */
    project_id?: number;

    /** project_name */
    project_name?: string;
  }

  export class StudentLoginRequest {
    /** password */
    password?: string;

    /** student_id */
    student_id?: string;
  }

  export class StudentLoginResponse {
    /** token */
    token?: string;
  }

  export class TeamLoginRequest {
    /** oauth_code */
    oauth_code?: string;
  }

  export class TeamLoginResponse {
    /** redirect_url */
    redirect_url?: string;

    /** token */
    token?: string;
  }

  export class UpdateInfoRequest {
    /** avatar_url */
    avatar_url?: string;

    /** email */
    email?: string;

    /** id */
    id?: number;

    /** name */
    name?: string;

    /** signature */
    signature?: string;
  }

  export class UserProfile {
    /** avatar */
    avatar?: string;

    /** email */
    email?: string;

    /** id */
    id?: number;

    /** name */
    name?: string;

    /** role */
    role?: string;

    /** signature */
    signature?: string;
  }

  export class chat_Id {
    /** id */
    id?: string;
  }

  export class collection_Collection {
    /** comment_num */
    comment_num?: number;

    /** content */
    content?: string;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** id */
    id?: number;

    /** post_id */
    post_id?: number;

    /** time */
    time?: string;

    /** title */
    title?: string;
  }

  export class collection_CreateRequest {
    /** post_id */
    post_id?: number;
  }

  export class comment_Comment {
    /** content */
    content?: string;

    /** create_time */
    create_time?: string;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** father_id */
    father_id?: number;

    /** id */
    id?: number;

    /** is_liked */
    is_liked?: boolean;

    /** like_num */
    like_num?: number;

    /** first-level -> 一级评论; second-level -> 其它级 */
    type_name?: string;
  }

  export class comment_CreateRequest {
    /** content */
    content?: string;

    /** father_id */
    father_id?: number;

    /** post_id */
    post_id?: number;

    /** sub-post -> 从帖; first-level -> 一级评论; second-level -> 其它级 */
    type_name?: string;
  }

  export class like_Item {
    /** target_id */
    target_id?: number;

    /** post or comment */
    type_name?: string;
  }

  export class like_ListResponse {}

  export class post_Comment {
    /** comment_num */
    comment_num?: number;

    /** content */
    content?: string;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** id */
    id?: number;

    /** is_liked */
    is_liked?: boolean;

    /** like_num */
    like_num?: number;

    /** replies */
    replies?: Array<defs.post_info>;

    /** time */
    time?: string;
  }

  export class post_CreateRequest {
    /** category */
    category?: string;

    /** content */
    content?: string;

    /** md or rtf */
    content_type?: string;

    /** tags */
    tags?: Array<string>;

    /** title */
    title?: string;

    /** normal -> 团队外; muxi -> 团队内 (type_name暂时均填normal) */
    type_name?: string;
  }

  export class post_GetPostResponse {
    /** category */
    category?: string;

    /** comment_num */
    comment_num?: number;

    /** content */
    content?: string;

    /** md or rtf */
    content_type?: string;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** id */
    id?: number;

    /** is_collection */
    is_collection?: boolean;

    /** is_liked */
    is_liked?: boolean;

    /** like_num */
    like_num?: number;

    /** sub_posts */
    sub_posts?: Array<defs.post_SubPost>;

    /** tags */
    tags?: Array<string>;

    /** time */
    time?: string;

    /** title */
    title?: string;
  }

  export class post_Post {
    /** category */
    category?: string;

    /** comment_num */
    comment_num?: number;

    /** comments */
    comments?: Array<defs.comment_Comment>;

    /** content */
    content?: string;

    /** md or rtf */
    content_type?: string;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** id */
    id?: number;

    /** is_collection */
    is_collection?: boolean;

    /** is_liked */
    is_liked?: boolean;

    /** like_num */
    like_num?: number;

    /** tags */
    tags?: Array<string>;

    /** time */
    time?: string;

    /** title */
    title?: string;
  }

  export class post_SubPost {
    /** comment_num */
    comment_num?: number;

    /** comments */
    comments?: Array<defs.post_Comment>;

    /** content */
    content?: string;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** id */
    id?: number;

    /** is_liked */
    is_liked?: boolean;

    /** like_num */
    like_num?: number;

    /** time */
    time?: string;
  }

  export class post_UpdateInfoRequest {
    /** category */
    category?: string;

    /** content */
    content?: string;

    /** id */
    id?: number;

    /** tags */
    tags?: Array<string>;

    /** title */
    title?: string;
  }

  export class post_info {
    /** comment_num */
    comment_num?: number;

    /** content */
    content?: string;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** id */
    id?: number;

    /** is_liked */
    is_liked?: boolean;

    /** like_num */
    like_num?: number;

    /** time */
    time?: string;
  }

  export class user {
    /** avatar */
    avatar?: string;

    /** email */
    email?: string;

    /** id */
    id?: number;

    /** name */
    name?: string;

    /** role */
    role?: string;
  }
}

declare namespace API {
  /**
   * 认证服务
   */
  export namespace auth {
    /**
        * 学生登录 api
login the student-forum
        * /auth/login/student
        */
    export namespace postStudent {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.StudentLoginResponse>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.StudentLoginRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * 团队登录 api
login the team-forum
        * /auth/login/team
        */
    export namespace postTeam {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.TeamLoginResponse>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.TeamLoginRequest,
        options?: any,
      ): Promise<Response>;
    }
  }

  /**
   * 聊天服务
   */
  export namespace chat {
    /**
        * 获取该用户的uuid
该用户发送信息前先获取自己的uuid，并放入query(id=?)，有效期24h
        * /chat
        */
    export namespace getChat {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.chat_Id>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * WebSocket
建立 WebSocket 连接
        * /chat/ws
        */
    export namespace getChatWs {
      export class Params {
        /** uuid */
        id: string;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<string>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }

  /**
   * 收藏服务
   */
  export namespace collection {
    /**
     * list收藏 api
     * /collection
     */
    export namespace getCollection {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<
        Array<defs.collection_Collection>
      >;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * 收藏帖子 api
     * /collection
     */
    export namespace postCollection {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.collection_CreateRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 取消收藏 api
     * /collection/{collection_id}
     */
    export namespace deleteCollectionByCollection_id {
      export class Params {
        /** collection_id */
        collection_id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }

  /**
   * 动态服务
   */
  export namespace feed {
    /**
     * list 此用户的动态 api
     * /feed/list
     */
    export namespace getList {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.FeedListResponse>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }

  /**
   * 帖子服务
   */
  export namespace post {
    /**
     * 修改帖子信息 api
     * /post
     */
    export namespace putPost {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.post_UpdateInfoRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 创建帖子 api
     * /post
     */
    export namespace postPost {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.post_CreateRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * list 主帖 api
type_name : normal -> 团队外; muxi -> 团队内 (type_name暂时均填normal); 根据category获取主帖list
        * /post/list/{type_name}
        */
    export namespace getPostListByType_name {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
        /** type_name */
        type_name: string;
        /** category */
        category?: string;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<Array<defs.post_Post>>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * list 我发布的帖子 api
     * /post/my/list
     */
    export namespace getPostMyList {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<Array<defs.post_Post>>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * list 热门tags api
降序
        * /post/popular_tags
        */
    export namespace getPostPopular_tags {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<Array<string>>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * 获取帖子 api
     * /post/{post_id}
     */
    export namespace getPostByPost_id {
      export class Params {
        /** post_id */
        post_id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.post_GetPostResponse>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * 删除帖子 api
     * /post/{post_id}
     */
    export namespace deletePostByPost_id {
      export class Params {
        /** post_id */
        post_id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }

  /**
   * 用户服务
   */
  export namespace user {
    /**
     * 修改用户个人信息 api
     * /user
     */
    export namespace putUser {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.UpdateInfoRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * list user api
通过 group 和 team 获取 user_list
        * /user/list/{group_id}/{team_id}
        */
    export namespace getUserListByGroup_idByTeam_id {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
        /** group_id */
        group_id: number;
        /** team_id */
        team_id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.ListResponse>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * get 我的 profile api
获取 my 完整 user 信息
        * /user/myprofile
        */
    export namespace getUserMyprofile {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.UserProfile>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * 获取用户 profile api
通过 userId 获取完整 user 信息（权限: Normal-普通学生用户; NormalAdmin-学生管理员; Muxi-团队成员; MuxiAdmin-团队管理员; SuperAdmin-超级管理员）
        * /user/profile/{id}
        */
    export namespace getUserProfileById {
      export class Params {
        /** user_id */
        id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.UserProfile>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }
}
