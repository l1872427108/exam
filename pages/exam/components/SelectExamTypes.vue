<template>
  <view class="wrong-list">
        <!-- <uni-transition :mode-class="['slide-right']"> -->
            <!-- <view class="box"> -->

                <!-- 头部 -->
                <!-- <view class="exam-title">
                    <view v-for="item in questionHeader" :key="item.type" class="">
                        <text v-if="question.questionType == item.type">
                            {{questionIndex !== -1 ? questionIndex : ''}} {{item.name}} {{question.questionTopic}}
                        </text>
                    </view>
				</view> -->
            <!-- </view> -->

            <!-- <view class="title-line"></view> -->

            <!-- 单选 -->
            <view v-if="question.questionType === '0'">
                <view class="wrong-list-item">
                    <view class="exam-title">
                        <text>【单选题】{{question.questionTopic}}</text>
                    </view>
                    <view class="title-line"></view>
                    <view class="select-option" v-for="item in question.stemLists" :key="item.id">
                        <view class="select-content" :class="answer.content == item.options ? answer.doRight=='1'?'option-action':'option-error':''">
                            <text>{{item.options}}.{{item.content}}</text>
                        </view>
                    </view>
                    <view class="answer">
                        <text>正确答案：{{question.successContent}}</text>
                    </view>
                    <view class="title-line"></view>
                    <view class="ideas" @click="onShowIdeas">
                        <text>查看解析</text>
                    </view>
                </view>
                
			</view>

            <!-- 多选 -->
            <view v-if="question.questionType === '1'">
                <view class="wrong-list-item">
                    <view class="exam-title">
                        <text>【多选题】{{question.questionTopic}}</text>
                    </view>
                    <view class="title-line"></view>
                    <view class="select-option" v-for="item in question.stemLists" :key="item.id">
                        <view class="select-content" :class="answer.userChoiceList.some(items => items.content == item.options) ? answer.doRight=='1'?'option-action':'option-error':''">
                            <text>{{item.options}}.{{item.content}}</text>
                        </view>
                    </view>
                    <view class="answer">
                        <text>正确答案：{{question.successContent}}</text>
                    </view>
                    <view class="title-line"></view>
                    <view class="ideas" @click="onShowIdeas">
                        <text>查看解析</text>
                    </view>
                </view>
			</view>

            <!-- 判断 -->
            <view v-if="question.questionType === '2'">
                <view class="wrong-list-item">
                    <view class="exam-title">
                        <text>【判断题】{{question.questionTopic}}</text>
                    </view>
                    <view class="title-line"></view>
                    <view class="select-option">
                        <view class="select-content" :class="'0' == question.successContent ? answer.doRight=='1'?'option-action':'option-error':''">
                            <text>正确。</text>
                        </view>
                    </view>
                    <view class="select-option">
                        <view class="select-content" :class="'1' == question.successContent ? answer.doRight=='1'?'option-action':'option-error':''">
                            <text>错误。</text>
                        </view>
                    </view>
                    <view class="answer">
                        <text>正确答案：{{question.successContent === '0' ? '正确' : '错误'}}</text>
                    </view>
                    <view class="title-line"></view>
                    <view class="ideas" @click="onShowIdeas">
                        <text>查看解析</text>
                    </view>
                </view>
            </view>

            <!-- 填空题 -->
            <view v-if="question.questionType === '3'">
                <view class="wrong-list-item">
                    <view class="exam-title">
                        <text>【填空题】{{question.questionTopic}}</text>
                    </view>
                     <view class="select-option" v-for="(item, index) in blankNum" :key="index">
                        <view class="select-content">
                            <text>{{answer.userChoiceList[index]['content']}}</text>
                        </view>
                    </view>
                    <view class="title-line"></view>
                    <view class="ideas">
                        <text @click="onShowIdeas(1)">查看解析</text>
                        <text @click="onShowIdeas(2)">查看答案</text>
                    </view>
                </view>
            </view> 

            <!-- 问答题 -->
            <view v-if="question.questionType === '4'">
                <view class="wrong-list-item">
                    <view class="exam-title">
                        <text>【问答题】{{question.questionTopic}}</text>
                    </view>
                    <view class="select-option">
                        <view class="select-content textarea">
                            <text>{{answer.content}}</text>
                        </view>
                    </view>
                   <view class="title-line"></view>
                    <view class="ideas jz">
                        <text @click="onShowIdeas(1)">查看解析</text>
                        <text @click="onShowIdeas(2)">查看答案</text>
                    </view>
                </view>
            </view>

            
            <u-popup v-model="showIdeas" mode="bottom" border-radius="20">
                <view class="ideas-line">
                </view>
                <view v-if="showBtn" class="ideas-content">
                    <text>{{question.questionParse}}</text>
                </view>
                 <view v-else class="answer">
                        <text>正确答案：</text>
                        <view v-for="item in question.successAnswers" :key="item.id">
                            <text>{{item.content}}</text>
                        </view>
                    </view>
                <view class="footer-block"></view>
            </u-popup>
        <!-- </uni-transition> -->
  </view>
