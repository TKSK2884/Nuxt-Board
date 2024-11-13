<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.head">게시판 만들기</div>

            <div :class="$style.info">게시판 제목</div>
            <el-input
                v-model="title"
                placeholder="생성할 게시판 이름을 적어주세요"
            />

            <div :class="$style.info">게시판 설명</div>
            <el-input v-model="desc" placeholder="게시판의 설명을 적어주세요" />

            <div :class="$style.info">게시판 slug</div>
            <el-input v-model="slug" />
            <div :class="$style.placeholder">
                게시판의 주소창에 사용될 아이디를 적어주세요
            </div>

            <el-button @click="createBoard" :class="$style.button">
                게시판 생성
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RuntimeConfig } from "nuxt/schema";

const config: RuntimeConfig = useRuntimeConfig();

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const title: Ref<string> = ref("");
const desc: Ref<string> = ref("");
const slug: Ref<string> = ref("");

const createBoard = async () => {
    if (title.value.trim() == "") {
        ElMessage({ message: "제목을 입력해주세요", type: "warning" });
        return;
    }

    if (desc.value.trim() == "") {
        ElMessage({ message: "설명을 입력해주세요", type: "warning" });
        return;
    }

    if (slug.value.trim() == "") {
        ElMessage({ message: "Slug를 입력해주세요", type: "warning" });
        return;
    }

    loadingStore.globalLoading = true;

    try {
        await $fetch("/board/create", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: {
                title: title.value,
                desc: desc.value,
                slug: slug.value,
            },
        });
    } catch (error) {
        return;
    } finally {
        loadingStore.globalLoading = false;
    }

    navigateTo("/");
};

onMounted(() => {
    if (authStore.userState == null) {
        ElMessage({ message: "로그인이 필요합니다.", type: "warning" });

        navigateTo("/auth/login");

        return;
    }
});
</script>

<style lang="scss" module>
.index {
    width: 100%;

    > .inner {
        padding: 20px;

        border-radius: 10px;
        border: 1px solid;
        border-color: #bbb;

        > .head {
            font-size: 24px;
            margin-bottom: 20px;
        }

        > .info {
            margin-block: 10px;
        }

        > .placeholder {
            margin-top: 10px;
            color: #bbb;
        }

        > .button {
            margin-top: 20px;
        }
    }
}
</style>
