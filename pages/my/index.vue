<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.head">
                <el-button @click="mode = 0" :class="$style.button" round>
                    계정 정보
                </el-button>
                <el-button
                    @click="changeRecentPost"
                    :class="$style.button"
                    round
                >
                    최근 작성글
                </el-button>
            </div>
            <div :class="$style.body">
                <template v-if="mode == 0">
                    <div :class="$style.userInfo">
                        <div :class="$style.input">
                            닉네임:
                            <el-input v-model="nickname" />
                        </div>
                        <div :class="$style.input">
                            이메일:
                            <el-input v-model="email" />
                        </div>
                    </div>
                    <div :class="$style.right">
                        <el-button @click="updateUserInfo">
                            계정정보 수정
                        </el-button>
                    </div>
                </template>
                <template v-else>
                    <div :class="$style.recentPosts">
                        <el-table
                            v-if="recentPosts.length != 0"
                            :data="recentPosts"
                            style="width: 100%"
                            @row-click="goToPostDetail"
                            border
                        >
                            <el-table-column prop="title" label="제목" />

                            <el-table-column
                                prop="category_title"
                                label="카테고리"
                                width="150"
                            />
                            <el-table-column
                                prop="convert_written_time"
                                label="작성일"
                                width="200"
                            />
                        </el-table>
                        <div
                            v-if="recentPosts.length === 0"
                            :class="$style.noData"
                        >
                            최근 작성글이 없습니다.
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { APIResponse, MyPost } from "~/structure/type";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const mode: Ref<number> = ref(0);
const recentPosts: Ref<MyPost[]> = ref([]);

const nickname: Ref<string> = ref("");
const email: Ref<string> = ref("");

onMounted(async () => {
    await authStore.checkAuth();

    if (authStore.userState == null) {
        ElMessage({ message: "로그인이 필요합니다.", type: "warning" });
        navigateTo("/");
        return;
    }

    nickname.value = authStore.userState.nickname;
    email.value = authStore.userState.email;
});

const updateUserInfo = async () => {
    if (nickname.value.trim() == "") {
        ElMessage({ message: "닉네임을 입력해주세요", type: "warning" });
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        ElMessage({ message: "올바른 이메일을 입력해주세요", type: "warning" });
        return;
    }

    if (authStore.userState == null) return;

    try {
        const result: APIResponse<null> = await $fetch("/member", {
            baseURL: config.public.apiBase,
            method: "PATCH",
            body: {
                id: authStore.userState.id,
                nickname: nickname.value,
                email: email.value,
            },
        });

        if (result.success) {
            ElMessage({ message: "계정 정보 수정 성공", type: "success" });

            authStore.userState.nickname = nickname.value;
            authStore.userState.email = email.value;

            navigateTo("/");
        } else {
            ElMessage({ message: "계정 정보 수정 실패", type: "error" });
        }
    } catch (error) {
        ElMessage({ message: "서버 오류.", type: "error" });
    }
};

const changeRecentPost = async () => {
    await getUserRecentPosts();

    mode.value = 1;
};

const getUserRecentPosts = async () => {
    if (authStore.userState == null || loadingStore.globalLoading) {
        return;
    }

    loadingStore.globalLoading = true;

    try {
        const result: APIResponse<MyPost[]> = await $fetch(
            `/users/${authStore.userState.id}/posts`,
            {
                baseURL: config.public.apiBase,
                method: "GET",
                query: {
                    limit: 10,
                },
            }
        );

        if (result.success) {
            recentPosts.value = result.data.map((post) => ({
                ...post,
                convert_written_time: convertKoreaTime(post.written_time),
            }));
        }
    } catch {
        return;
    } finally {
        loadingStore.globalLoading = false;
    }
};

const goToPostDetail = (row: any) => {
    navigateTo({
        path: "/board/post",
        query: {
            category: row.category,
            id: row.id,
        },
    });
};
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 100%;

    > .inner {
        width: 100%;
        height: 100%;

        > .head {
            padding: 20px;

            border-bottom: 1px solid;
            border-color: #bbb;

            > .button {
                &:hover,
                &:active {
                    background-color: #f3f4f6;
                    color: #606266;
                    border-color: #f3f4f6;
                }
            }

            > .user {
                font-size: 24px;

                > .bold {
                    font-weight: bold;
                }
            }
        }

        > .body {
            padding: 20px;

            > .userInfo {
                font-size: 20px;

                > .input {
                    margin-bottom: 10px;
                }
            }

            > .right {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>
