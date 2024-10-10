<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.header">
                <div :class="$style.left">
                    <div :class="$style.logo" />
                    <div :class="$style.search">
                        <el-input />
                    </div>
                </div>
                <div :class="$style.right">
                    <div :class="$style.user"></div>
                </div>
            </div>
            <div :class="$style.body">
                <div :class="$style.contents">
                    <slot />
                </div>
                <div :class="$style.banner"></div>
            </div>
            <div :class="$style.footer"></div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 100%;

    > .inner {
        width: 100%;
        height: 100%;

        > .header {
            width: 100%;
            min-height: 40px;
        }

        > .body {
            width: 100%;
            height: 100%;

            > .contents {
                max-width: 1024px;
                height: 100%;
            }

            > banner {
            }
        }

        > .footer {
            width: 100%;
            height: 100%;

            padding: 20px;

            background-color: #bbbbbb;
        }
    }
}
</style>
