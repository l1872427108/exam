<template>
  <view class="bg-secondary" :style="{height: mode ? '100vh' : ''}" v-if="isShow">
    
    <!-- 导航栏 -->
    <cu-custom bgColor="#FFF" :isBack="false"></cu-custom>

    <!-- 顶部收缩 -->
    <view class="exam-app ph40">
        <view class="exam-app__left" @click="exitExam">
            <image class="exam-app__image" src="/static/fanhui.png" />
        </view>
        <view v-show="mode" class="exam-app__right" @tap="openTab">
            <image class="exam-app__image" src="/static/exam_app.svg" />
        </view>
    </view>

    <!-- 题号弹框 -->
    <uPopup zIndex="999" v-model="showApp" mode="top" border-radius="20">

        <view class="popup">
            <view class="popup__list pl10">
                <view :class="[item.answer || item.userChoiceList ? 'popup__list-item--active' : '']" @tap="goQuestion(index)" class="popup__list-item fz35" v-for="(item, index) in answer"
                    :key="index">
                    <text>{{index + 1}}</text>
                </view>
            </view>
            <view class="popup__btn">
                <button class="button-direction" @tap="$debounce(submitExam, 500, true)"><text>交 卷</text></button>
            </view>
        </view>
    </uPopup>

    <!-- 时间 -->
    <view class="time ph30">
        <view class="time__text fz30">
            <text>剩余时间</text>
        </view>
        <view class="time__num">
            <view class="time__num-item radius10 fz25">
                <text>{{examTime.hour}}</text>
            </view>
            <view class="time__num-dot">
                <text>:</text>
            </view>
            <view class="time__num-item radius10 fx25">
                <text>{{examTime.min}}</text>
            </view>
            <view class="time__num-dot">
                <text>:</text>
            </view>
            <view class="time__num-item radius10 fx25">
                <text>{{examTime.second}}</text>
            </view>
        </view>
        <view class="time__count" v-if="mode">
            <text class="time__count-now fz40 pl10">{{nowQuestionNum}}</text>
            <text class="time__count-total fz30">/ {{questionCount}}</text>
        </view>
    </view>

    <!-- 线条 -->
    <PageLine></PageLine>


    <!-- 题目 -->
    <!-- 单题 -->
    <view v-if="mode">
        <SelectExamType :mode="mode" :questionIndex="nowQuestionNum" :questionAnswer="getCurrentAnswer(nowQuestionNum, question)" :question="question" @valueChange="valueChange"></SelectExamType>
    </view>

    <!-- 整卷 -->
    <view v-else class="exam-main">
        <view v-for="(item, index) in questions" :key="item.id">
            <SelectExamType :mode="mode" :questionIndex="index + 1" :questionAnswer="getCurrentAnswer(index + 1, item)" :question="item" @valueChange="valueChange"></SelectExamType>
        </view>
    </view>


    <!-- 底部按钮部分 -->
    <view class="footer fixed">
        <view class="footer-content ph40">
            <view class="footer-content__left">
                <view @click="mode = !mode">{{mode ? '整卷' : '单卷'}}</view>
            </view>
            <view class="footer-content__right">
                <view v-show="mode" class="footer-content__right-item fz30" @tap="preQuestion">
                    <text>上一题</text>
                </view>
                <view v-show="mode" class="footer-content__right-item fz30" @tap="nextQuestion">
                    <text>下一题</text>
                </view>
                <view class="footer-content__right-item fz30" @tap="$debounce(submitExam)">
                    <text>交卷</text>
                </view>
            </view>
        </view>
    </view>
  </view>
</template>

