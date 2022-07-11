<template>
  <view class="bg-secondary" style="height: 100vh;">

    <!-- 顶部收缩 -->
    <view class="slot-wrap">
        <view class="exam-exit" @click="exitExam">
            <text>退出</text>
        </view>
        <view class="right_app" @tap="openTab">十</view>
    </view>

    <!-- 题目弹框 -->
    <uPopup v-model="showApp" mode="top" border-radius="20">

        <view class="app-content">
                <!-- <view class="app-header">
                    <view class="exam-title ellipse-line" style="text-align: center;">
                        {{testAnswerData.questionHomeName}}
                    </view>
                    <view class="close-app" @click="closeTab">--</view>
                </view> -->
            <view class="datilist">
                <view :class="[item ? 'dati-suc' : '']" @click="goQuestion(index)" class="dati-item" v-for="(item, index) in answer"
                    :key="index">
                    <text>{{index + 1}}</text>
                </view>
            </view>
            <view class="exam-btn">
                <button class="exam-sumbit" @click="submitExam"><text>交 卷</text></button>
            </view>
        </view>
    </uPopup>

        <view class="time-header">
            <view class="time-left">
                <text>剩余时间</text>
            </view>
            <view class="time-num">
                <view class="item">
                    <text>{{examTime.hour}}</text>
                </view>
                <view class="dot">
                    <text>:</text>
                </view>
                <view class="item">
                    <text>{{examTime.min}}</text>
                </view>
                <view class="dot">
                    <text>:</text>
                </view>
                <view class="item">
                    <text>{{examTime.second}}</text>
                </view>
            </view>
            <view class="time-right" v-if="mode">
                <text class="that-num">{{nowQuestionNum}}</text>
                <text class="count">/ {{questionCount}}</text>
            </view>
        </view>
        <view class="line"></view>


        <uni-transition :mode-class="['slide-right']" :show="showQuestion">
            <!-- 单题 -->
            <view v-show="mode">
                <SelectExamType :questionIndex="nowQuestionNum" :questionAnswer="getCurrentAnswer(nowQuestionNum)" :question="question" @valueChange="valueChange"></SelectExamType>
            </view>

            <!-- 整卷 -->
            <view v-show="!mode">
                <view v-for="(item, index) in questions" :key="item.id">
                    <SelectExamType :questionIndex="index" :questionAnswer="getCurrentAnswer(index)" :question="item" @valueChange="valueChange"></SelectExamType>
                </view>
            </view>

            <bottom-view v-show="!mode"></bottom-view>
        </uni-transition>


        <!-- 底部按钮部分 -->
        <view class="footer">
			<view class="footer-content">
                <view class="footer-left">
                    <view @click="mode = !mode">{{mode ? '单题' : '整卷'}}</view>
                </view>
				<view class="footer-right">
					<view class="right-item" @click="preQuestion">
						<text>上一题</text>
					</view>
					<view class="right-item" @click="nextQuestion">
						<text>下一题</text>
					</view>
                    <!-- 到达最后一题就可以看到此按钮 -->
                    <view :loading="loading" class="right-item" @click="submitExam">
                        <text>{{handleText}}</text>
                    </view>
				</view>
			</view>
		</view>
  </view>
</template>

