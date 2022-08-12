type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
};

declare namespace defs {
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
    role?: number;
  }

  export class chat_Id {
    /** id */
    id?: string;
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

    /** type_id */
    type_id?: number;
  }

  export class comment_CreateRequest {
    /** content */
    content?: string;

    /** fatherId */
    fatherId?: number;

    /** postId */
    postId?: number;

    /** typeId */
    typeId?: number;
  }

  export class like_Item {
    /** target_id */
    target_id?: number;

    /** type_id */
    type_id?: number;
  }

  export class like_ListResponse {}

  export class post_CreateRequest {
    /** category_id */
    category_id?: number;

    /** content */
    content?: string;

    /** main_post_id */
    main_post_id?: number;

    /** title */
    title?: string;

    /** type_id */
    type_id?: number;
  }

  export class post_ListMainPostRequest {
    /** category_id */
    category_id?: number;

    /** type_id */
    type_id?: number;
  }

  export class post_ListResponse {
    /** posts */
    posts?: Array<defs.post_Post>;
  }

  export class post_ListSubPostRequest {
    /** main_post_id */
    main_post_id?: number;

    /** type_id */
    type_id?: number;
  }

  export class post_Post {
    /** category_id */
    category_id?: number;

    /** content */
    content?: string;

    /** creator_avatar */
    creator_avatar?: string;

    /** creator_id */
    creator_id?: number;

    /** creator_name */
    creator_name?: string;

    /** is_favorite */
    is_favorite?: boolean;

    /** is_liked */
    is_liked?: boolean;

    /** last_edit_time */
    last_edit_time?: string;

    /** title */
    title?: string;
  }

  export class post_UpdateInfoRequest {
    /** category_id */
    category_id?: number;

    /** content */
    content?: string;

    /** id */
    id?: number;

    /** title */
    title?: string;
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
    role?: number;
  }
}

declare namespace API {
  /**
   * 认证服务
   */
  export namespace auth {
    /**
        * login api
login the student-forum
        * /auth/login/student
        */
    export namespace postStudent {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.StudentLoginResponse;

      export const method: string;

      export function request(
        params: Params,
        body: defs.StudentLoginRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * login api
login the team-forum
        * /auth/login/team
        */
    export namespace postTeam {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.TeamLoginResponse;

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

      export type Response = defs.chat_Id;

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

      export type Response = any;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }

  /**
   * 帖子服务
   */
  export namespace post {
    /**
        * update post info api
修改帖子信息
        * /post
        */
    export namespace putPost {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.Response;

      export const method: string;

      export function request(
        params: Params,
        body: defs.post_UpdateInfoRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * 创建帖子 api
(type_id = 1 -> 团队内(type_id暂时不用管))
        * /post
        */
    export namespace postPost {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.Response;

      export const method: string;

      export function request(
        params: Params,
        body: defs.post_CreateRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * list 主贴 api
type_id = 1 -> 团队内 (type_id暂时均填0); 根据category获取主贴list
        * /post/list
        */
    export namespace getPostList {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.post_ListResponse;

      export const method: string;

      export function request(
        params: Params,
        body: defs.post_ListMainPostRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * list 从贴 api
type_id = 1 -> 团队内 (type_id暂时均填0); 根据 main_post_id 获取主贴的从贴list
        * /post/list/{main_post_id}
        */
    export namespace getPostListByMain_post_id {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
        /** main_post_id */
        main_post_id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.post_ListResponse;

      export const method: string;

      export function request(
        params: Params,
        body: defs.post_ListSubPostRequest,
        options?: any,
      ): Promise<Response>;
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

      export type Response = defs.Response;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }

  /**
   * 用户服务
   */
  export namespace user {
    /**
        * update info api
修改用户个人信息
        * /user
        */
    export namespace putUser {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.Response;

      export const method: string;

      export function request(
        params: Params,
        body: defs.UpdateInfoRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * get user_list api
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

      export type Response = defs.ListResponse;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * get my_profile api
获取 my 完整 user 信息
        * /user/myprofile
        */
    export namespace getUserMyprofile {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.UserProfile;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * get user_profile api
通过 userId 获取完整 user 信息
        * /user/profile/{id}
        */
    export namespace getUserProfileById {
      export class Params {
        /** user_id */
        id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.UserProfile;

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }
}
