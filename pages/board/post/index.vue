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
                            <el-button :class="$style.button"> 추천 </el-button>
                            <el-button :class="$style.button">
                                비추천
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
                                <div :class="$style.item"></div>
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
import type { APIResponse, Post, PostItem } from "~/structure/type";

const route = useRoute();
const config = useRuntimeConfig();

const category: Ref<string> = ref("");

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const id: Ref<number> = ref(0);
const postItem: Ref<PostItem | null> = ref(null);
const editMode: Ref<boolean> = ref(false);

const getPostItem = async () => {
    loadingStore.globalLoading = true;

    try {
        const result: APIResponse<Post> = await $fetch("/read", {
            baseURL: config.public.apiBase,
            query: {
                id: id.value,
            },
        });

        postItem.value = result.data.post;
    } catch (error) {
        ElMessage({ message: "존재하지 않는 글입니다.", type: "error" });

        navigateTo("/");
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

onMounted(() => {
    if (typeof route.query.id === "string") {
        id.value = Number(route.query.id);
    }

    if (typeof route.query.category === "string") {
        category.value = route.query.category;
    }

    getPostItem();
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

            @for $i from 1 through 8 {
                [data-indent="#{$i}"] {
                    $val: $i * 30px;
                    padding-left: $val;
                }
            }
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
                    display: flex;

                    align-items: center;

                    > .text {
                        font-size: 20px;
                        flex: 1;
                    }
                }
            }
        }
    }
}
</style>
