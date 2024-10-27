import { defineStore } from "pinia";

interface UserState {
    nickname: string;
    isLoggedIn: boolean;
}

export const useAuthStore = defineStore("user", () => {
    const config = useRuntimeConfig();
    const accessToken = useCookie("accessToken");

    const userState: Ref<UserState | null> = ref(null);

    const checkAuth = async () => {
        if (accessToken.value == null) {
            return;
        }

        try {
            const result: any = await $fetch("/member/info", {
                baseURL: config.public.apiBase,
                method: "GET",
                query: {
                    accessToken: accessToken.value,
                },
            });

            if (!result.success) {
                userState.value = null;

                return;
            }

            userState.value = {
                nickname: result.nickname,
                isLoggedIn: true,
            };
        } catch (error) {
            console.error("인증 상태 확인 오류", error);
            userState.value = null;
        }
    };

    // const setToken = (token: string) => {
    //     accessToken.value = token;
    //     console.log("work");
    // };

    const login = (userNickname: string, token: string) => {
        userState.value = { nickname: userNickname, isLoggedIn: true };
        accessToken.value = token;
    };

    const logout = () => {
        userState.value = null;
        accessToken.value = null;
    };

    return {
        userState,
        login,
        logout,
        checkAuth,
    };
});
