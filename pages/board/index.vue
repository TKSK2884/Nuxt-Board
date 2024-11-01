<template>
    <div :class="$style.index">
        <div :class="$style.title">
            <div :class="$style.logo" />
            <div :class="$style.desc">
                <div :class="$style.desc">타이틀</div>
                <div :class="$style.sub">설명</div>
            </div>
        </div>
        <div :class="$style.write">
            <el-button @click="goWrite"> 글쓰기 </el-button>
        </div>
        <div :class="$style.body">
            <div :class="$style.head">
                <div :class="$style.inner">
                    <div :class="$style.left">
                        <div :class="$style.number">번호</div>
                        <div :class="$style.title">제목</div>
                    </div>
                    <div :class="$style.right">
                        <div :class="$style.writer">작성자</div>
                        <div :class="$style.date">작성일</div>
                        <div :class="$style.views">조회수</div>
                        <div :class="$style.likes">추천</div>
                    </div>
                </div>
            </div>
            <div :class="$style.category"></div>
            <div :class="$style.notice"></div>

            <div
                v-for="(board, index) in boardItems"
                :key="'board-' + index"
                @click="goPost(board.id)"
                :class="$style.item"
            >
                <div :class="$style.inner">
                    <div :class="$style.left">
                        <div :class="$style.number">
                            {{ board.category_order }}
                        </div>
                        <div :class="$style.title">
                            {{ board.title }}
                        </div>
                    </div>

                    <div :class="$style.right">
                        <div :class="$style.writer">
                            {{ board.writer }}
                        </div>
                        <div :class="$style.date">
                            {{ board.written_time }}
                        </div>

                        <div :class="$style.views">
                            {{ board.views }}
                        </div>
                        <div :class="$style.likes">
                            {{ board.likes }}
                        </div>
                    </div>
                </div>
            </div>
            <div :class="$style.page">
                <Pagination @change="pageChange" :total="totalCount" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { APIResponse, Board, BoardArray } from "~/structure/type";

const route = useRoute();
const config = useRuntimeConfig();
const loadingStore = useLoadingStore();

const category: Ref<string> = ref("");
const totalCount: Ref<number> = ref(0);
const page: Ref<number> = ref(1);

const boardItems: Ref<BoardArray[] | null> = ref(null);

const getBoardItems = async () => {
    loadingStore.globalLoading = true;

    const result: APIResponse<Board> = await $fetch("/board", {
        baseURL: config.public.apiBase,
        method: "GET",
        query: {
            page: page.value,
            category: category.value,
        },
    });

    loadingStore.globalLoading = false;

    if (!result.success) {
        return;
    }

    boardItems.value = result.data.array;
    totalCount.value = result.data.total ?? 0;
};

const goWrite = () => {
    navigateTo({ path: "/board/write", query: { category: category.value } });
};

const goPost = (id: number) => {
    navigateTo({
        path: "/board/post",
        query: { category: category.value, id: id },
    });
};

const pageChange = (number: number) => {
    page.value = number;

    getBoardItems();
};

onMounted(() => {
    if (typeof route.query.category === "string") {
        category.value = route.query.category;
    }

    getBoardItems();
});
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 100%;

    > .head {
        display: flex;
    }

    > .write {
        display: flex;
        justify-content: flex-end;
    }

    > .body {
        margin-block: 20px;

        > .head,
        > .item {
            > .inner {
                display: flex;
                flex: 1;
                align-items: center;

                padding: 8px 12px;
                border-bottom: 1px solid;

                > .left {
                    display: flex;
                    align-items: center;
                    flex: 1;

                    > .number {
                        width: 80px;
                    }
                }

                > .right {
                    display: flex;

                    > .writer {
                        width: 80px;
                    }

                    > .date {
                        width: 100px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    > .date,
                    > .views,
                    > .likes {
                        text-align: center;
                    }

                    > .views,
                    > .likes {
                        width: 60px;
                    }
                }
            }
        }

        > .item {
            cursor: pointer;
        }

        > .page {
            text-align: center;
        }
    }
}
</style>
