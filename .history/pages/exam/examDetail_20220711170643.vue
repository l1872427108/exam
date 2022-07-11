<template>
  <view>
      <!-- 自定义导航 -->
    <cu-custom bgColor="bg-gradual-blue" :isBack="false">
        <block slot="content">考试详情</block>
    </cu-custom>


    <view class="box">
        <!-- <view class="cuoti-header">
            <view class="cuoti-one">
                <text>10道错题</text>
            </view>
            <view class="cuoti-two">
                <text>错题率10%</text>
            </view>
        </view> -->

        <view class="dq">
            <view class="subject">
                <view class="nubber">
                    <text class="num">100</text>
                    <text class="txt">全部题目</text>
                </view>
                <view class="nubber">
                    <text class="num">80</text>
                    <text class="txt">正确</text>
                </view>
                <view class="nubber">
                    <text class="num">20</text>
                    <text class="txt">错误</text>
                </view>
            </view>
        </view>
    </view>


    <view v-for="(item, index) in questions" :key="item.id">
        <SelectExamType :answer="answers[index]" :question="item"></SelectExamType>
    </view>
        
        <!-- <u-popup v-model="showIdeas" mode="bottom" border-radius="20">
            <view class="ideas-line">
			</view>
            <view class="ideas-content">
				<text>111111111</text>
			</view>
            <view class="footer-block"></view>
        </u-popup> -->
        <view class="footer-block"></view>
        
  </view>
</template>

<script>
import uPopup from '@/components/u-popup/u-popup'
import {getExamPaperUserAnswer} from '@/api/exam'
import SelectExamType from './components/SelectExamTypes'
export default {
    components: {
        uPopup,
        SelectExamType
    },
    data() {
        return {
            showIdeas: false,
            select: {
                pageindex: 1,
                pagesize: 10,
                hasNextPages: true,
                items: [
                    {
                    id: '1533793190518231041',
                    question: '本科评估最大的受益者是____&nbsp;',
                    optionA: '学生',
                    optionB: '学院',
                    optionC: '师生',
                    optionD: '教师',
                    stuanswerdetail: {
                        stuanswer: 'A,B',
                        answer: '你猜'
                    },
                }
                ]
            },
            questions: [],
            question: {},
            nowQuestionNum: 6,
            questionCount: 0,
            answers: [],
            answer: {}
        }
    },
    onLoad() {
        this.getPageData();
    },
    methods: {
        /**
         * 获取考试记录
         */
        getPageData() {
            getExamPaperUserAnswer('1543975353666510849')
                .then(result => {
                    const detail = result.data.details;
                    detail.paperTitleList.forEach(function(item) {
                        this.push(...item.questionList);
                    }, this.questions)

                    this.answers = detail.userAnswerList;
                    this.questionCount = this.questions.length - 1
                    this.question = this.questions[this.nowQuestionNum];
                    this.answer = this.answers[this.nowQuestionNum];
                })
        },
        onShowIdeas() {
            this.showIdeas = true;
        }
    }

}
</script>

<style lang="scss">
.box {
		/* background: url('../../static/wrong_bg.png'); */
		background-repeat: no-repeat;
		background-size: 750rpx 292rpx;
		height: 292rpx;
		position: relative;

		.cuoti-header {
			height: 200rpx;
			z-index: 999;
			padding-left: 60rpx;
			padding-top: 26rpx;
			.cuoti-one{
				text{
					height: 50rpx;
					font-size: 36rpx;
					font-family: PingFangSC, PingFangSC-Regular;
					font-weight: 400;
					text-align: left;
					color: #ffffff;
					line-height: 50rpx;
				}
			}
			.cuoti-two{
				padding-top: 10rpx;
				text{
					height: 34rpx;
					font-size: 24rpx;
					font-family: PingFangSC, PingFangSC-Regular;
					font-weight: 400;
					text-align: left;
					color: #ffffff;
					line-height: 34rpx;
				}
			}
		}

		.image-header {
			position: absolute;
			left: 0;
			top: 0;

			image {
				height: 292rpx;
				width: 750rpx;
			}
		}
	}

	.ideas-line {
		margin: 25rpx auto 25rpx auto;
		width: 200rpx;
		height: 8rpx;
		background: rgba(216, 216, 216, 0.6);
		border-radius: 6rpx;
	}

	.ideas-content {
		padding: 0 60rpx 30rpx 60rpx;

		text {
			font-size: 40rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: center;
			color: #666666;
			line-height: 56rpx;
		}
	}

	.subject {
		display: flex;
		justify-content: center;
		height: 150rpx;

		.nubber {
			width: 210rpx;
			// height: 150rpx;
			text-align: center;
			display: flex;
			flex-direction: column;

			.num {

				font-size: 48rpx;
				font-family: PingFangSC, PingFangSC-Medium;
				font-weight: 500;
				text-align: left;
				color: #333333;
				line-height: 66rpx;
				margin-top: 20rpx;
				text-align: center;
			}

			.txt {
				font-size: 28rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				text-align: left;
				color: #999999;
				line-height: 40rpx;
				text-align: center;
			}
		}
	}

	.dq {
		width: 630rpx;
		// height: 160rpx;
		background: #ffffff;
		border-radius: 10rpx;
		box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(206, 204, 204, 0.5);
		margin-left: 60rpx;
		position: absolute;
		top: 144rpx;
	}




</style>