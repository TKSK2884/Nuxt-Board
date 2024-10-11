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
            <div :class="$style.footer">
                <div>Copyright(c) by 조현석</div>
            </div>
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
        min-height: 100vh;

        position: relative;

        padding-bottom: 60px;

        > .header {
            width: 100%;
            min-height: 40px;

            display: flex;
            justify-content: space-between;

            > .left {
                display: flex;
                align-items: center;
                gap: 10px;

                padding-left: 40px;

                flex-basis: 50%;

                > .logo {
                    width: 30px;
                    height: 30px;

                    flex-shrink: 0;
                }

                > .search {
                    width: 100%;
                    max-width: 300px;
                }
            }

            > .right {
                flex-basis: 50%;
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
