export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            apiBase: process.env.VUE_APP_API_URL || "http://localhost:8455",
        },
    },

    app: {
        head: {
            title: "Nuxt-Board",
            meta: [
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                {
                    name: "description",
                    content: "This is a Nuxt-Board.",
                },
            ],
            link: [{ rel: "icon", href: "/favicon.ico" }],
        },
    },

    plugins: [{ src: "~/plugins/ckeditor.client.ts", mode: "client" }],

    modules: ["@element-plus/nuxt", "@pinia/nuxt"],
    compatibilityDate: "2024-10-09",
    css: ["~/assets/css/main.css"],
});
