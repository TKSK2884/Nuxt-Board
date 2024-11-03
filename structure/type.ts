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
    id: number;
    nickname: string;
}

export interface BoardList {
    id: number;
    title: string;
    category: string;
    post: Post[];
}

export interface WritePost {
    title: string;
    contnet: string;
    author: string;
}

export interface Board {
    total?: number;
    array: BoardArray[];
}

export interface BoardArray {
    id: number;
    writer: string;
    title: string;
    content: string;
    written_time: Date;
    views: number;
    likes: number;
    category_order: number;
}

export interface PostItem {
    id: number;
    title: string;
    writer_id: number;
    writer: string;
    likes: number;
    views: number;
    date: Date;
    content: string;
}
