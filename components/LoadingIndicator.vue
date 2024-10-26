<template>
    <div :class="$style.index">
        <div :class="$style.inner">
            <div :class="$style.loading">
                <span />
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
        width: 200px;
        height: 200px;

        margin-inline: auto;

        position: relative;
        top: calc(50% - 100px);

        display: block;
        overflow: hidden;
        background: none;

        > .loading {
            width: 100%;
            height: 100%;

            position: relative;

            > span {
                width: 50px;
                height: 50px;

                position: absolute;
                top: 100px;
                left: 100px;

                z-index: 350;

                border: 6px solid #666666;
                border-top-color: transparent;
                border-radius: 50%;

                animation: rotate 0.5s linear infinite;
            }
        }
    }

    @keyframes rotate {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
}
</style>
