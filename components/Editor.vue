<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <el-input v-model="title" :class="$style.title" />
            <div v-if="editor" :class="$style.container">
                <div :class="$style.control">
                    <div :class="$style.left">
                        <el-tooltip
                            :class="$style.tooltip"
                            content="굵게"
                            placement="bottom"
                        >
                            <el-button
                                @click="
                                    editor.chain().focus().toggleBold().run()
                                "
                                :class="[
                                    $style.bold,
                                    $style.button,
                                    { 'is-active': editor.isActive('bold') },
                                ]"
                            />
                        </el-tooltip>
                        <el-tooltip
                            :class="$style.tooltip"
                            content="기울임꼴"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.italic,
                                    $style.button,
                                    { 'is-active': editor.isActive('italic') },
                                ]"
                                @click="
                                    editor.chain().focus().toggleItalic().run()
                                "
                            />
                        </el-tooltip>
                        <el-tooltip
                            :class="$style.tooltip"
                            content="밑줄"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.underline,
                                    $style.button,
                                    {
                                        'is-active':
                                            editor.isActive('underline'),
                                    },
                                ]"
                                @click="
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleUnderline()
                                        .run()
                                "
                            />
                        </el-tooltip>

                        <el-tooltip
                            :class="$style.tooltip"
                            content="취소선"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.slash,
                                    $style.button,
                                    { 'is-active': editor.isActive('strike') },
                                ]"
                                @click="
                                    editor.chain().focus().toggleStrike().run()
                                "
                            />
                        </el-tooltip>
                        <el-tooltip
                            :class="$style.tooltip"
                            content="폰트 크기"
                            placement="bottom"
                        >
                            <el-dropdown trigger="click">
                                <el-button
                                    :class="[$style.size, $style.button]"
                                />
                                <template #dropdown>
                                    <el-scrollbar height="300px">
                                        <el-dropdown-menu>
                                            <el-dropdown-item
                                                v-for="(
                                                    font, index
                                                ) in fontSizes"
                                                :key="'font-' + index"
                                                @click="
                                                    setFontSize(`${font}px`)
                                                "
                                                >{{ font }}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-scrollbar>
                                </template>
                            </el-dropdown>
                        </el-tooltip>

                        <el-button
                            @click="changeExtend()"
                            :class="[
                                $style.enableExtend,
                                $style.button,
                                { 'is-active': extend },
                            ]"
                        >
                            문단 서식
                        </el-button>
                    </div>

                    <div :class="$style.right">
                        <el-tooltip
                            :class="$style.tooltip"
                            content="실행취소"
                            placement="bottom"
                        >
                            <el-button
                                :class="[$style.undo, $style.button]"
                                @click="editor.chain().focus().undo().run()"
                            />
                        </el-tooltip>
                        <el-tooltip
                            :class="$style.tooltip"
                            content="되돌리기"
                            placement="bottom"
                        >
                            <el-button
                                :class="[$style.redo, $style.button]"
                                @click="editor.chain().focus().redo().run()"
                            />
                        </el-tooltip>
                    </div>
                </div>
                <Transition name="fade">
                    <div v-if="extend" :class="$style.extend">
                        <el-tooltip
                            :class="$style.tooltip"
                            content="왼쪽 정렬"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.left,
                                    $style.button,
                                    { 'is-active': editor.isActive('left') },
                                ]"
                                @click="editor.commands.setTextAlign('left')"
                            />
                        </el-tooltip>

                        <el-tooltip
                            :class="$style.tooltip"
                            content="중앙 정렬"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.center,
                                    $style.button,
                                    { 'is-active': editor.isActive('center') },
                                ]"
                                @click="editor.commands.setTextAlign('center')"
                            />
                        </el-tooltip>

                        <el-tooltip
                            :class="$style.tooltip"
                            content="오른쪽 정렬"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.right,
                                    $style.button,
                                    { 'is-active': editor.isActive('right') },
                                ]"
                                @click="editor.commands.setTextAlign('right')"
                            />
                        </el-tooltip>

                        <el-tooltip
                            :class="$style.tooltip"
                            content="숫자 리스트"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.order,
                                    $style.button,
                                    {
                                        'is-active':
                                            editor.isActive('orderedList'),
                                    },
                                ]"
                                @click="
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                "
                            />
                        </el-tooltip>

                        <el-tooltip
                            :class="$style.tooltip"
                            content="점 리스트"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.bullet,
                                    $style.button,
                                    {
                                        'is-active':
                                            editor.isActive('bulletList'),
                                    },
                                ]"
                                @click="
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                "
                            />
                        </el-tooltip>

                        <el-tooltip
                            :class="$style.tooltip"
                            content="들여쓰기"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.indent,
                                    $style.button,
                                    {
                                        'is-active': editor.isActive('indent'),
                                    },
                                ]"
                                @click="editor.commands.indent()"
                            />
                        </el-tooltip>

                        <el-tooltip
                            :class="$style.tooltip"
                            content="내어쓰기"
                            placement="bottom"
                        >
                            <el-button
                                :class="[
                                    $style.outdent,
                                    $style.button,
                                    {
                                        'is-active': editor.isActive('outdent'),
                                    },
                                ]"
                                @click="editor.commands.outdent()"
                            />
                        </el-tooltip>

                        <el-button
                            @click="
                                editor.chain().focus().setHorizontalRule().run()
                            "
                            :class="$style.horizon"
                        >
                            수평선 삽입
                        </el-button>
                    </div>
                </Transition>

                <div :class="$style.editor">
                    <editor-content v-if="editor" :editor="editor" />
                </div>
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
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from "~/extensions/Fontsize";
import { Indent } from "~/extensions/Indent";
import Underline from "@tiptap/extension-underline";
import { ElMessage } from "element-plus";
import type { RuntimeConfig } from "nuxt/schema";
import type { PostItem } from "~/structure/type";

const config: RuntimeConfig = useRuntimeConfig();
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const editor: Ref<Editor | undefined> = ref(undefined);
const content: Ref<string> = ref("");
const props = defineProps<{
    category?: string;
    postItem?: PostItem | null;
    editMode?: boolean | null;
}>();
const emit = defineEmits(["toggle"]);

const title: Ref<string> = ref("");

const fontSizes: string[] = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "18",
    "24",
    "30",
    "36",
    "48",
    "60",
    "72",
    "96",
];

const extend: Ref<boolean> = ref(false);

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

    editor.value = new Editor({
        extensions: [
            StarterKit,
            TextStyle,
            FontSize,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Indent.configure({
                types: ["listItem", "paragraph"],
                minLevel: 0,
                maxLevel: 8,
            }),
            Underline,
        ],
        content: content.value,
        onUpdate: ({ editor }) => {
            content.value = editor.getHTML();
        },
    });
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});

const setFontSize = (size: string) => {
    if (editor.value == null) {
        return;
    }
    editor.value.chain().focus().setFontSize(size).run();
};

const changeExtend = (): void => {
    extend.value = !extend.value;
};

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
            await $fetch("/update", {
                baseURL: config.public.apiBase,
                method: "POST",
                body: {
                    id: props.postItem?.id,
                    title: title.value,
                    content: content.value,
                },
                credentials: "include",
            });
        } else {
            await $fetch("/write", {
                baseURL: config.public.apiBase,
                method: "POST",
                body: {
                    title: title.value,
                    content: content.value,
                    writer: authStore.userState?.id,
                    category: props.category,
                },
                credentials: "include",
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
                padding: 10px;

                border-top: 1px solid #bbb;

                > div > div:global(.tiptap) {
                    outline: none;
                }

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
