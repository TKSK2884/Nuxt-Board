<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.title">로그인</div>

            <div :class="$style.form">
                <div :class="$style.label">ID</div>
                <el-input v-model="id" />

                <div :class="$style.label">Password</div>
                <el-input type="password" v-model="password" show-password />

                <el-button
                    @click="tryLogin"
                    :disabled="updateButtonState()"
                    :class="$style.button"
                    >로그인</el-button
                >

                <el-button @click="goJoin" :class="$style.button"
                    >계정 만들기</el-button
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import type { APIResponse, UserInfo } from "~/structure/type";

const config = useRuntimeConfig();

const id: Ref<string> = ref("");
const password: Ref<string> = ref("");

onMounted(() => {
    if (process.server) {
        return;
    }
});

const tryLogin = async () => {
    if (id.value == "") {
        alert("아이디를 입력해주세요");
        return;
    }

    if (password.value == "") {
        alert("비밀번호를 입력해주세요");
        return;
    }

    const result: APIResponse<UserInfo> = await $fetch("/member/login", {
        baseURL: config.public.apiBase,
        method: "POST",
        body: {
            id: id.value,
            password: password.value,
        },
        credentials: "include",
    });

    if (!result.success) {
        const errorCode = result.errorCode;
        alert(errorCode);

        return;
    }

    useAuthStore().login(
        result.data.id,
        result.data.nickname,
        result.data.email
    );

    navigateTo("/");
};

const updateButtonState = (): boolean => {
    const isId: boolean = id.value.trim() !== "";
    const isPassword: boolean = password.value !== "";

    return !(isId && isPassword);
};

const goJoin = () => {
    navigateTo("/auth/join");
};
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 100%;

    > .inner {
        max-width: 600px;

        margin-inline: auto;

        > .title {
            font-size: 40px;
            text-align: center;
        }

        > .form {
            max-width: 360px;

            padding: 40px;

            margin-top: 40px;
            margin-inline: auto;

            border: 1px solid #51515170;
            border-radius: 40px;

            > .label {
                margin-block: 4px;
            }

            > .button {
                margin-top: 20px;
                margin-inline: auto;

                display: block;
            }

            > .button:last-child {
                margin-top: 10px;
            }
        }
    }
}
</style>
