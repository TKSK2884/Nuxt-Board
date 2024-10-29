export interface Post {
    id: number;
    postTitle: string;
    feedback: number;
    time: number;
}

export interface APIResponse<T> {
    success: boolean;
    data: T;

    errorCode?: string;
    error?: string;
}

export interface UserInfo {
    id: string;
    nickname: string;
}
