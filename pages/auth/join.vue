<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.title">회원가입</div>
            <div :class="$style.info">
                <div>
                    회원 가입 시
                    <span :class="$style.underLine">이용약관</span> 및
                    <span :class="$style.underLine">개인정보취급방침</span>에
                </div>
                <div>동의하는 것으로 간주합니다.</div>
            </div>

            <div :class="$style.form">
                <div :class="$style.label">ID</div>
                <el-input v-model="id" />

                <div :class="$style.label">Password</div>
                <el-input v-model="password" type="password" show-password />

                <div :class="$style.label">Password Confirm</div>
                <el-input
                    v-model="passwordConfirm"
                    type="password"
                    show-password
                />

                <div :class="$style.label">Email</div>
                <el-input v-model="email" />

                <div :class="$style.label">Nickname</div>
                <el-input v-model="nickname" />

                <el-button @click="tryJoin" :class="$style.button"
                    >가입</el-button
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const id: Ref<string> = ref("");
const password: Ref<string> = ref("");
const passwordConfirm: Ref<string> = ref("");
const email: Ref<string> = ref("");
const nickname: Ref<string> = ref("");

const tryJoin = async () => {
    const result: any = await $fetch("/member/join", {
        baseURL: config.public.apiBase,
        method: "POST",
        body: {
            id: id.value,
            password: password.value,
            email: email.value,
            nickname: nickname.value,
        },
    });

    if (!result.success) {
        alert("실패");
        return;
    }

    navigateTo("/auth/login");
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

        > .info {
            font-size: 14px;
            text-align: center;
        }

        > .info > div > span {
            font-weight: bold;
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
        }
    }
}
</style>
