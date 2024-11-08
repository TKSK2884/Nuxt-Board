<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.editor">
                <Editor :category="category" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

const category: Ref<string> = ref("");

onMounted(() => {
    if (typeof route.query.category === "string") {
        category.value = route.query.category;
    }
});
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 100%;
}
</style>
