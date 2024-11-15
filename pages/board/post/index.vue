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
                                <div :class="$style.text">댓글</div>
                                <div :class="$style.write">
                                    <el-button
                                        v-if="isUpdate()"
                                        @click="toggleEditMode"
                                    >
                                        글 수정
                                    </el-button>
                                    <el-button @click="goWrite"
                                        >글 쓰기</el-button
                                    >
                                </div>
                            </div>
                            <div :class="$style.list">
                                <CommentItem
                                    v-for="(item, index) in commentList"
                                    :key="'comment-' + index"
                                    :comment="item"
                                    :isEditing="item.id === commentToUpdateId"
                                    :isEditor="
                                        item.user_id === authStore.userState?.id
                                    "
                                    @toggleEdit="toggleCommentEditMode(item.id)"
                                    @update="updateComment"
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
    commentItem,
} from "~/structure/type";

const route = useRoute();
const config = useRuntimeConfig();

const category: Ref<string> = ref("");

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const id: Ref<number> = ref(0);
const postItem: Ref<PostItem | null> = ref(null);
const editMode: Ref<boolean> = ref(false);

const commentList: Ref<commentItem[] | null> = ref(null);
const comment: Ref<string> = ref("");
const commentToUpdateId: Ref<number | null> = ref(null);

const getPostItem = async () => {
    loadingStore.globalLoading = true;

    try {
        const result: APIResponse<Post> = await $fetch("/read", {
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
        ? "댓글을 입력해주세요"
        : "댓글을 입력하려면 로그인 해주세요";
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
        const result: APIResponse<null> = await $fetch("/like", {
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
        const result: APIResponse<null> = await $fetch("/dislike", {
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
        const result: APIResponse<commentItem[]> = await $fetch("/comments", {
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
        await $fetch("/comment/create", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: {
                postId: postItem.value.id,
                userId: authStore.userState.id,
                parentCommentId: null,
                comment: comment.value,
            },
        });
    } catch {
        return;
    } finally {
        loadingStore.globalLoading = false;
    }

    ElMessage({ message: "댓글이 추가되었습니다.", type: "success" });

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

const isUpdate = (): boolean => {
    if (authStore.userState == null || postItem.value == null) {
        return false;
    }

    return postItem.value.writer_id == authStore.userState.id;
};

const toggleEditMode = () => {
    editMode.value = !editMode.value;
};

const toggleCommentEditMode = (commentId: number) => {
    commentToUpdateId.value =
        commentToUpdateId.value === commentId ? null : commentId;
};

const updateComment = async (updated: string) => {
    loadingStore.globalLoading = true;

    try {
        await $fetch("/comment/update", {
            baseURL: config.public.apiBase,
            method: "POST",
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

                background-color: #eee;

                padding: 8px 12px;

                border-bottom: 1px solid;
                border-color: #bbb;
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
                    display: flex;
                    font-size: 14px;
                    line-height: 18px;

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
            padding: 10px;
        }

        > .footer {
            > .likes {
                display: flex;
                justify-content: center;
                align-items: center;

                gap: 10px;
            }

            > .comment {
                > .title {
                    margin-top: 10px;

                    display: flex;
                    align-items: center;

                    > .text {
                        font-size: 20px;
                        flex: 1;
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
