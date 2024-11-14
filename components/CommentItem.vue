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
                            <el-button
                                @click="toggleEditMode"
                                :class="$style.button"
                                type="primary"
                                :icon="ElIconEdit"
                            />
                        </template>
                    </div>
                </div>
                <div :class="$style.body" v-if="!isEditing">
                    {{ comment.content }}
                </div>
                <el-input
                    v-if="isEditing"
                    v-model="updatedContent"
                    :class="$style.update"
                    type="textarea"
                />
            </div>
            <div v-if="isEditing" :class="$style.update">
                <el-button @click="submitUpdate"> 댓글 수정 </el-button>
            </div>
        </template>
        <div v-else />
    </div>
</template>

<script setup lang="ts">
import type { commentItem } from "~/structure/type";

const props = defineProps<{
    comment?: commentItem | null;
    isEditing?: boolean | null;
    isEditor?: boolean | null;
}>();

const emit = defineEmits(["update", "toggleEdit"]);

const updatedContent: Ref<string> = ref("");

const toggleEditMode = () => {
    emit("toggleEdit");
};

const submitUpdate = () => {
    emit("update", updatedContent.value);
};

onMounted(() => {
    updatedContent.value = props.comment?.content ?? "";
});
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

    > .update {
        display: flex;
        justify-content: flex-end;

        margin-top: 10px;
    }
}
</style>
