<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <template v-if="postItem != null">
                <template v-if="!editMode">
                    <div :class="$style.head">
                        <div :class="$style.title">
                            <div :class="$style.text">
                                {{ postItem.title }}
                            </div>
                            <div v-if="isWriter()" :class="$style.buttons">
                                <el-tooltip
                                    content="글 수정"
                                    placement="bottom"
                                >
                                    <el-button
                                        @click="toggleEditMode"
                                        type="primary"
                                        :icon="ElIconEdit"
                                    />
                                </el-tooltip>

                                <el-tooltip
                                    content="글 삭제"
                                    placement="bottom"
                                >
                                    <el-button
                                        @click="deletePost"
                                        type="danger"
                                        :icon="ElIconDelete"
                                    />
                                </el-tooltip>
                            </div>
                        </div>
                        <div :class="$style.desc">
                            <div :class="$style.left">
                                <div :class="$style.writer">
                                    {{ postItem.writer }}
                                </div>
                            </div>
                            <div :class="$style.right">
                                <div :class="$style.likes">
                                    <span :class="$style.head"> 추천 </span>
                                    <span :class="$style.body">
                                        {{ postItem.likes }}
                                    </span>
                                </div>
                                <div :class="$style.sep" />
                                <div :class="$style.comments">
                                    <span :class="$style.head"> </span>
                                    <span :class="$style.body"> </span>
                                </div>
                                <!-- <div :class="$style.sep" /> -->

                                <div :class="$style.views">
                                    <span :class="$style.head"> 조회수 </span>
                                    <span :class="$style.body">
                                        {{ postItem.views }}
                                    </span>
                                </div>
                                <div :class="$style.sep" />

                                <div :class="$style.date">
                                    <span :class="$style.head"> 작성일 </span>
                                    <span :class="$style.body">
                                        {{
                                            convertKoreaTime(
                                                postItem.written_time
                                            )
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-html="sanitizeContent(postItem.content)"
                        :class="$style.content"
                    />

                    <div :class="$style.footer">
                        <div :class="$style.likes">
                            <el-button
                                @click="addLike"
                                :icon="ElIconMedal"
                                type="primary"
                                :class="$style.button"
                            >
                                <div>추천</div>
                                <div>
                                    {{ postItem.likes }}
                                </div>
                            </el-button>
                            <el-button
                                @click="addDisLike"
                                :class="$style.button"
                                :icon="ElIconRemove"
                                type="danger"
                            >
                                <div>비추천</div>
                                <div>
                                    {{ postItem.dislikes }}
                                </div>
                            </el-button>
                        </div>

                        <div :class="$style.comment">
                            <div :class="$style.title">
                                <div :class="$style.text">
                                    <span>댓글:</span>
                                    <span> [{{ getCommentLength() }}] </span>
                                </div>
                                <div :class="$style.write">
                                    <el-button
                                        @click="goWrite"
                                        :icon="ElIconEdit"
                                        type="primary"
                                    >
                                        글쓰기
                                    </el-button>
                                </div>
                            </div>
                            <div :class="$style.list">
                                <CommentItem
                                    v-for="(item, index) in commentList"
                                    :key="'comment-' + index"
                                    :comment="item"
                                    :is-editing="item.id === commentToUpdateId"
                                    :is-editor="
                                        item.user_id === authStore.userState?.id
                                    "
                                    :is-reply="item.id === replyToCommentId"
                                    :comment-to-update-id="commentToUpdateId"
                                    :reply-to-comment-id="replyToCommentId"
                                    :replies="item.replies"
                                    @toggleEdit="toggleCommentEditMode"
                                    @update="updateComment"
                                    @delete="deleteComment"
                                    @toggleReply="toggleReplyMode(item.id)"
                                    @reply="addReplyComment"
                                />

                                <el-input
                                    v-model="comment"
                                    :rows="2"
                                    type="textarea"
                                    :class="$style.input"
                                    :placeholder="getCommentPlaceholder()"
                                    :disabled="!isLogin()"
                                />
                                <div :class="$style.write">
                                    <el-button
                                        v-if="isLogin()"
                                        @click="addComment()"
                                    >
                                        댓글 작성
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <Editor
                        @toggle="toggleEditMode"
                        :category="category"
                        :editMode="editMode"
                        :postItem="postItem"
                    />
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import DOMPurify from "dompurify";
import type {
    APIResponse,
    Post,
    PostItem,
    CommentItem,
} from "~/structure/type";

const route = useRoute();
const config = useRuntimeConfig();

const category: Ref<string> = ref("");

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const id: Ref<number> = ref(0);
const postItem: Ref<PostItem | null> = ref(null);
const editMode: Ref<boolean> = ref(false);

const commentList: Ref<CommentItem[] | null> = ref(null);
const comment: Ref<string> = ref("");
const commentToUpdateId: Ref<number | null> = ref(null);
const replyToCommentId: Ref<number | null> = ref(null);

const getPostItem = async () => {
    loadingStore.globalLoading = true;

    try {
        const result: APIResponse<Post> = await $fetch("/post", {
            baseURL: config.public.apiBase,
            method: "GET",
            query: {
                id: id.value,
            },
        });

        postItem.value = result.data.post;
    } catch (error) {
        ElMessage({ message: "존재하지 않는 글입니다.", type: "error" });

        await navigateTo("/");
        return;
    } finally {
        loadingStore.globalLoading = false;
    }
};

const goWrite = () => {
    navigateTo({ path: "/board/write", query: { category: category.value } });
};

const sanitizeContent = (content: string): string => {
    if (postItem.value == null) return "";

    return DOMPurify.sanitize(content);
};

const isLogin = (): boolean => {
    return authStore.userState != null;
};

const getCommentPlaceholder = (): string => {
    return isLogin()
        ? "댓글을 입력해 주세요"
        : "댓글을 입력하려면 로그인해 주세요";
};

const getCommentLength = (): number => {
    if (commentList.value == null) return 0;

    return commentList.value.length + countReplies();
};

const countReplies = (): number => {
    if (commentList.value == null) return 0;

    return commentList.value.reduce((total, comment) => {
        return total + (comment.replies ? comment.replies.length : 0);
    }, 0);
};

const addLike = async () => {
    if (postItem.value == null) return;
    if (loadingStore.globalLoading) return;

    if (authStore.userState == null) {
        ElMessage({ message: "로그인이 필요합니다.", type: "error" });

        return;
    }

    postItem.value.likes += 1;

    loadingStore.globalLoading = true;

    try {
        const result: APIResponse<null> = await $fetch("/post/like", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: {
                postId: postItem.value.id,
                userId: authStore.userState.id,
            },
        });

        if (!result.success) {
            ElMessage({
                message: "이미 추천된 게시글입니다.",
                type: "error",
            });

            postItem.value.likes -= 1;
        }
    } catch (error) {
        return;
    } finally {
        loadingStore.globalLoading = false;
    }
};

const addDisLike = async () => {
    if (postItem.value == null) return;
    if (loadingStore.globalLoading) return;

    if (authStore.userState == null) {
        ElMessage({ message: "로그인이 필요합니다.", type: "error" });

        return;
    }

    postItem.value.dislikes += 1;

    loadingStore.globalLoading = true;

    try {
        const result: APIResponse<null> = await $fetch("/post/dislike", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: {
                postId: postItem.value.id,
                userId: authStore.userState.id,
            },
        });

        if (!result.success) {
            ElMessage({
                message: "이미 비추천된 게시글입니다.",
                type: "error",
            });

            postItem.value.dislikes -= 1;
        }
    } catch (error) {
        return;
    } finally {
        loadingStore.globalLoading = false;
    }
};

