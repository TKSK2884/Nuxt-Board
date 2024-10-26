import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore("loading", () => {
    const globalLoading = ref(false);

    return {
        globalLoading,
    };
});
