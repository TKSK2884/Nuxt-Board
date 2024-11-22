<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.head">
                <div :class="$style.title">계정 정보</div>
            </div>
            <div :class="$style.body">
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { APIResponse } from "~/structure/type";

const config = useRuntimeConfig();
const authStore = useAuthStore();

const nickname: Ref<string> = ref("");
const email: Ref<string> = ref("");

onMounted(async () => {
    if (authStore.userState == null) {
        await authStore.checkAuth();
    }

    if (authStore.userState == null) {
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
        const result: APIResponse<null> = await $fetch("/member/update", {
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