</template>

<script>
import uniTransition from '@/components/uni-transition/uni-transition'
import uPopup from '@/components/u-popup/u-popup'
export default {
    components: {
        uniTransition,
        uPopup
    },
    props: {
        question: {
            type: Object,
            default: () => {}
        },
        answer: {
            type: Object,
            default: () => {}
        }
    },
    created() {
        console.log(this.question)
    },
    data() {
        return {
            showIdeas: false,
            blankNum: 0,
            singleActiveOpt: '',
            judgeActiveOpt: '',
            multipleActiveOpt: [],
            inputData: [],
            showBtn: true
            
        }
    },    

    watch: {
        
        question: {
            handler(val) {
                console.log('-===>',val)
                if (val.questionType === '3') {
                    this.blankNum = this.question.questionTopic.match(/____&nbsp;/g).length;
                }
            },
            immediate:true
        }

    },
    methods: {
        onShowIdeas(index = 1) {
            if (index === 1) {
                this.showBtn = true;
            } else {
                this.showBtn = false;
            }
            this.showIdeas = true;
        }
    }
}
</script>

<style lang="scss">

.wrong-list {
		padding: 30rpx 60rpx;

        .exam-title {
				padding: 30rpx 25rpx 25rpx 25rpx;
				font-size: 30rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				text-align: left;
				color: #333333;
				line-height: 40rpx;
			}

		.wrong-list-item {
			width: 630rpx;
			background: #ffffff;
			border-radius: 16rpx;
			box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(117, 117, 117, 0.28);
			margin-bottom: 30rpx;


			.title-line {
				width: 630rpx;
				height: 2rpx;
				background: rgba(216, 216, 216, 0.76);
			}

			.answer {
				padding: 30rpx;

				text {
					width: 254rpx;
					height: 40rpx;
					font-size: 28rpx;
					font-family: PingFangSC, PingFangSC-Light;
					font-weight: 300;
					text-align: center;
					color: #333333;
					line-height: 40rpx;
				}
			}

			.ideas {
				padding: 35rpx;
				text-align: center;

				text {
					font-size: 32rpx;
					font-family: PingFangSC, PingFangSC-Regular;
					font-weight: 400;
					text-align: left;
					color: #1598fc;
				}
			}

			.select-option {
				padding: 30rpx 30rpx 0 30rpx;

				.error-option {
					background: #f66565 !important;

					text {
						color: #ffffff !important;
					}
				}

				.select-content {
					background: #eeeeee;
					border-radius: 4rpx;
					padding: 20rpx 30rpx;

					text {
						font-size: 30rpx;
						font-family: PingFangSC, PingFangSC-Regular;
						font-weight: 400;
						text-align: left;
						color: #888888;
						line-height: 50rpx;
					}
				}
                .textarea {
                    min-height: 400rpx;
                }
			}
		}
	}


.option-error {
		background: #f66565 !important;

		text {
			color: #ffffff !important;
		}
	}

	.option-action {
		background: #67C23A !important;

		text {
			color: #ffffff !important;
		}
	}

.jz {
    display: flex;
    justify-content: space-between;
}
</style>