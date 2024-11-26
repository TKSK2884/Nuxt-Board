<template>
    <div :class="$style.index">
        <template v-if="props.board != null">
            <NuxtLink
                :to="{
                    path: '/board',
                    query: {
                        category: props.board.slug,
                    },
                }"
            >
                <div :class="$style.head">
                    <div :class="$style.title">
                        {{ props.board.title }}
                    </div>
                    <div :class="$style.go">
                        <span> 더보기 </span>
                        <div :class="$style.icon" />
                    </div>
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
        </template>
    </div>
</template>

<script lang="ts" setup>
import { timeAgo } from "~/utils/string";
import type { BoardList, PostItem } from "~/structure/type";

const props = defineProps<{
    board?: BoardList | null;
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

    padding: 25px;

    > a {
        text-decoration: none;

        color: black;

        display: block;

        margin-bottom: 16px;

        outline: 0;

        > .head {
            display: flex;
            justify-content: space-between;

            > .title {
                font-size: 17px;
                font-weight: bold;
                border-bottom: 2px solid #00a495;
            }

            > .go {
                display: flex;
                align-items: center;

                > span {
                    font-size: 14px;
                    line-height: 20px;
                }

                > .icon {
                    width: 16px;
                    height: 16px;

                    background-image: url("@/assets/icon/arrow-right.png");
                    background-size: contain;
                    background-position: center center;
                    background-repeat: no-repeat;
                }
            }
        }
    }

    > .inner {
        padding-inline: 8px;

        > .content {
            margin-bottom: 16px;

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
