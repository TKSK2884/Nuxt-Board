<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <el-input v-model="title" :class="$style.title" />
            <div :class="$style.container">
                <client-only>
                    <div v-if="editor != null" :class="$style.editor">
                        <Ckeditor
                            :editor="editor"
                            v-model="content"
                            :class="$style.inner"
                        />
                    </div>
                </client-only>
            </div>
            <div :class="$style.bottom">
                <el-button @click="writeContent">
                    {{ isEditModeText() }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type { RuntimeConfig } from "nuxt/schema";
import type { PostItem } from "~/structure/type";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const config: RuntimeConfig = useRuntimeConfig();
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const editor: Ref<typeof ClassicEditor | null> = ref(null);
const content: Ref<string> = ref("");

const props = defineProps<{
    category?: string;
    postItem?: PostItem | null;
    editMode?: boolean | null;
}>();
const emit = defineEmits(["toggle"]);

const title: Ref<string> = ref("");

onMounted(async () => {
    if (authStore.userState == null) {
        ElMessage({ message: "로그인이 필요합니다.", type: "warning" });

        navigateTo("/auth/login");

        return;
    }

    if (props.editMode && props.postItem != null) {
        title.value = props.postItem.title;
        content.value = props.postItem.content;
    }

    if (process.server) {
        return;
    }

    const { default: ClassicEditor } = await import(
        "@ckeditor/ckeditor5-build-classic"
    );

    editor.value = ClassicEditor;
});

onBeforeUnmount(() => {
    editor.value = null;
});

const writeContent = async () => {
    if (title.value.trim() == "") {
        ElMessage({ message: "제목을 입력해주세요", type: "warning" });
        return;
    }

    if (content.value.trim() == "") {
        ElMessage({ message: "내용을 입력해주세요", type: "warning" });
        return;
    }

    if (loadingStore.globalLoading) {
        return;
    }

    loadingStore.globalLoading = true;

    try {
        if (props.editMode) {
            await $fetch("/post", {
                baseURL: config.public.apiBase,
                method: "PUT",
                body: {
                    id: props.postItem?.id,
                    title: title.value,
                    content: content.value,
                },
            });
        } else {
            await $fetch("/post", {
                baseURL: config.public.apiBase,
                method: "POST",
                body: {
                    title: title.value,
                    content: content.value,
                    writer: authStore.userState?.id,
                    category: props.category,
                },
            });
        }
    } catch (error) {
        ElMessage({ message: "쓰기 실패", type: "error" });
        return;
    } finally {
        loadingStore.globalLoading = false;
    }

    ElMessage({ message: isEditModeText() + "성공", type: "success" });

    navigateTo({
        path: "/board",
        query: { category: props.category },
    });
};

const isEditModeText = (): string => {
    return props.editMode ? "글 수정 " : "글 작성";
};
</script>

<style lang="scss" module>
@import "@/assets/css/utils.scss";

.index {
    width: 100%;
    height: 100%;

    > .inner {
        width: 100%;
        height: 100%;

        padding-top: 20px;

        > .title {
            margin-bottom: 10px;
        }

        > .container {
            border: 1px solid #bbb;
            border-radius: 10px;

            :global(.el-button + .el-button) {
                margin-left: 0px;
            }

            .button {
                padding: 0px 18px;
            }

            > .control {
                padding: 8px;

                // background-color: #43494c;
                display: flex;
                justify-content: space-between;

                border-top-left-radius: 10px;
                border-top-right-radius: 10px;

                > .left {
                    display: flex;
                    gap: 4px;

                    > .bold {
                        @include icon-image("bold-solid.svg");
                    }

                    > .italic {
                        @include icon-image("italic-solid.svg");
                    }

                    > :global(.el-dropdown) {
                        > .size {
                            @include icon-image("text-height-solid.svg");
                        }
                    }

                    > .underline {
                        @include icon-image("underline-solid.svg");
                    }

                    > .slash {
                        @include icon-image("text-slash-solid.svg");
                    }
                }

                > .right {
                    display: flex;
                    gap: 4px;

                    > .undo {
                        @include icon-image("undo-arrow.svg");
                    }

                    > .redo {
                        @include icon-image("redo-arrow.svg");
                    }
                }

                .button {
                    &:hover {
                        background-color: #f5f5f5;
                        border-color: #f5f5f5;
                        color: black;
                    }

                    &:global(.is-active) {
                        background-color: #f5f5f5;
                        border-color: #f5f5f5;
                        color: black;
                    }
                }

                > .enableExtend:global(.is-active) {
                    transform: translateY(8px);
                    transition-duration: 0.5s;
                }
            }
            > .extend {
                background-color: #f5f5f5;

                padding: 8px;
                display: flex;
                gap: 4px;

                > .left {
                    @include icon-image("align-left-solid.svg");
                }

                > .center {
                    @include icon-image("align-center-solid.svg");
                }

                > .right {
                    @include icon-image("align-right-solid.svg");
                }

                > .order {
                    @include icon-image("list-ol-solid.svg");
                }

                > .bullet {
                    @include icon-image("list-ul-solid.svg");
                }

                > .indent {
                    @include icon-image("indent-solid.svg");
                }

                > .outdent {
                    @include icon-image("outdent-solid.svg");
                }

                > .button:hover {
                    background-color: #ebebeb;
                    border-color: #ebebeb;
                    // color: black;
                }

                > .button:global(.is-active) {
                    background-color: #ebebeb;
                    border-color: #ebebeb;
                }
            }

            > .editor {
                :global(.ck-content) {
                    height: 600px;
                }

                // padding: 10px;

                // border-top: 1px solid #bbb;

                // > div > div:global(.tiptap) {
                //     outline: none;
                // }

                @for $i from 1 through 8 {
                    [data-indent="#{$i}"] {
                        $val: $i * 30px;
                        padding-left: $val;
                    }
                }
            }
        }

        > .bottom {
            margin-block: 10px;

            display: flex;
            justify-content: flex-end;
        }
    }

    :global(.fade-enter-active),
    :global(.fade-leave-active) {
        transition: opacity 0.5s ease;
    }

    :global(.fade-enter-from),
    :global(.fade-leave-to) {
        opacity: 0;
    }
}
</style>
