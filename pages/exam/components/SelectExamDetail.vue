<template>
    <view class="detail-question">
        <!-- 单选 -->
        <view v-if="question.questionType === '0'">
            <view class="detail-question__item animation-scale-up">
                <view class="detail-question__item-title">
                    <text>{{questionIndex + 1}}、【单选题】<text :decode="true">{{question.questionTopic}}</text> {{`(得${answer.userScore ? answer.userScore : '0'}分)`}}</text>
                </view>
                <view class="title-line"></view>
                <view class="detail-question__select-option" v-for="item in question.stemLists" :key="item.id">
                    <view class="detail-question__select-content" :class="answer.content == item.options ? answer.doRight=='1'?'option-action':'option-error':''">
                        <text>{{item.options}}.{{item.content}}</text>
                    </view>
                </view>
                <view class="detail-question__item-answer">
                    <text>正确答案：{{question.successContent}}</text>
                </view>
                <view class="title-line"></view>
                <view class="detail-question__item-ideas" @click="onShowIdeas(1)">
                    <text>查看解析</text>
                </view>
            </view>
            
        </view>

        <!-- 多选 -->
        <view v-if="question.questionType === '1'">
            <view class="detail-question__item animation-scale-up">
                <view class="detail-question__item-title">
                    <text>{{questionIndex + 1}}、【多选题】<text :decode="true">{{question.questionTopic}}</text> {{`(得${answer.userScore ? answer.userScore : '0'}分)`}}</text>
                </view>
                <view class="title-line"></view>
                <view class="detail-question__select-option" v-for="item in question.stemLists" :key="item.id">
                    <view class="detail-question__select-content" :class="[getOptionClass(item)]">
                        <text>{{item.options}}.{{item.content}}</text>
                    </view>
                </view>
                <view class="detail-question__item-answer">
                    <text>正确答案：
                        <block v-for="item in question.successAnswers" :key="item.id">{{item.content}}</block>
                    </text>
                </view>
                <view class="title-line"></view>
                <view class="detail-question__item-ideas" @click="onShowIdeas(1)">
                    <text>查看解析</text>
                </view>
            </view>
        </view>

        <!-- 判断 -->
        <view v-if="question.questionType === '2'">
            <view class="detail-question__item animation-scale-up">
                <view class="detail-question__item-title">
                    <text>{{questionIndex + 1}}、【判断题】<text :decode="true">{{question.questionTopic}}</text> {{`(得${answer.userScore ? answer.userScore : '0'}分)`}}</text>
                </view>
                <view class="title-line"></view>
                <view class="detail-question__select-option">
                    <view class="detail-question__select-content" :class="'0' == answer.content ? answer.doRight=='1'?'option-action':'option-error':''">
                        <text>正确</text>
                    </view>
                </view>
                <view class="detail-question__select-option">
                    <view class="detail-question__select-content" :class="'1' == answer.content ? answer.doRight=='1'?'option-action':'option-error':''">
                        <text>错误</text>
                    </view>
                </view>
                <view class="detail-question__item-answer">
                    <text>正确答案：{{question.successContent === '0' ? '正确' : '错误'}}</text>
                </view>
                <view class="title-line"></view>
                <view class="detail-question__item-ideas" @tap="onShowIdeas(1)">
                    <text>查看解析</text>
                </view>
            </view>
        </view>

        <!-- 填空题 -->
        <view v-if="question.questionType === '3'">
            <view class="detail-question__item animation-scale-up">
                <view class="detail-question__item-title">
                    <text>{{questionIndex + 1}}、【填空题】<text :decode="true">{{question.questionTopic}}</text> {{`(得${answer.userScore ? answer.userScore : '0'}分)`}}</text>
                </view>
                    <view class="detail-question__select-option" v-for="(item, index) in blankNum" :key="index">
                    <view class="detail-question__select-content">
                        <text>{{answer.userChoiceList[index]['content']}}</text>
                    </view>
                </view>
                <view class="title-line"></view>
                <view class="detail-question__item-ideas jz">
                    <text @tap="onShowIdeas(1)">查看解析</text>
                    <text @tap="onShowIdeas(2)">查看答案</text>
                </view>
            </view>
        </view> 

        <!-- 问答题 -->
        <view v-if="question.questionType === '4'">
            <view class="detail-question__item animation-scale-up">
                <view class="detail-question__item-title">
                    {{questionIndex + 1}}、【问答题】<text :decode="true">{{question.questionTopic}}</text> {{`(得${answer.userScore ? answer.userScore : '0'}分)`}}
                </view>
                <view class="detail-question__select-option">
                    <view class="detail-question__select-content textarea">
                        <text>{{answer.content}}</text>
                    </view>
                </view>
                <view class="title-line"></view>
                <view class="detail-question__item-ideas jz">
                    <text @tap="onShowIdeas(1)">查看解析</text>
                    <text @tap="onShowIdeas(2)">查看答案</text>
                </view>
            </view>
        </view>

            
        <u-popup v-model="showIdeas" mode="bottom" border-radius="20">
            <view class="ideas-line">
            </view>
            <view v-if="showBtn" class="ideas-content">
                <text>{{question.questionParse ? question.questionParse : ''}}</text>
            </view>
                <view v-else class="ideas-content">
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
import uPopup from '@/components/u-popup/u-popup'
export default {
    components: {
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
        },
        questionIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            showIdeas: false,
            blankNum: 0,
            showBtn: true
            
        }
    },    

    watch: {
        
        question: {
            handler(val) {
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
        },
        getOptionClass(item) {
            console.log('item=>', item);
            console.log(this.answer);
            if (this.answer?.userChoiceList) {
                let f = this.answer.userChoiceList.some(items => items.content == item.options);
                let m = this.answer.doRight=='1'?'option-action':'option-error';
                return f ? m : '';
            }
            return ''
        }
    }
}
</script>

<style lang="scss" scoped>

.detail-question {
		padding: 30rpx 60rpx;

        .detail-question__item-title {
				padding: 30rpx 25rpx 25rpx 25rpx;
				font-size: 30rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				text-align: left;
				color: #333333;
				line-height: 40rpx;
		}

        .detail-question__select-content {
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


        .detail-question__item-answer {
            margin-top: 10rpx;
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

        .detail-question__item-ideas {
            padding: 35rpx;
            text-align: center;

            text {
                font-size: 33rpx;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #1598fc;
            }
        }

        .detail-question__select-option {
				padding: 30rpx 30rpx 0 30rpx;

				.error-option {
					background: #f66565 !important;

					text {
						color: #ffffff !important;
					}
				}

				
                .textarea {
                    min-height: 400rpx;
                }
		}

		.detail-question__item {
			width: 630rpx;
			background: #ffffff;
			border-radius: 16rpx;
			box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(117, 117, 117, 0.28);
			margin-bottom: 30rpx;
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

.title-line {
        width: 630rpx;
        height: 2rpx;
        background: rgba(216, 216, 216, 0.76);
        margin-top: 15rpx;
    }


.ideas-content {
    padding: 0 60rpx 30rpx 60rpx;

    text {
        font-size: 33rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #666666;
        line-height: 56rpx;
    }
}
</style>