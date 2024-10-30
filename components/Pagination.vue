<template>
    <div :class="$style.index">
        <el-button
            v-if="currentPage !== 1"
            @click="goFirstPage"
            :class="$style.arrow"
            :icon="ElIconDArrowLeft"
        />
        <el-button
            v-if="getTotalPage() != 0 && getTotalPage() != 1"
            @click="goToPage(currentPage - 1)"
            :class="$style.arrow"
            :disabled="currentPage === 1"
            :icon="ElIconArrowLeft"
        />
        <el-button
            v-for="page in getTotalPage()"
            :key="page"
            @click="goToPage(page)"
            :class="[$style.button, { active: page === currentPage }]"
        >
            {{ page }}
        </el-button>
        <el-button
            v-if="getTotalPage() != 0 && getTotalPage() != 1"
            @click="goToPage(currentPage + 1)"
            :class="$style.arrow"
            :disabled="currentPage === getTotalPage()"
            :icon="ElIconArrowRight"
        />
        <el-button
            v-if="currentPage !== getTotalPage() && getTotalPage() != 0"
            @click="goLastPage"
            :class="$style.arrow"
            :icon="ElIconDArrowRight"
        />
    </div>
</template>

<script setup lang="ts">
const currentPage: Ref<number> = ref(1);

const props = defineProps<{
    total: number;
}>();

const emit = defineEmits(["change"]);

const getTotalPage = (): number => {
    return Math.ceil(props.total / 10);
};

const goToPage = (page: number) => {
    if (page < 1 || page > getTotalPage()) {
        return;
    }

    currentPage.value = page;

    emit("change", page);
};

const goFirstPage = () => {
    currentPage.value = 1;

    emit("change", currentPage.value);
};

const goLastPage = () => {
    currentPage.value = getTotalPage();

    emit("change", currentPage.value);
};
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    padding-block: 20px;

    > .arrow {
        padding: 8px;
    }

    > .button:global(.active) {
        color: #6565f7ef;
    }

    > :global(.el-button) {
        margin-left: initial;
    }
}
</style>
