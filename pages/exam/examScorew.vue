<template>
  <view class="exam-result">
    <!-- 自定义导航 -->
    <cu-custom bgColor="bg-gradual-blue" :isBack="false">
        <block slot="content">考试详情</block>
    </cu-custom>
    <view class="exam-result-main">
        <view class="exam-result-main__title"><text>考试结束</text></view>
        <view class="exam-result-main__content">
            <text>考试结果, 感谢您的作答！</text>
        </view>
    </view>
  </view>
</template>

<script>
export default {

}
</script>

<style lang="scss">

.exam-result-main {
    .exam-result-main__title {
        font-size: 60rpx;
        color: aqua;
    }
}

</style>