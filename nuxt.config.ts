export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            apiBase: process.env.VUE_APP_API_URL || "http://localhost:8455",
        },
    },
    modules: ["@element-plus/nuxt", "@pinia/nuxt"],
    compatibilityDate: "2024-10-09",
    css: ["~/assets/css/main.css"],
});
