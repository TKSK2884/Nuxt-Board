<template>
    <div :class="$style.index">
        <div :class="$style.buttons">
            <el-button
                v-for="(item, index) in boardList"
                :key="'boardButton-' + index"
                @click="goBoard(item.slug)"
                :class="$style.button"
                round
            >
                {{ item.title }}
            </el-button>
        </div>

        <div :class="$style.inner">
            <BoardItem
                v-for="(board, index) in boardList"
                :key="'boardList-' + index"
                :class="$style.board"
                :board="board"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { APIResponse, BoardList } from "~/structure/type";

const config = useRuntimeConfig();

const boardList: Ref<BoardList[]> = ref([]);

onMounted(() => {
    getBoardList();
});

const getBoardList = async () => {
    const result: APIResponse<BoardList[]> = await $fetch("/board/category", {
        baseURL: config.public.apiBase,
        method: "GET",
    });

    boardList.value = result.data;
};

const goBoard = (category: string) => {
    navigateTo({
        path: "/board",
        query: {
            category: category,
        },
    });
};
</script>

<style lang="scss" module>
@import "@/assets/css/utils.scss";

.index {
    width: 100%;
    height: 100%;

    > .buttons {
        max-width: 1080px;
        padding: 8px;

        display: flex;
        gap: 8px;
        margin-inline: auto;
        overflow-x: auto;

        > .button {
            &:hover,
            &:active {
                background-color: #f3f4f6;
                color: #606266;
                border-color: #f3f4f6;
            }
        }
    }

    > .inner {
        max-width: 1080px;

        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 32px;

        padding: 8px;

        @include mobile {
            display: block;
        }

        > .board {
            margin-block: 8px;

            flex-shrink: 0;
            flex-grow: 0;
            flex-basis: calc(50% - 16px);

            border: 1px solid #e5e7eb;
            border-radius: 8px;

            @include mobile {
                width: 100%;
            }
        }

        // > .board::after {
        //     width: 100%;
        //     height: 100%;

        //     content: "";

        //     display: block;

        //     position: relative;
        //     bottom: -16px;

        //     border-bottom: 1px solid #bbb;

        //     @include mobile {
        //         bottom: -8px;
        //     }
        // }

        // > .board:nth-child(odd) {
        //     border-right: 1px solid #bbb;

        //     @include mobile {
        //         border-right: none;
        //     }
        // }

        // > .board:nth-last-child(1)::after,
        // > .board:nth-last-child(2)::after {
        //     display: none;
        // }

        // > .board:nth-last-child(2)::after {
        //     @include mobile {
        //         display: block;
        //     }
        // }

        // > .board:last-child(odd) {
        //     margin-right: auto;

        //     @include mobile {
        //         margin-right: initial;
        //     }
        // }
    }
}
</style>
