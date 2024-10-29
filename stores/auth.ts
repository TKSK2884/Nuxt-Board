import { defineStore } from "pinia";
import type { APIResponse, UserInfo } from "~/structure/type";

interface UserState {
    id: string;
    nickname: string;
    isLoggedIn: boolean;
}

export const useAuthStore = defineStore("user", () => {
    const config = useRuntimeConfig();
    const loadingStore = useLoadingStore();

    const userState: Ref<UserState | null> = ref(null);

    const checkAuth = async () => {
        loadingStore.globalLoading = true;

        try {
            const result: APIResponse<UserInfo> = await $fetch("/member/info", {
                baseURL: config.public.apiBase,
                method: "GET",
                credentials: "include",
            });

            if (!result.success) {
                userState.value = null;

                return;
            }

            userState.value = {
                id: result.data.id,
                nickname: result.data.nickname,
                isLoggedIn: true,
            };
        } catch (error) {
            console.error("인증 상태 확인 오류", error);
            userState.value = null;
        }

        loadingStore.globalLoading = false;
    };

    const login = (id: string, userNickname: string) => {
        userState.value = { id: id, nickname: userNickname, isLoggedIn: true };
    };

    const logout = async () => {
        loadingStore.globalLoading = true;

        try {
            const result: APIResponse<null> = await $fetch("/member/logout", {
                baseURL: config.public.apiBase,
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }

        loadingStore.globalLoading = false;
        userState.value = null;
    };

    return {
        userState,
        login,
        logout,
        checkAuth,
    };
});
