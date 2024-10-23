<template>
    <div :class="$style.index">
        <div :class="$style.banner"></div>
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
import type { Board, Post } from "~/structure/type";

const config = useRuntimeConfig();

const boardList: Board[] = [
    {
        id: 1,
        title: "반려동물",
        category: "pet",
        post: [
            {
                id: 1,
                postTitle: "우리 집에 새 가족이 생김",
                feedback: 5,
                time: 1214124,
            },
            {
                id: 1,
                postTitle: "우리 집에 새 가족이 생김",
                feedback: 5,
                time: 1214124,
            },
            {
                id: 1,
                postTitle: "우리 집에 새 가족이 생김",
                feedback: 5,
                time: 1214124,
            },
            {
                id: 1,
                postTitle: "우리 집에 새 가족이 생김",
                feedback: 5,
                time: 1214124,
            },
        ],
    },
    {
        id: 2,
        title: "게임",
        category: "game",
        post: [
            {
                id: 1,
                postTitle: "우리 집에 새 가족이 생김",
                feedback: 5,
                time: 1214124,
            },
        ],
    },
];

onMounted(() => {
    if (process.server) {
        return;
    }

    let sessionAccessToken: string =
        sessionStorage.getItem("accessToken") ?? "";

    const accessToken: string = localStorage.getItem("accessToken") ?? "";

    if (accessToken != "") {
        localStorage.removeItem("accessToken");
        sessionStorage.setItem("accessToken", accessToken);

        sessionAccessToken = accessToken;
    }

    if (sessionAccessToken != "") {
        getUserNickname(sessionAccessToken);
    }
});

const getUserNickname = async (token: string) => {
    if (token == "") {
        return;
    }

    const result: any = await $fetch("/member/info", {
        baseURL: config.public.apiBase,
        method: "GET",
        headers: {
            authorization: token,
        },
    });
};

const getBoardList = () => {};
</script>

<style lang="scss" module>
@import "@/assets/css/utils.scss";

.index {
    width: 100%;
    height: 100%;

    > .inner {
        max-width: 1080px;

        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        padding: 8px;

        > .board {
            padding: 8px;
            margin-block: 8px;

            flex-shrink: 0;
            flex-grow: 0;
            flex-basis: 50%;

            @include mobile {
                width: 100%;
                flex-basis: 100%;
            }
        }

        > .board::after {
            width: 100%;
            height: 100%;

            content: "";

            display: block;

            position: relative;
            bottom: -16px;

            border-bottom: 1px solid #bbb;
        }

        > .board:nth-child(odd) {
            border-right: 1px solid #bbb;

            @include mobile {
                border-right: none;
            }
        }

        > .board:nth-last-child(1)::after,
        > .board:nth-last-child(2)::after {
            display: none;
        }

        > .board:last-child:last-child(odd) {
            margin-right: auto;

            @include mobile {
                margin-right: initial;
            }
        }
    }
}
</style>
