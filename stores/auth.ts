import { defineStore } from "pinia";
import type { APIResponse, UserInfo } from "~/structure/type";

interface UserState {
    id: number;
    nickname: string;
    email: string;
}

export const useAuthStore = defineStore("user", () => {
    const config = useRuntimeConfig();
    const loadingStore = useLoadingStore();

    const userState: Ref<UserState | null> = ref(null);

    const checkAuth = async () => {
        loadingStore.globalLoading = true;

        try {
            const result: APIResponse<UserInfo> = await $fetch("/member", {
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
                email: result.data.email,
            };
        } catch (error) {
            userState.value = null;
        }

        loadingStore.globalLoading = false;
    };

    const login = (id: number, userNickname: string, email: string) => {
        userState.value = { id: id, nickname: userNickname, email: email };
    };

    const logout = async () => {
        loadingStore.globalLoading = true;

        try {
            await $fetch("/member/logout", {
                baseURL: config.public.apiBase,
                method: "DELETE",
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
