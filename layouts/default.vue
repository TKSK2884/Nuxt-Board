<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.header">
                <div :class="$style.left">
                    <NuxtLink to="/">
                        <div :class="$style.logo" />
                    </NuxtLink>
                    <div :class="$style.search">
                        <el-input
                            v-model="search"
                            :prefix-icon="Search"
                            placeholder="찾기"
                        />
                    </div>
                </div>
                <div :class="$style.right">
                    <div @click="goLogin" :class="$style.user" />
                </div>
            </div>
            <div :class="$style.body">
                <div :class="$style.contents">
                    <slot />
                </div>
                <div :class="$style.banner"></div>
            </div>
            <div :class="$style.footer">
                <div>Copyright(c) by 조현석</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";

const search: Ref<string> = ref("");

const goLogin = () => {
    navigateTo("/login");
};
</script>

<style lang="scss" module>
@import "@/assets/css/utils.scss";
.index {
    width: 100%;
    height: 100%;

    > .inner {
        width: 100%;
        height: 100%;
        min-height: 100vh;

        position: relative;

        padding-bottom: 60px;

        > .header {
            width: 100%;
            min-height: 40px;

            padding-top: 10px;

            display: flex;
            justify-content: space-between;

            > .left {
                padding-left: 20px;

                display: flex;
                align-items: center;
                gap: 10px;

                flex-basis: 50%;

                > a {
                    text-decoration: none;

                    > .logo {
                        width: 30px;
                        height: 30px;

                        flex-shrink: 0;

                        @include icon-image("home.svg");
                    }
                }

                > .search {
                    width: 100%;
                    max-width: 300px;
                }
            }

            > .right {
                padding-right: 20px;

                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 10px;

                flex-basis: 50%;

                > .user {
                    width: 30px;
                    height: 30px;

                    flex-shrink: 0;

                    cursor: pointer;

                    @include icon-image("user-solid.svg");
                }
            }
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
            height: 60px;

            padding: 20px;

            background-color: #bbbbbb;

            position: absolute;
            bottom: 0px;
        }
    }
}
</style>
