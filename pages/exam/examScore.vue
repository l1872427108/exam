<template>
  <view class="exam-result">
    <!-- 自定义导航 -->
    <cu-custom to="pages/tabBar/index" bgColor="bg-gradual-blue" :isBack="true">
        <!-- <block slot="content">考试</block> -->
        <block slot="backText">返回</block>
    </cu-custom>
    <view class="exam-result-main">
        <view class="exam-result-main__title"><text>考试结束</text></view>
        <view class="exam-result-main__content">
            <text>恭喜，考试结果 {{score}} 分, 感谢您的作答！</text>
        </view>
    </view>
  </view>
</template>

<script>
export default {
    onLoad(option) {
        this.score = option.score;
    },
    data() {
        return {
            score: ''
        }
    }
}
</script>

<style lang="scss">

.exam-result-main {
    width: 80%;
    text-align: center;
    margin: 300rpx auto;
    .exam-result-main__title {
        font-size: 70rpx;
        color: #0076fb;
        margin-bottom: 20rpx;
    }
    .exam-result-main__content {
        color: #000;
        font-size: 35rpx;
    }
}

</style>