const getComments = async () => {
    if (postItem.value == null) return;

    loadingStore.globalLoading = true;

    try {
        const result: APIResponse<CommentItem[]> = await $fetch("/comment", {
            baseURL: config.public.apiBase,
            method: "GET",
            query: {
                postId: postItem.value.id,
            },
        });

        commentList.value = result.data;
    } catch {
        return;
    } finally {
        loadingStore.globalLoading = false;
    }
};

const addComment = async () => {
    if (postItem.value == null) return;
    if (loadingStore.globalLoading) return;

    if (authStore.userState == null) {
        ElMessage({ message: "로그인이 필요합니다.", type: "error" });

        return;
    }

    loadingStore.globalLoading = true;

    try {
        await $fetch("/comment", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: {
                postId: postItem.value.id,
                userId: authStore.userState.id,
                content: comment.value,
            },
        });
    } catch {
        ElMessage({
            message: "댓글 추가에 실패했습니다. 다시 시도해 주세요.",
            type: "error",
        });
        return;
    } finally {
        loadingStore.globalLoading = false;
    }

    ElMessage({ message: "댓글이 추가되었습니다.", type: "success" });

    comment.value = "";

    await getComments();
};

onMounted(async () => {
    if (typeof route.query.id === "string") {
        id.value = Number(route.query.id);
    }

    if (typeof route.query.category === "string") {
        category.value = route.query.category;
    }

    await getPostItem();
    await getComments();
});

