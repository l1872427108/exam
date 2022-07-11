<template>
    <block class="exam-content">
        <view v-for="item in listData" :key="item.id" @tap="handleClick(item)" class="exam-content__item fz30 animation-slide-right">
            <view class="exam-content__item-title ph30">
                <text>{{ item.paperName }}</text>
                <text class="exam-content__item-title-time fz23">{{ navIndex === 0 ? `${item.suggestTime}分钟` : `${item.userScore}分` }}</text>
            </view>
            <view class="exam-content__item-info ph30">
                <text>总数:{{ item.paperCount }}</text>
                <text>总分:{{ item.paperScore }}</text>
                <text>{{navIndex === 0 ? `次数:${item.remainJoinNum}` : `提交:${item.gmtModified}` }}</text>
            </view>
        </view>
    </block>
</template>

<script>
export default {
    props: {
        listData: {
            type: Array,
            default: () => []
        },
        navIndex: {
            type: [String|Number],
            default: 0
        }
    },
    methods: {
        /**
         * 点击区域
         */
        handleClick(item) {
            if (this.navIndex === 0) {

                const isExam = !this.checkExamTime(item);

                isExam && this.$navTo('pages/exam/examSection', {id: item.id})
            } else if (this.navIndex === 1) {
                // 记录
            }
        },

        /**
         * 检测是否在考试时间段
         */
        checkExamTime(item) {
            let nowTime = Date.parse(new Date());
            let startTime = Date.parse(new Date(item.limitStartTime.replace(/-/g, '/')));
            let endTime = Date.parse(new Date(item.limitEndTime.replace(/-/g, '/')));
            console.log('nowTime',nowTime)
            console.log('startTime',startTime)
            console.log('endTime',endTime)
            
            if (nowTime < startTime) {
                // 考试未开始
                uni.showModal({
                    title: '提示',
                    content: '考试未开始'
                })
                return false;
            } else if (nowTime >= endTime) {
                // 考试已结束
                uni.showModal({
                    title: '提示',
                    content: '考试已结束'
                })
                return false;
            }
            uni.showModal({
                title: '提示',
                content: '考试未开始',
                showCancel: true,
                success(res) {
                    if (res.confirm) {
                        return true;
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/settings/var.scss";
@import "@/styles/tools/index.scss";
@include b(exam-content) {
    
    @include e(item) {
        display: block;
        overflow: hidden;
        border-radius: 8rpx;
        margin: 30rpx;
        padding: 30rpx 30rpx 0 30rpx;
        background-color: $background-color-secondary;
    }
    
    @include e(item-title) {
        color: $color-text-secondary;  //secondary
        height: 70rpx;  
        @include box-center($justify: space-between);
        border-bottom: 1px $border-width-base $color-transparent-black;
    }

    @include e(item-info) {
         height: 100rpx;
        @include box-center($justify: space-between);
        color: #666666;
    }

    @include e(item-title-time) {
        color: $color-text-quaternary;
        background-color: rgba(58, 142, 230, .1);
        border-radius: 30rpx;
        display: block;
        min-width: 70rpx;
        width: 60rpx;
        height: 32rpx;
        line-height: 32rpx;
        text-align: center;
    }
}
</style>