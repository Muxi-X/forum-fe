type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
};

declare type ConfigInterface = import('swr').ConfigInterface;

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

  export class post_CreateRequest {
    /** category */
    category?: string;

    /** content */
    content?: string;

    /** title */
    title?: string;

    /** typeId */
    typeId?: number;
  }

  export class post_ListResponse {}

  export class post_UpdateInfoRequest {
    /** category */
    category?: string;

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

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

      export const method: string;

      export function request(
        params: Params,
        body: defs.TeamLoginRequest,
        options?: any,
      ): Promise<Response>;
    }
  }

  /**
   * 帖子服务
   */
  export namespace post {
    /**
     * 创建评论 api
     * /comment
     */
    export namespace postComment {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.Response;

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export type Response = defs.Response;

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }

    /**
        * update post info api
修改帖子信息
        * /post
        */
    export namespace putPost {
      export class Params {}

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.Response;

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

      export const method: string;

      export function request(
        params: Params,
        body: defs.post_CreateRequest,
        options?: any,
      ): Promise<Response>;
    }

    /**
        * list post api
获取帖子 (type_id = 1 -> 团队内(type_id暂时均填0))
        * /post/list/{type_id}
        */
    export namespace getPostListByType_id {
      export class Params {
        /** limit */
        limit?: number;
        /** page */
        page?: number;
        /** last_id */
        last_id?: number;
        /** type_id */
        type_id: number;
      }

      export type HooksParams = (() => Params) | Params;

      export type Response = defs.post_ListResponse;

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export type Response = defs.Response;

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export type Response = defs.Response;

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

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

      export function mutate(
        params?: HooksParams,
        newValue?: any,
        shouldRevalidate = true,
      );

      export function trigger(params?: HooksParams, shouldRevalidate = true);

      export function useRequest(
        params?: HooksParams,
        options?: ConfigInterface,
      ): { isLoading: boolean; data: Response; error: Error };

      export const method: string;

      export function request(params: Params, options?: any): Promise<Response>;
    }
  }
}
