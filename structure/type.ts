export interface APIResponse<T> {
    success: boolean;
    data: T;

    errorCode?: string;
    error?: string;
}

export interface UserInfo {
    id: number;
    nickname: string;
    email: string;
}

export interface BoardList {
    id: number;
    title: string;
    slug: string;
    post: PostItem[];
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

export interface BoardInfo {
    id: number;
    title: string;
    description: string;
    slug: string;
}

export interface BoardArray {
    id: number;
    writer: string;
    title: string;
    content: string;
    written_time: Date;
    views: number;
    likes: number;
    dislikes: number;
    category_order: number;
}

export interface Post {
    post: PostItem;
}

export interface PostItem {
    id: number;
    title: string;
    writer_id: number;
    writer: string;
    likes: number;
    dislikes: number;
    views: number;
    written_time: Date;
    content: string;
}

export interface CommentItem {
    id: number;
    post_id: number;
    user_id: number;
    user: number;
    content: string;
    parent_comment_id?: number | null;
    created_at: Date;
    replies: CommentItem[];
}