<script>
import uPopup from '@/components/u-popup/u-popup'
import SelectExamType from './components/SelectExamType'
import * as Utils from '@/utils/util'
import {getOneExamPaper, subimtExamAnswer} from '@/api/exam'
import BottomView from '@/components/BottomView'
import * as UserApi from '@/api/user'
import storage from '@/utils/storage';
import PageLine from '../../components/PageLine/index'
export default {
    components: {
        uPopup,
        SelectExamType,
        BottomView,
        PageLine
    },
    data() {
        return {
            // 显示下拉框
            showApp: false,
            // 时间
            examTime: {
                hour: '00',
                min: '00',
                second: '00'
            },
            // 现在作答题号
            nowQuestionNum: 1,
            // 作答题目总数
			questionCount: 1,
            // 当前展示的题目
            question: {},
            // 做题时间
            questionTime: '',
            // 所有的题目
            questions: [],
            // 收集做题答案
            answer: [],
            // 交卷锁
            isButton: false,
            // 做题模式
            mode: true,
            // 用户信息
            userInfo: {},
            isShow: false,
            logoutNum: 0
        }
    },

    watch: {
        // 监听当前题号变化 统一对上一题/下一题处理逻辑
        nowQuestionNum(index) {
            this.question = this.questions[index - 1];
        }
    },
    onHide() {
        // 记录当前时间, 清除定时器
        if (this.timer) {
            clearInterval(this.timer);
        }
        // 保存当前时间
        this.nowTime = Date.now();
        // 退出一次
        this.logoutNum++;
    },
    onShow() {
        // 第一次展示是 0 不会走
        if (this.logoutNum !== 0 && this.logoutNum < 3) {
            this.$toast(`您已经退出${this.logoutNum}次，3次会自动提交`);
        } else if (this.logoutNum >= 3) {
            this.$toast(`一秒后将自动提交`);
            setTimeout(() => {
                this.doHandler()
            }, 1000)
        }
        // 第一次展示是没有的 nowTime
        if (this.nowTime) {
            // 新的时间
            let _now = Date.now();
            console.log(_now, this.nowTime);
            // 比对
            let lastTime = this.questionTime - parseInt((_now - this.nowTime) / 1000);
            lastTime <= 0 ? this.questionTime = 0 : this.questionTime = lastTime;
            // 初始化时间
            this.initTime();
        }
    },
    onLoad(option) {
        this.examId = option.id;
        if (this.examId && parseInt(this.examId) !== 0) {
            this.getPageData()
            this.getUserInfo();
            // 初始化时间
            this.initTime();
        }
    },
    onUnload() {
        this.nowTime = null;
        clearInterval(this.timer)
    },

    methods: {
        getCurrentAnswer(index, question) {
            const current = this.answer[index - 1]
            if (typeof current !== 'object') return ''
            if (question.questionType === '1' || question.questionType === '3') {
                return current.userChoiceList
            } else {
                return current.answer;
            }
        },
        /**
         * 获取试卷信息
         */
        getPageData() {
            const param = {"examPaperId": this.examId};
            getOneExamPaper(param).then(result => {
                // 拆分数据
                const exam = result.data.examPaperVo;
                // 初始化时间
                this.questionTime = exam.suggestTime * 60;
                this.totalTime = exam.suggestTime;
                // 初始化题目
                exam.paperTitleList.forEach(function(item) {
                    this.push(...item.questionList);
                }, this.questions)
                // 初始化题数
                this.questionCount = this.questions.length;
                // 初始化题目答案个数
                this.answer = new Array(this.questions.length)
                // 初始化当前要展示的题目
                this.question = this.questions[this.nowQuestionNum - 1];
                this.isShow = true;
            })
        },

        /**
         * 获取当前用户信息
         */
        getUserInfo() {
            UserApi.getUserInfo({})
                .then(result => {
                    this.userInfo = result.data.qskInfo
                })
                .catch(err => {
                    reject(err)
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
            if (this.question.questionType === '1' || this.question.questionType === '3') {
                obj.userChoiceList = data.option;

            } else {
                
                obj.answer = data.option;
            }
            this.answer[this.nowQuestionNum - 1] = obj;
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
            if (preNum < 1) {
                this.nowQuestionNum = 1
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
            if (nextNum > this.questions.length) {
                return false;
            } else {
                this.nowQuestionNum = nextNum;
            }
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
                confirmColor: '#0076fb',
                showCancel: true,
                success(res) {
                    if (res.confirm) {
                        // 交卷操作
                        that.doHandler();
                    }
                }
            })
        },

        /**
         * 交卷操作
         */
        submitExam() {
            const that = this;
            const notAnswered = this.countNotAnswered();
            let msg = '确认要交卷吗?'
            if (notAnswered !== 0) {
                this.$toast('您还有' + notAnswered + '题未作答，请作答完毕');
                return;
            }
            // 够了
            this.doHandler();
        },

        /**
         * 交卷请求
         */
        doHandler() {
            if (this.isButton) return;
            this.isButton = true;
            // 发送请求
            this.$toast('正在交卷中...');
            const collectAnswer = {
                doTime: this.totalTime - parseInt(this.questionTime / 60) + '',
                paperId: this.examId,
                userId: this.userInfo.id,
                userName: this.userInfo.userName,
                userAnswerList: this.answer
            }
            subimtExamAnswer(collectAnswer)
                .then(result => {
                    // 将成绩发送到考试结果页面
                    let score = result.data.score;
                    console.log(score);
                    // 清空lastTime
                    storage.remove('lastTime');
                    // 跳转路径
                    this.$navTo('pages/exam/examScore', {score}, 'redirectTo')
                })
                .catch(err => {
                    console.log(err);
                    this.isButton = false;
                })
                .finally(() => {
                    this.isButton = false;
                })
            
        },

        /**
         * 展示剩余时间
         */
        showTime() {
            try {
                // 毫秒数
                if (this.questionTime !== '') {
                    let time = this.questionTime * 1000,
                    timeh = Math.floor(time / (1000 * 60 * 60) % 24), //计算小时数
					timem = Math.floor(time / (1000 * 60) % 60), //计算分钟数
					times = Math.floor(time / 1000 % 60); //计算秒数
                    this.examTime.hour = Utils.addPreZero(timeh);
                    this.examTime.min = Utils.addPreZero(timem);
                    this.examTime.second = Utils.addPreZero(times);
                    // 判断是否考试结束
                    if (timeh === 0 && timem === 0 && times === 0) {
                        // 交卷操作
                        this.doHandler();
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },

        /**
         * 统计还有多少题未做
         */
        countNotAnswered() {
            const len = this.answer.length;
            let notAnswered = len;
            for (let i = 0; i < len; i++) {
                if (this.answer[i]?.answer || this.answer[i]?.userChoiceList) {
                    notAnswered -= 1;
                }
            }
            console.log(notAnswered);
            return notAnswered
        },

        initTime() {
            this.showTime();
            this.timer = setInterval(() => {
                this.questionTime--;
                this.showTime()
            }, 1000);
        }

    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/settings/var.scss";
@import "@/styles/tools/index.scss";
.exam-app {
    @include box-center($justify: space-between);
    .exam-app__left, .exam-app__right {
        @include dimensions(49rpx, 49rpx);
    }
    .exam-app__image {
        @include dimensions(100%, 100%);
    }
}

.popup {
    padding-top: 150rpx;
    margin: 0 40rpx 25rpx 40rpx;

    .popup__btn {
        padding: 0rpx 200rpx 0 200rpx;
    }

    .popup__list {
        @include grid($flex-wrap: wrap, $justify-content: space-start);
    }

    .popup__list-item {
        @include dimensions(81rpx, 81rpx);
        margin: 15rpx;
        border-radius: 100%;
        text-align: center;
        border: 1px solid $border-color-base;
        line-height: 81rpx;
    }
    .popup__list-item--active {
        background: $background-color-tertiary;
        color: $color-text-tertiary;
    }
}


.time {
    height: 120rpx;
    @include grid($justify-content: space-start);

    .time__text {
        height: 120rpx;
        text-align: right;
        color: $color-text-secondary;
        line-height: 120rpx;
    }

    .time__num {
        @include dimensions(200rpx, 120rpx);
        padding: 37rpx 15rpx;
        @include grid($justify-content: space-between);
    }
    .time__num-item {
        @include dimensions(44rpx, 46rpx);
        background: #333333;
        color: $color-white;
        text-align: center;
        line-height: 46rpx;
    }

    .time__num-dot {
        line-height: 46rpx;
    }

    .time__count {
        @include dimensions(96rpx, 120rpx);
        line-height: 120rpx;
        text-align: right;
        flex: 1;

    }

    .time__count-now {
        @include dimensions(48rpx, 56rpx);
        line-height: 56rpx;
    }

    .time__count-total {
        @include dimensions(48rpx, 40rpx);
        font-weight: 400;
        text-align: center;
        color: #cccccc;
        line-height: 40rpx;
    }
}




.footer {
    bottom: 0;
    background: $background-color-secondary;

    .footer-content {
        min-width: 740rpx;
        height: 100rpx;
        line-height: 100rpx;

        @include grid($justify-content: space-between);

        .footer-content__right {
            display: flex;
        
            .footer-content__right-item {
                @include dimensions(120rpx, 100rpx);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: right;
                color: $color-text-quaternary;
            }
        }
	}
}


.exam-main {
    padding-bottom: 200rpx !important;
}
</style>