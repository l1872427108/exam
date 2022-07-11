<template>
    <!-- 用户详情项 -->
    <view class="user-detail__item animation-slide-bottom" :style="[{animationDelay: '0.2s'}]">
        <view class="content">
            <text class="text-grey">{{title}}</text>
        </view>
        <view class="action">
            <text class="text-grey">{{info}}</text>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        title: {
            type: String,
            default: ''
        },
        info: {
            type: [String|Number],
            default: ''
        }
    }
}
</script>

<style>

</style>