<script>
import uPopup from '@/components/u-popup/u-popup'
import uniTransition from '@/components/uni-transition/uni-transition'
import UInput from '@/components/u-input/u-input'
import Navbar from '@/components/uni-nav-bar/uni-nav-bar'
import SelectExamType from './components/SelectExamType'
import * as Utils from '@/utils/util'
import {getOneExamPaper, subimtExamAnswer} from '@/api/exam'
import BottomView from '@/components/BottomView'
export default {
    components: {
        uPopup,
        uniTransition,
        UInput,
        Navbar,
        SelectExamType,
        BottomView
    },
    data() {
        return {
            // 试卷ID
            examId: '',
            // 显示下拉框
            showApp: false,
            // 时间
            examTime: {
                hour: '00',
                min: '00',
                second: '00'
            },
            // 现在作答题号
            nowQuestionNum: 0,
            // 作答题目总数
			questionCount: 1,
            // 当前展示的题目
            question: {},
            // 做题时间
            questionTime: '',
            showQuestion: true,
            // 所有的题目
            questions: [],
            // 收集做题答案
            answer: [],
            // 是否整卷预览
            isPreview: false,
            // 交卷文字
            handleText: '交卷',
            loading: false,
            // 做题模式
            mode: true
        }
    },

    watch: {
        // 监听当前显示的题
        // question() {
        //     // setTimeout(() => {
        //         // 展示题目
        //         this.showQuestion = true
                
        //     // }, 300)
        // },
        // 监听当前题号变化 统一对上一题/下一题处理逻辑
        nowQuestionNum(index) {
            console.log(index);
            // 刷新题目
            // this.showQuestion = false
            // 通过最新的下标切换到下一题 
            this.question = this.questions[index];
        },
        mode() {
        }
    },

    onLoad(option) {
        // 获取examId
        // this.examId = options.id
        let examId = '1534519261341425666'
        if (examId && parseInt(examId) !== 0) {
            this.getPageData()
            this.showTime()
            setInterval(() => {
                this.showTime()
            }, 1000);
        }
    },

    methods: {
        getCurrentAnswer(index) {
            const current = this.answer[index]
            if (typeof current !== 'object') return ''
            if (this.question.questionType === '1') {
                return current.userChoiceList
            } else {
                return current.answer;
            }
        },
        /**
         * 获取试卷信息
         */
        getPageData() {
            const param = {"examPaperId": "1534519261341425666"};
            getOneExamPaper(param).then(result => {
                // 拆分数据
                const exam = result.data.examPaperVo;
                // 初始化时间
                this.questionTime = exam.suggestTime * 60;
                // 初始化题目
                exam.paperTitleList.forEach(function(item) {
                    this.push(...item.questionList);
                }, this.questions)
                // 初始化题数
                this.questionCount = this.questions.length - 1
                // 初始化题目答案个数
                this.answer = new Array(this.questions.length)
                // 初始化当前要展示的题目
                this.question = this.questions[this.nowQuestionNum];
            })
        },

        /**
         * 统一处理值
         */
        valueChange(data) {
            // 如果是当前的就是当前的
            this.nowQuestionNum = data.questionIndex;
            // 交给answer数组
            const id = this.question.id;
            const obj = {id};
            if (this.question.questionType === '1') {
                obj.userChoiceList = data.option;

            } else {
                
                obj.answer = data.option;
            }
            this.answer[this.nowQuestionNum] = obj;
            console.log('answer====>', this.answer);
        },


        /**
         * 打开题号弹框
         */
        openTab() {
			this.showApp = true
		},

        /**
         * 关闭选项卡
         */
        closeTab() {
            this.showApp = false
        },

        /**
         * 上一题
         */
        preQuestion() {
            var preNum = this.nowQuestionNum - 1;
            if (preNum < 0) {
                this.nowQuestionNum = 0
            } else {
                this.nowQuestionNum = preNum
            }
        },

        /**
         * 下一题
         */
        nextQuestion() {
            var nextNum = this.nowQuestionNum + 1;
            // 判断是否是最后一道题
            if (nextNum > this.questions.length - 1) {
                return false;
            } else {
                this.nowQuestionNum = nextNum;
            }
        },

        /**
         * 预览试卷
         */
        previewQuestion() {
            // 改变状态
            // 显示到另一张卷子
            this.isPreview = true;
        },

        /**
         * 跳到对应的题目
         */
        goQuestion(index) {
            this.nowQuestionNum = index + 1
            this.showApp = false
        },

        /**
         * 退出
         */
        exitExam() {
            const that = this;
            uni.showModal({
                title: '提示',
                content: '退出将强制交卷',
                showCancel: true,
                success(res) {
                    if (res.confirm) {
                        // 交卷操作
                        that.submitExam();
                    }
                }
            })
        },

        /**
         * 作答
         */
        selectOption(e) {
            var type = e.currentTarget.dataset.type;
            var option = e.currentTarget.dataset.option
            // 加入到对应的答案列表中
            
            // 分别可以判断到四种类型的答案，然后分别添加
                
        },

        /**
         * 交卷操作
         */
        submitExam() {
            const that = this;
            const notAnswered = this.countNotAnswered();
            console.log(notAnswered)
            let msg = '确认要交卷吗?'
            if (notAnswered > 0) {
                msg = '您还有' + notAnswered + '题未作答，确认要交卷吗?'
            }

             uni.showModal({
                title: '提示',
                content: msg,
                showCancel: true,
                success(res) {
                    if (res.confirm) {
                        that.doHandler();
                    }
                    
                }
            })
        },

        /**
         * 交卷请求
         */
        doHandler() {
            this.handleText = '正在交卷，请稍等...'
            // this.loading = true;
            // 发送请求
            const collectAnswer = {
            //     doTime: '0',
            //     paperId: "1534519261341425666",
            //     userId: '1531911455257956354',
            //     userName: '高禄',
            //     userAnswerList: this.answer
            // }
            doTime: "0",
            paperId: "1534519261341425666",
            // userAnswerList: [{id: "1533792655186628609", answer: "1212"}, {id: "1533792658512711681", answer: "121"}, {}, {}],
            userId: "1531911455257956354",
            userName: "高禄",
            userAnswerList: this.answer
            }
            subimtExamAnswer(collectAnswer)
                .then(result => {
                    // 将成绩发送到考试结果页面
                    let score = result.data.score;
                    // 跳转路径
                })
                .catch(err => {
                    console.log(err);
                })
            
        },

        /**
         * 展示剩余时间
         */
        showTime() {
            try {
                // 毫秒数
                var time = this.questionTime * 1000,
                    timeh = Math.floor(time / (1000 * 60 * 60) % 24), //计算小时数
					timem = Math.floor(time / (1000 * 60) % 60), //计算分钟数
					times = Math.floor(time / 1000 % 60); //计算秒数
                this.examTime.hour = Utils.addPreZero(timeh);
                this.examTime.min = Utils.addPreZero(timem);
                this.examTime.second = Utils.addPreZero(times);
                // 判断是否考试结束
                if (timeh == 0 && timem == 0 && times == 0) {
                    // 交卷操作
                }
            } catch (err) {
                console.log(err)
            }
        },

        /**
         * 统计还有多少题未做
         */
        countNotAnswered() {
            let notAnswered = 0;
            console.log(this.answer)
            for (let i = 0; i < this.answer.length; i++) {
                if (!this.answer[i]) {
                    notAnswered += 1;
                }
            }
            return notAnswered
        }

    }
}
</script>

