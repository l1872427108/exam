<template>
    <!-- tool项 -->
    <view class="my-info-tool-item animation-slide-top">
        <view class="my-info-tool-item__btn mh20">
            <image class="my-info-tool-item__img mr10" :src='img' mode='aspectFit'></image>
            <text class='my-info-tool-item__person'>{{title}}</text>
        </view>
        <slot></slot>
    </view>
</template>

<script>
export default {
    props: {
        img: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style>

</style>