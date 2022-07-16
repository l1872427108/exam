<template>
    <view v-if="isShow">
        <!-- 自定义导航 -->
        <cu-custom bgColor="bg-gradual-blue" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">考试记录</block>
        </cu-custom>

        <!-- 题目顶部 -->
        <view class="detail-header animation-slide-top">
            <view class="detail-header__item">
                <text class="detail-header__item-content">{{questions.length}}</text>
                <text class="detail-header__item-title">题目数量</text>
            </view>
            <view class="detail-header__item">
                <text class="detail-header__item-content">{{totalScore}}</text>
                <text class="detail-header__item-title">总分</text>
            </view>
            <view class="detail-header__item">
                <text class="detail-header__item-content">{{userScore}}</text>
                <text class="detail-header__item-title">得分</text>
            </view>
        </view>

        <!-- 题目头部 -->
        <view v-for="(item, index) in questions" :key="item.id">
            <!-- 题目组件 -->
            <SelectExamDetail :question-index="index" :answer="getAnswer(item.id)" :question="item"></SelectExamDetail>
        </view>

    </view>
</template>

<script>
import {getExamPaperUserAnswer} from '@/api/exam'
import SelectExamDetail from './components/SelectExamDetail'
export default {
    components: {
        SelectExamDetail,
    },
    data() {
        return {
            // 用户得分
            userScore: '',
            // 总分数
            totalScore: '',
            // 所有的题目
            questions: [],
            // 所有的答案
            answers: [],
            // 第一次是否显示
            isShow: false
        }
    },

    /**
     * 监听页面加载
     */
    onLoad(option) {
        let detail = option.id;
        if (detail && parseInt(detail) !== 0) {
            this.getPageData(detail)
        }
    },
    methods: {
        /**
         * 获取考试记录
         */
        getPageData(id) {
            getExamPaperUserAnswer(id)
                .then(result => {
                    // 初始化数据
                    this.isShow = true
                    const detail = result.data.details;
                    detail.paperTitleList.forEach(function(item) {
                        this.push(...item.questionList);
                    }, this.questions)
                    this.userScore = detail.userScore;
                    this.totalScore = detail.paperScore;
                    this.answers = detail.userAnswerList;
                    this.questionCount = this.questions.length - 1
                })
        },
        getAnswer(id) {
            return this.answers.find(k => k.questionId == id);
        }
    }

}
</script>

<style lang="scss" scoped>
	
    .detail-header {
		width: 630rpx;
		background: #ffffff;
		border-radius: 10rpx;
		box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(206, 204, 204, 0.5);
		margin-left: 60rpx;
        display: flex;
		justify-content: center;
		height: 150rpx;
	}

    .detail-header__item {
        width: 210rpx;
        text-align: center;
        display: flex;
        flex-direction: column;

        .detail-header__item-content {
            font-size: 48rpx;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: left;
            color: #333333;
            line-height: 66rpx;
            margin-top: 20rpx;
            text-align: center;
        }
        .detail-header__item-title {
            font-size: 28rpx;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #999999;
            line-height: 40rpx;
            text-align: center;
        }
    }



</style>