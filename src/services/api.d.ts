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

    /** create_time */
    create_time?: string;

    /** id */
    id?: number;

    /** 分割线 */
    show_divider?: boolean;

    /** source */
    source?: defs.Source;

    /** user */
    user?: defs.User;
  }

  export class FeedListResponse {
    /** list */
    list?: Array<defs.FeedItem>;
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

    /** name */
    name?: string;

    /** type_name */
    type_name?: string;
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

    /** is_public_collection_and_like */
    is_public_collection_and_like?: boolean;

    /** is_public_feed */
    is_public_feed?: boolean;

    /** name */
    name?: string;

    /** signature */
    signature?: string;
  }

  export class User {
    /** avatar_url */
    avatar_url?: string;

    /** id */
    id?: number;

    /** name */
    name?: string;
  }

  export class UserProfile {
    /** avatar */
    avatar?: string;

    /** email */
    email?: string;

    /** id */
    id?: number;

    /** is_public_collection_and_like */
    is_public_collection_and_like?: boolean;

    /** is_public_feed */
    is_public_feed?: boolean;

    /** name */
    name?: string;

    /** role */
    role?: string;

    /** signature */
    signature?: string;
  }

  export class chat_Message {
    /** content */
    content?: string;

    /** sender */
    sender?: number;

    /** time */
    time?: string;

    /** type_name */
    type_name?: string;
  }

  export class comment_Comment {
    /** be_replied_content */
    be_replied_content?: string;

    /** be_replied_user_id */
    be_replied_user_id?: number;

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

    /** img_url */
    img_url?: string;

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

    /** img_url */
    img_url?: string;

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

  export class post_Comment {
    /** be_replied_content */
    be_replied_content?: string;

    /** be_replied_id */
    be_replied_id?: number;

    /** be_replied_user_id */
    be_replied_user_id?: number;

    /** be_replied_user_name */
    be_replied_user_name?: string;

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

  export class post_CreateRequest {
    /** category */
    category?: string;

    /** compiled_content */
    compiled_content?: string;

    /** content */
    content?: string;

    /** md or rtf */
    content_type?: string;

    /** normal -> 团队外; muxi -> 团队内 (type_name暂时均填normal) */
    domain?: string;

    /** summary */
    summary?: string;

    /** tags */
    tags?: Array<string>;

    /** title */
    title?: string;
  }

  export class post_GetPostResponse {
    /** category */
    category?: string;

    /** collection_num */
    collection_num?: number;

    /** comment_num */
    comment_num?: number;

    /** compiled_content */
    compiled_content?: string;

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

    /** summary */
    summary?: string;

    /** tags */
    tags?: Array<string>;

    /** time */
    time?: string;

    /** title */
    title?: string;
  }

  export class post_IdResponse {
    /** id */
    id?: number;
  }

  export class post_ListMainPostResponse {
    /** posts */
    posts?: Array<defs.post_Post>;
  }

  export class post_Post {
    /** category */
    category?: string;

    /** collection_num */
    collection_num?: number;

    /** comment_num */
    comment_num?: number;

    /** comments */
    comments?: Array<defs.comment_Comment>;

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

    /** summary */
    summary?: string;

    /** tags */
    tags?: Array<string>;

    /** time */
    time?: string;

    /** title */
    title?: string;
  }

  export class post_PostPartInfo {
    /** category */
    category?: string;

    /** collection_num */
    collection_num?: number;

    /** comment_num */
    comment_num?: number;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** id */
    id?: number;

    /** like_num */
    like_num?: number;

    /** summary */
    summary?: string;

    /** tags */
    tags?: Array<string>;

    /** time */
    time?: string;

    /** title */
    title?: string;
  }

  export class post_PostPartInfoResponse {
    /** posts */
    posts?: Array<defs.post_PostPartInfo>;
  }

  export class post_QiNiuToken {
    /** token */
    token?: string;
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

    /** img_url */
    img_url?: string;

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

    /** summary */
    summary?: string;

    /** tags */
    tags?: Array<string>;

    /** title */
    title?: string;
  }

  export class report_CreateRequest {
    /** cause */
    cause?: string;

    /** id */
    id?: number;

    /** type_name */
    type_name?: string;
  }

  export class report_HandleRequest {
    /** id */
    id?: number;

    /** invalid or valid */
    result?: string;
  }

  export class report_ListResponse {
    /** reports */
    reports?: Array<defs.report_Report>;
  }

  export class report_Report {
    /** be_reported_user_id */
    be_reported_user_id?: number;

    /** be_reported_user_name */
    be_reported_user_name?: string;

    /** cause */
    cause?: string;

    /** create_time */
    create_time?: string;

    /** id */
    id?: number;

    /** post_id */
    post_id?: number;

    /** post_title */
    post_title?: string;

    /** type_name */
    type_name?: string;

    /** user_avatar */
    user_avatar?: string;

    /** user_id */
    user_id?: number;

    /** user_name */
    user_name?: string;
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

  export class user_CreateMessageRequest {
    /** message */
    message?: string;
  }

  export class user_ListMessageResponse {
    /** messages */
    messages?: Array<string>;
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
     * 获取该用户的聊天记录
     * /chat/history/{id}
     */
    export namespace getHistoryById {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** id */
        id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<Array<defs.chat_Message>>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * WebSocket
建立 WebSocket 连接
        * /chat/ws
        */
    export namespace getWs {
      export class Params {
        /** uuid */
        id: string;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.chat_Message>;

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
     * /collection/list/{user_id}
     */
    export namespace getListByUser_id {
      export class Params {
        /** user_id */
        user_id: number;
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response =
        ResponseTypeWarpper<defs.post_PostPartInfoResponse>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * 收藏/取消收藏帖子 api
     * /collection/{post_id}
     */
    export namespace postByPost_id {
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
   * 评论服务
   */
  export namespace comment {
    /**
     * 创建评论/从帖 api
     * /comment
     */
    export namespace postComment {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.comment_Comment>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.comment_CreateRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 获取评论 api
     * /comment/{comment_id}
     */
    export namespace getCommentByComment_id {
      export class Params {
        /** comment_id */
        comment_id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.comment_Comment>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * 删除评论 api
     * /comment/{comment_id}
     */
    export namespace deleteCommentByComment_id {
      export class Params {
        /** comment_id */
        comment_id: number;
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
     * list 用户的动态 api
     * /feed/list/{user_id}
     */
    export namespace getByUser_id {
      export class Params {
        /** user_id */
        user_id: number;
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
   * 点赞服务
   */
  export namespace like {
    /**
     * 点赞/取消点赞 api
     * /like
     */
    export namespace postLike {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.like_Item,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 获取用户点赞列表 api
     * /like/list/{user_id}
     */
    export namespace getLikeListByUser_id {
      export class Params {
        /** user_id */
        user_id: number;
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response =
        ResponseTypeWarpper<defs.post_PostPartInfoResponse>;

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

      export type Response = ResponseTypeWarpper<defs.post_IdResponse>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.post_CreateRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * list 主帖 api
根据category or tag 获取主帖list
        * /post/list/{domain}
        */
    export namespace getPostListByDomain {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
        /** category */
        category?: string;
        /** filter */
        filter?: string;
        /** search_content */
        search_content?: string;
        /** tag */
        tag?: string;
        /** normal -> 团队外; muxi -> 团队内 */
        domain: string;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response =
        ResponseTypeWarpper<defs.post_ListMainPostResponse>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * list 热门tags api
降序
        * /post/popular_tag
        */
    export namespace getPostPopular_tag {
      export class Params {
        /** category */
        category?: string;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<Array<string>>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * list 用户发布的帖子 api
     * /post/published/{user_id}
     */
    export namespace getPostPublishedByUser_id {
      export class Params {
        /** user_id */
        user_id: number;
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response =
        ResponseTypeWarpper<defs.post_PostPartInfoResponse>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * 获取七牛云token
     * /post/qiniu_token
     */
    export namespace getPostQiniu_token {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.post_QiNiuToken>;

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
   * 举报服务
   */
  export namespace report {
    /**
     * 处理举报 api
     * /report
     */
    export namespace putReport {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.report_HandleRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 举报帖子 api
     * /report
     */
    export namespace postReport {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.report_CreateRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * list举报 api
     * /report/list
     */
    export namespace getReportList {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.report_ListResponse>;

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
     * /user/list
     */
    export namespace getUserList {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.ListResponse>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
     * 创建 公共 message api
     * /user/message
     */
    export namespace postUserMessage {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.Response>;

      export const method: string;

      export function request(
        params: Params,
        body: defs.user_CreateMessageRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * list user message api
     * /user/message/list
     */
    export namespace getUserMessageList {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<defs.user_ListMessageResponse>;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * get 我的 profile api
获取 my 完整 user 信息（权限 role: Normal-普通学生用户; NormalAdmin-学生管理员; Muxi-团队成员; MuxiAdmin-团队管理员; SuperAdmin-超级管理员）
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
通过 userId 获取完整 user 信息（权限 role: Normal-普通学生用户; NormalAdmin-学生管理员; Muxi-团队成员; MuxiAdmin-团队管理员; SuperAdmin-超级管理员）
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
