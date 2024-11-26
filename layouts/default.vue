<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.header">
                <div :class="$style.cover">
                    <div :class="$style.left">
                        <NuxtLink to="/">
                            <div :class="$style.logo" />
                        </NuxtLink>
                    </div>
                    <div :class="$style.right">
                        <div :class="$style.nickname">
                            {{ authStore.userState?.nickname }}
                        </div>
                        <template v-if="isLogin()">
                            <el-dropdown placement="bottom" trigger="click">
                                <div :class="$style.user" />
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="goMypage()">
                                            마이페이지
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="goCreate()">
                                            게시판 생성
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="logout()">
                                            로그아웃
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </template>
                        <template v-else>
                            <el-button
                                @click="goLogin"
                                :class="$style.login"
                                type="primary"
                            >
                                <span :class="$style.in" /> 로그인
                            </el-button>
                        </template>
                    </div>
                </div>
            </div>
            <div :class="$style.body">
                <div :class="$style.contents">
                    <div
                        v-if="shouldShowTitle() && boardInfo != null"
                        :class="$style.boardInfo"
                    >
                        <div :class="$style.inner">
                            <div @click="goBoard" :class="$style.title">
                                {{ boardInfo.title }}
                            </div>
                            <div :class="$style.desc">
                                {{ boardInfo.description }}
                            </div>
                        </div>
                    </div>
                    <slot />
                </div>
                <div :class="$style.banner"></div>
            </div>

            <div v-if="loadingStore.globalLoading" :class="$style.loading">
                <LoadingIndicator />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useLoadingStore } from "~/stores/loading";
import type { APIResponse, BoardInfo } from "~/structure/type";

const config = useRuntimeConfig();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();
const route = useRoute();
const category = ref("");
const boardInfo: Ref<BoardInfo | null> = ref(null);

const goLogin = () => {
    if (authStore.userState != null) {
        authStore.logout();
        return;
    }

    navigateTo("/auth/login");
};

const isLogin = (): boolean => {
    return authStore.userState != null;
};

const goMypage = () => {
    navigateTo("/my");
};

const goCreate = () => {
    navigateTo("/board/create");
};

const logout = () => {
    authStore.logout();

    navigateTo("/");
};

onMounted(async () => {
    await authStore.checkAuth();
});

const shouldShowTitle = () => {
    return route.path.includes("/board");
};

const getBoardInfo = async () => {
    loadingStore.globalLoading = true;

    const result: APIResponse<BoardInfo> = await $fetch("/board/info", {
        baseURL: config.public.apiBase,
        method: "GET",
        query: {
            category: category.value,
        },
    });

    loadingStore.globalLoading = false;

    boardInfo.value = result.data;
};

const goBoard = () => {
    navigateTo({
        path: "/board",
        query: { category: boardInfo.value?.slug },
    });
};

watch(
    () => route.query.category,
    (newCategory) => {
        if (typeof newCategory === "string") {
            category.value = newCategory;
        } else {
            category.value = "";
        }

        if (category.value == "") {
            boardInfo.value = null;
            return;
        }

        getBoardInfo();
    }
);
</script>

<style lang="scss" module>
@import "@/assets/css/utils.scss";
.index {
    width: 100%;
    height: 100%;

    > .inner {
        width: 100%;
        height: 100%;

        position: relative;

        > .header {
            width: 100%;
            min-height: 40px;

            padding-block: 10px;

            background-color: #3d414d;

            > .cover {
                width: 100%;
                height: 100%;

                max-width: 1200px;

                margin-inline: auto;

                display: flex;
                justify-content: space-between;

                > .left {
                    padding-left: 20px;

                    display: flex;
                    align-items: center;
                    gap: 10px;

                    flex-basis: 50%;

                    > a {
                        text-decoration: none;

                        > .logo {
                            width: 30px;
                            height: 30px;

                            flex-shrink: 0;

                            @include icon-image("home.svg");
                        }
                    }

                    > .search {
                        width: 100%;
                        max-width: 300px;
                    }
                }

                > .right {
                    padding-right: 20px;

                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 10px;

                    flex-basis: 50%;

                    > .nickname {
                        color: white;
                    }

                    > :global(.el-dropdown) > .user,
                    > .user {
                        width: 30px;
                        height: 30px;

                        flex-shrink: 0;

                        cursor: pointer;

                        @include icon-image("user-solid-white.svg");
                    }

                    > .login {
                        > span {
                            > .in {
                                width: 16px;
                                height: 16px;

                                margin-right: 4px;

                                @include icon-image("login-icon.png");
                            }
                        }
                    }
                }
            }
        }

        > .body {
            width: 100%;
            height: 100%;

            > .contents {
                max-width: 1024px;
                height: 100%;

                padding: 20px;
                margin-inline: auto;

                > .boardInfo {
                    > .inner {
                        padding-bottom: 10px;

                        border-bottom: 1px solid;
                        border-color: #bbb;

                        > .title {
                            font-size: 24px;
                            margin-bottom: 8px;

                            cursor: pointer;

                            &:hover {
                                text-decoration: underline;
                            }
                        }

                        > .desc {
                            font-size: 16px;

                            color: #bbb;
                        }
                    }
                }
            }
        }

        > .loading {
            width: 100%;
            height: 100%;

            position: absolute;
            top: 0px;
            left: 0px;

            background-color: white;

            opacity: 90%;
        }
    }
}
</style>
