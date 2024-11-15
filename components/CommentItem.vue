<template>
    <div :class="$style.index">
        <template v-if="comment != null">
            <div :class="$style.cover">
                <div :class="$style.head">
                    <div :class="$style.left">
                        <div :class="$style.nickname">{{ comment.user }}</div>
                    </div>
                    <div :class="$style.right">
                        <div :class="$style.date">
                            {{ convertKoreaTime(comment.created_at) }}
                        </div>
                        <template v-if="isEditor">
                            <span :class="$style.sep" />
                            <el-tooltip content="댓글 수정" placement="bottom">
                                <el-button
                                    @click="toggleEditMode"
                                    :class="$style.button"
                                    type="primary"
                                    :icon="ElIconEdit"
                                />
                            </el-tooltip>
                            <el-tooltip content="댓글 삭제" placement="bottom">
                                <el-button
                                    @click="deleteComment(comment.id)"
                                    :class="$style.button"
                                    type="danger"
                                    :icon="ElIconDelete"
                                />
                            </el-tooltip>

                            <template v-if="isRootComment(comment)">
                                <el-tooltip
                                    content="답글 쓰기"
                                    placement="bottom"
                                >
                                    <el-button
                                        @click="toggleReply"
                                        :class="$style.button"
                                        type="success"
                                        :icon="ElIconPlus"
                                    />
                                </el-tooltip>
                            </template>
                        </template>
                    </div>
                </div>
                <div v-if="!isEditing" :class="$style.body">
                    {{ comment.content }}
                </div>
                <el-input
                    v-if="isEditing"
                    v-model="updatedContent"
                    :class="$style.update"
                    type="textarea"
                />
            </div>
            <div v-if="isEditing" :class="$style.button">
                <el-button @click="updateComment"> 댓글 수정 </el-button>
            </div>

            <div v-if="isReply" :class="$style.reply">
                <el-input
                    v-model="replyContent"
                    :class="$style.input"
                    type="textarea"
                    placeholder="답글을 입력해 주세요"
                />
                <div :class="$style.cover">
                    <el-button @click="addReply"> 답글 작성 </el-button>
                </div>
            </div>

            <div v-if="replies && replies.length" :class="$style.replies">
                <CommentItem
                    v-for="(reply, index) in replies"
                    :key="'reply-' + index"
                    :comment="reply"
                    :replies="reply.replies"
                    :is-editing="reply.id === props.commentToUpdateId"
                    :is-editor="reply.user_id === authStore.userState?.id"
                    :is-reply="reply.id === props.replyToCommentId"
                    @toggleEdit="$emit('toggleEdit', reply.id)"
                    @update="$emit('update', reply.content)"
                    @delete="deleteComment(reply.id)"
                    @toggleReply="$emit('toggleReply', reply.id)"
                    @reply="$emit('reply', reply)"
                />
            </div>
        </template>
        <div v-else />
    </div>
</template>

<script setup lang="ts">
import type { CommentItem } from "~/structure/type";

const props = defineProps<{
    comment?: CommentItem | null;
    isEditing?: boolean | null;
    isEditor?: boolean | null;
    isReply?: boolean | null;
    replies?: CommentItem[] | null;
    commentToUpdateId?: number | null;
    replyToCommentId?: number | null;
}>();
const emit = defineEmits([
    "update",
    "toggleEdit",
    "delete",
    "toggleReply",
    "reply",
]);

const authStore = useAuthStore();

const updatedContent: Ref<string> = ref("");
const replyContent: Ref<string> = ref("");

const toggleEditMode = () => {
    emit("toggleEdit", props.comment?.id);
};

const updateComment = () => {
    if (props.comment == null) return;

    props.comment.content = updatedContent.value;

    emit("update", updatedContent.value);
};

const deleteComment = (commentId: number) => {
    emit("delete", commentId);
};

const toggleReply = () => {
    emit("toggleReply");
};

const addReply = () => {
    emit("reply", replyContent.value, props.comment?.id);

    replyContent.value = "";
};

onMounted(() => {
    updatedContent.value = props.comment?.content ?? "";
});

const isRootComment = (item: CommentItem) => {
    return item.parent_comment_id == null;
};
</script>

<style lang="scss" module>
.index {
    margin-bottom: 10px;

    > .cover {
        border: 1px solid;
        border-color: #bbb;

        > .head {
            padding: 4px 8px;

            background-color: #e2e2e2;

            display: flex;
            justify-content: space-between;
            align-items: center;

            > .right {
                display: flex;
                align-items: center;

                > .sep::before {
                    content: "|";
                    font-size: 16px;
                    line-height: 18px;

                    margin-inline: 8px;
                }

                > .button {
                    width: 20px;
                    height: 20px;
                }
            }
        }

        > .body {
            padding: 4px 8px;
        }
    }

    > .button {
        margin-top: 10px;

        display: flex;
        justify-content: flex-end;
    }

    > .update {
        display: flex;
        justify-content: flex-end;

        margin-top: 10px;
    }

    > .reply {
        > .input {
            padding-left: 10px;
            padding-top: 10px;
            padding-bottom: 10px;
        }

        > .cover {
            display: flex;
            justify-content: flex-end;
        }
    }

    > .replies {
        padding-block: 10px;
        padding-left: 10px;
    }
}
</style>