<style lang="scss">
.slot-wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40rpx;
		flex: 1;

		.exam-exit {
			font-size: 36rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: left;
			color: #333333;
			line-height: 48rpx;
		}

		.right_app {
			/* background-image: url('../../static/exam_app.svg'); */
			background-repeat: no-repeat;
			background-size: 100%;
			height: 49rpx;
			width: 49rpx;
		}

	}

.pop {
    margin-top: 100px !important;
}

.app-content {
		margin: 0 40rpx 25rpx 40rpx;

		.exam-btn {
			padding: 0rpx 200rpx 0 200rpx;

			.exam-sumbit {
				height: 88rpx;
				background: #fff;
				border-radius: 10rpx;
				font-size: 36rpx;
				line-height: 88rpx;
				color: #2db0fe;
				text-align: center;

			}
		}



		.datilist {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-start;
			padding-left: 10rpx;

			/* .dati-err {
				background: #ff4545;
				color: #fff;
			} */
            .dati-suc {
                background: #2db0fe !important;
                color: #fff;
            }

			.dati-none {
				border: 4rpx solid #2db0fe;
				color: #2db0fe;

				text {
					line-height: 76rpx !important;
				}
			}

			.dati-item {
				width: 81.66666rpx;
				height: 81.66666rpx;
				margin: 15rpx;
				border-radius: 100%;
				text-align: center;
                background-color: #888888;

				text {
					font-size: 36rpx;
					line-height: 81rpx;
				}
			}
		}

		.app-header {
			height: 88rpx;
			display: flex;
			width: 100vw;
			padding-left: 60rpx;
			padding-right: 120rpx;
			.close-app {
				width: 50rpx;
				height: 50rpx;
				position: absolute;
				right: 40rpx;
				/* background-image: url(../../static/app_close.svg); */
				background-repeat: no-repeat;
				background-size: 100%;
				top: 18rpx;
				top: calc(18rpx + env(safe-area-inset-top)) !important;
			}

			.exam-title {
				position: relative;
				line-height: 88rpx;
				text-align: center;
				font-size: 32rpx;
				flex: 1;
				text {
					width: 520rpx;
					height: 88rpx;
					font-family: PingFangSC, PingFangSC-Light;
					font-weight: 300;
					text-align: center;
					color: #333333;
					line-height: 88rpx;
				}
			}
		}
	}