const isWriter = (): boolean => {
    if (authStore.userState == null || postItem.value == null) {
        return false;
    }

    return postItem.value.writer_id == authStore.userState.id;
};

const toggleEditMode = () => {
    editMode.value = !editMode.value;
};

const deletePost = async () => {
    if (postItem.value == null) return;
    if (loadingStore.globalLoading) return;

    loadingStore.globalLoading = true;

    try {
        await $fetch("/post/delete", {
            baseURL: config.public.apiBase,
            method: "DELETE",
            body: {
                postId: postItem.value?.id,
            },
        });
    } catch (error) {
        return;
    } finally {
        loadingStore.globalLoading = false;
    }

    await navigateTo("/");
};

const toggleCommentEditMode = (commentId: number) => {
    commentToUpdateId.value =
        commentToUpdateId.value === commentId ? null : commentId;
};

const updateComment = async (updated: string) => {
    if (loadingStore.globalLoading) return;

    loadingStore.globalLoading = true;

    try {
        await $fetch("/comment", {
            baseURL: config.public.apiBase,
            method: "PATCH",
            body: {
                commentId: commentToUpdateId.value,
                content: updated,
            },
        });
    } catch (error) {
        return;
    } finally {
        loadingStore.globalLoading = false;
    }

    commentToUpdateId.value = null;

    ElMessage({ message: "댓글이 수정되었습니다.", type: "success" });

    await getComments();
};

const deleteComment = async (commentId: number) => {
    if (loadingStore.globalLoading) return;
    if (commentList.value == null) return;

    loadingStore.globalLoading = true;

    try {
        await $fetch("/comment", {
            baseURL: config.public.apiBase,
            method: "DELETE",
            body: {
                commentId: commentId,
            },
        });

        await getComments();

        ElMessage({ message: "댓글이 삭제되었습니다.", type: "success" });
    } catch (error) {
        console.error("Error deleting comment:", error);
    } finally {
        loadingStore.globalLoading = false;
    }
};

const toggleReplyMode = (commentId: number) => {
    replyToCommentId.value =
        replyToCommentId.value === commentId ? null : commentId;
};

const addReplyComment = async (
    content: string,
    parentId: number | null = null
) => {
    if (!content.trim()) {
        ElMessage({ message: "답글 내용을 입력해 주세요.", type: "warning" });
        return;
    }

    if (postItem.value == null || loadingStore.globalLoading) return;

    if (authStore.userState == null) {
        ElMessage({ message: "로그인이 필요합니다.", type: "error" });
        return;
    }

    try {
        await $fetch("/comment", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: {
                postId: postItem.value.id,
                userId: authStore.userState.id,
                parentCommentId: parentId,
                content: content,
            },
        });

        ElMessage({ message: "답글이 추가되었습니다.", type: "success" });

        replyToCommentId.value = null;

        await getComments();
    } catch (error) {
        console.error("Error adding reply:", error);
        ElMessage({
            message: "답글 추가에 실패했습니다. 다시 시도해 주세요.",
            type: "error",
        });
    } finally {
        loadingStore.globalLoading = false;
    }
};
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 100%;

    > .inner {
        > .head {
            margin-top: 10px;

            border-top: 1px solid;
            border-bottom: 1px solid;

            border-color: #bbb;

            > .title {
                font-size: 18px;
                font-weight: bold;

                background-color: #eee;

                padding: 8px 12px;

                border-bottom: 1px solid;
                border-color: #bbb;

                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            > .desc {
                padding: 8px 12px;

                display: flex;
                align-items: center;

                > .left {
                    display: flex;
                    flex: 1;
                }

                > .right {
                    font-size: 14px;
                    line-height: 18px;

                    display: flex;

                    > div > span.head {
                        font-weight: 600;

                        margin-right: 4px;
                    }

                    > .sep::before {
                        content: "|";
                        line-height: 14px;

                        margin: 3px;
                    }
                }
            }
        }

        > .content {
            min-height: 400px;

            padding: 10px;
        }

        > .footer {
            > .likes {
                display: flex;
                justify-content: center;
                align-items: center;

                gap: 10px;

                > .button {
                    > span {
                        gap: 4px;
                    }
                }
            }

            > .comment {
                > .title {
                    margin-top: 10px;

                    display: flex;
                    align-items: center;

                    > .text {
                        font-size: 20px;
                        flex: 1;

                        > span:first-child {
                            margin-right: 2px;
                        }
                    }
                }

                > .list {
                    margin-top: 20px;

                    > .write {
                        margin-top: 10px;

                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }
        }
    }
}
</style>
