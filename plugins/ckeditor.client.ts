import Ckeditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Ckeditor);
    return {
        provide: {
            ckeditor: {
                classicEditor: ClassicEditor,
            },
        },
    };
});