.time-header {

		padding: 0 32rpx;
		display: flex;
		height: 120rpx;
		justify-content: space-start;

		.time-left {
			width: 130rpx;
			height: 120rpx;
			font-size: 28rpx;
			font-weight: 300;
			text-align: right;
			color: #333333;
			line-height: 120rpx;
		}

		.time-num {
			width: 200rpx;
			height: 120rpx;
			display: flex;
			padding: 37rpx 15rpx;
			justify-content: space-between;

			.item {
				width: 44rpx;
				height: 46rpx;
				background: #333333;
				border-radius: 6rpx;
				color: #fff;
				text-align: center;
				line-height: 46rpx;

				text {
					width: 42rpx;
					height: 46rpx;
					font-size: 24rpx;
					font-weight: 300;
					color: #ffffff;
					line-height: 46rpx;
				}
			}

			.dot {
				line-height: 46rpx;
			}
		}

		.time-right {
			width: 96rpx;
			height: 120rpx;
			line-height: 120rpx;
			text-align: right;
			flex: 1;

			.that-num {
				width: 48rpx;
				height: 56rpx;
				font-size: 40rpx;
				color: #333333;
				line-height: 56rpx;
				padding-right: 5rpx;
			}

			.count {
				width: 48rpx;
				height: 40rpx;
				font-size: 28rpx;
				font-weight: 400;
				text-align: center;
				color: #cccccc;
				line-height: 40rpx;
			}
		}
	}


    .line {
		margin: 0 30rpx;
		height: 1rpx;
		background: rgba(218, 218, 218, 0.3);
	}




.footer {
		position: fixed;
		bottom: 0;
		background: #fff;
		padding-bottom: env(safe-area-inset-bottom);
		box-shadow: 0rpx -2rpx 20rpx 20rpx #f5f5f5;

		.footer-content {
			background: #ffffff;
			min-width: 740rpx;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 40rpx;

			.footer-right {
				display: flex;
				line-height: 100rpx;

				.right-item:first-child {
					margin-right: 54rpx;
				}
                .right-item:nth-child(2) {
					margin-right: 54rpx;
				}
                

				.right-item {
					height: 100rpx;
					width: 96rpx;
					font-size: 32rpx;
					font-family: PingFangSC, PingFangSC-Regular;
					font-weight: 400;
					text-align: left;
					color: #44a7fc;
				}
			}

			.footer-left {
				display: flex;
				justify-content: space-between;
				line-height: 100rpx;
				box-flex: 1;

				.item:first-child {
					margin-right: 54rpx;
				}

				.item {
					display: flex;
					justify-content: space-between;

					.suc-num {
						width: 36rpx;
						height: 48rpx;
						font-size: 34rpx;
						font-family: PingFangSC, PingFangSC-Regular;
						font-weight: 400;
						text-align: left;
						color: #299afa;
						line-height: 100rpx;
						position: relative;
						left: 10rpx;
					}

					.err-num {
						width: 36rpx;
						height: 48rpx;
						font-size: 34rpx;
						font-family: PingFangSC, PingFangSC-Regular;
						font-weight: 400;
						text-align: left;
						color: #fd0000;
						line-height: 100rpx;
						position: relative;
						left: 10rpx;
					}

					.suc-icon {
						width: 40rpx;
						height: 40rpx;
						position: relative;
						top: 30rpx;
						/* background-image: url(../../static/exam_suc.svg); */
						background-repeat: no-repeat;
						background-size: 100%;
					}

					.err-icon {
						width: 40rpx;
						height: 40rpx;
						position: relative;
						top: 30rpx;
						/* background-image: url(../../static/exam_err.svg); */
						background-repeat: no-repeat;
						background-size: 100%;
					}
				}
			}
		}
	}


.text-header {
		width: 670rpx;
		height: 100rpx;
		font-size: 36rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		text-align: left;
		color: #333333;
		line-height: 50rpx;
		margin-left: 32rpx;
		margin-top: 30rpx;
		display: flex;
	}


    .text-option {
		width: 670rpx;
		background: #eeeeee;
		border-radius: 4rpx;
		margin-left: 32rpx;
		margin-top: 30rpx;
		text-align: left;
	}

	.text-option text {
		font-size: 36rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		color: #888888;
		line-height: 50rpx;
		display: flex;
		padding: 30rpx;
		text-align: left;
	}

	.option-error {
		background: #f66565 !important;

		text {
			color: #ffffff !important;
		}
	}

	.option-action {
		background: #2799fa !important;

		text {
			color: #ffffff !important;
		}
	}
</style>