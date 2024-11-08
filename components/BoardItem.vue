<template>
    <div :class="$style.index">
        <NuxtLink
            :to="{
                path: '/board',
                query: {
                    category: props.board.slug,
                },
            }"
        >
            <div :class="$style.head">
                <div :class="$style.title">{{ props.board.title }} 게시판</div>
                <div :class="$style.icon" />
            </div>
        </NuxtLink>

        <div :class="$style.inner">
            <div
                v-for="(content, index) in props.board.post"
                :key="'content-' + index"
                @click="goPost(content, props.board.slug)"
                :class="$style.content"
            >
                <div :class="$style.left">
                    <div :class="$style.title">
                        {{ content.title }}
                    </div>
                    <!-- <div :class="$style.feedback">
                        
                    </div> -->
                </div>
                <div :class="$style.right">
                    <div :class="$style.time">
                        {{ timeAgo(content.written_time) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { timeAgo } from "~/utils/string";
import type { BoardList, PostItem } from "~/structure/type";

const props = defineProps<{
    board: BoardList;
}>();

const getBoardTitle = (board: BoardList) => {
    if (board == null) return "";

    return board.title;
};

const getBoardItem = (content: PostItem) => {
    if (content == null) return {};

    return {};
};

const goPost = (content: PostItem, category: string) => {
    if (content == null || category == null) return;

    navigateTo({
        path: "/board/post",
        query: {
            category: category,
            id: content.id,
        },
    });
};
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 100%;

    > a {
        font-size: 20px;
        text-decoration: none;

        color: black;

        padding-bottom: 8px;

        display: block;

        outline: 0;

        > .head {
            display: flex;
            justify-content: space-between;

            > .title {
                border-bottom: 2px solid #00a495;
            }

            > .icon {
                width: 20px;
                height: 20px;

                margin-top: 2px;

                background-image: url("@/assets/icon/arrow-right-solid.svg");
                background-size: contain;
                background-position: center center;
                background-repeat: no-repeat;
            }
        }
    }

    > .inner {
        padding-inline: 8px;

        > .content {
            margin-bottom: 8px;

            display: flex;

            cursor: pointer;

            > .left {
                display: flex;
                flex: 1;
                align-items: center;

                gap: 4px;

                &:hover {
                    text-decoration: underline;
                }

                > .title {
                    font-size: 16px;
                }

                > .feedback {
                    font-size: 16px;
                }
            }

            > .right {
                > .time {
                    font-size: 12px;

                    color: white;
                    background-color: #3d414d;

                    padding: 4px;
                    border-radius: 8px;
                }
            }
        }
    }
}
</style>
