<template>
  <view>
        <!-- <uni-transition :mode-class="['slide-right']"> -->
            <view class="box">

                <!-- 头部 -->
                <view class="text-header">
                    <view v-for="item in questionHeader" :key="item.type">
                        <text v-if="question.questionType == item.type">
                            {{questionIndex !== -1 ? questionIndex : ''}} {{item.name}} {{question.questionTopic}}
                        </text>
                    </view>
				</view>
            </view>


            <!-- 单选 -->
            <view v-if="question.questionType === '0'">
                
                <view v-for="item in question.stemLists" :key="item.id" class="text-option"
                    :class="{'option-action': item.options === singleActiveOpt}"
                    data-type="single" :data-option="item.options" @click="selectOption">
                    <text>{{item.options}}.{{item.content}}</text>
                </view>
			</view>

            <!-- 多选 -->
            <view v-if="question.questionType === '1'">
                <view v-for="item in question.stemLists" :key="item.id" class="text-option"
                    :class="multipleActiveOpt.indexOf(item.options) !== -1 ? 'option-action' : ''"
                    data-type="multiple" :data-option="item.options" @click="selectOption">
                    <text>{{item.options}}.{{item.content}}</text>
                </view>
			</view>

            <!-- 判断 -->
            <view v-if="question.questionType === '2'">
                <view :class="{'option-action': judgeActiveOpt === '0'}" class="text-option" data-type="judge"
                    data-option="0" @click="selectOption">
                    <text>正确。</text>
                </view>
                <view :class="{'option-action': judgeActiveOpt === '1'}" class="text-option"
                    data-type="judge" data-option="1" @click="selectOption">
                    <text>错误。</text>
                </view>
            </view>

            <!-- 填空题 -->
            <view v-if="question.questionType === '3'">
                <view v-for="(item, index) in blankNum" :key="index" class="text-option">
                    <input class="u-input" ref="input" :value="inputData[index]" data-type="blank" @input="selectOption($event, index)" height="90"></input>
                </view>
            </view> 

            <!-- 问答题 -->
            <view v-if="question.questionType === '4'">
                <view class="text-option">
                    <input class="u-textarea" type="textarea" data-type="areablank" height="500" :value="textarea" @input="selectOption"></input>
                </view>
            </view>

            
        <!-- </uni-transition> -->
  </view>
</template>

<script>
import uniTransition from '@/components/uni-transition/uni-transition'
export default {
    components: {
        uniTransition
    },
    props: {
        question: {
            type: Object,
            default: () => {}
        },
        questionIndex: {
            type: Number,
            default: -1
        },
        questionAnswer: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            questionHeader: [
                {
                    name: '【单选题】',
                    type: '0'
                },
                {
                    name: '【多选题】',
                    type: '1'
                },
                {
                    name: '【判断题】',
                    type: '2'
                },
                {
                    name: '【填空题】',
                    type: '3'
                },
                {
                    name: '【问答题】',
                    type: '4'
                }
            ],
            blankNum: 0,
            answer: [],
            singleActiveOpt: '',
            judgeActiveOpt: '',
            multipleActiveOpt: [],
            inputData: [],
            textarea: ''
        }
    },

    

    watch: {
        question: {
            handler(val) {
                console.log('selectExamType', val)
                if (val.questionType === '3') {
                    this.blankNum = this.question.questionTopic.match(/____&nbsp;/g).length;
                }
                this.handleSaveAnswer(val);
            }
        },
        questionIndex(val) {
            console.log(val);
        },
        questionAnswer(val) {
            // console.log('selectExamType==>', val);
            // if (this.question.questionType == '0') {
            //     this.singleActiveOpt = val;
            // } else if (this.question.questionType == '1') {
            //     this.multipleActiveOpt = val ? val.split(',') : [];
            // } else if (this.question.questionType === '2') {
            //     this.judgeActiveOpt = val;
            // } else if (this.question.questionType === '3') {
            //     this.inputData = val ? val.split(',') : []
            // } else if (this.question.questionType === '4') {
            //     this.textarea = val
            // }
        }

    },
    methods: {
        /**
         * 做答
         */
        selectOption(e, i) {
            var type = e.currentTarget.dataset.type
            var option = e.currentTarget.dataset.option
            switch (type) {
                // 单选
                case 'single':
                    this.singleActiveOpt = option;
                    this.$emit('valueChange', {option, questionIndex: this.questionIndex})
                    break;
                // 多选
                case 'multiple':
                    let index = this.multipleActiveOpt.indexOf(option);
                    if (index === -1) {
                        this.multipleActiveOpt.push(option);
                    } else {
                        this.multipleActiveOpt.splice(index, 1);
                    }
                    console.log(this.multipleActiveOpt)
                    this.$emit('valueChange', {option: this.multipleActiveOpt.join(','), questionIndex: this.questionIndex})
                    break;
                // 判断
                case 'judge':
                    this.judgeActiveOpt = option;
                    this.$emit('valueChange', {option, questionIndex: this.questionIndex})

                    break;
                // 填空
                case 'blank':
                    this.inputData[i] = e.target.value;
                    this.$emit('valueChange', {option: this.inputData.join(','), questionIndex: this.questionIndex});
                    break;
                // 问答
                case 'areablank':
                    this.textarea = e.target.value;
                    this.$emit('valueChange', {option: this.textarea, questionIndex: this.questionIndex});
                    break;
            }
        },

        /**
         * 保存答案
         */
        handleSaveAnswer(val) {
            if (val.questionType == '0') {
                this.singleActiveOpt = this.questionAnswer;
            } else if (val.questionType == '1') {
                this.multipleActiveOpt = this.questionAnswer ? this.questionAnswer.split(',') : [];
            } else if (val.questionType === '2') {
                this.judgeActiveOpt = this.questionAnswer;
            } else if (val.questionType === '3') {
                this.inputData = this.questionAnswer ? this.questionAnswer.split(',') : []
            } else if (val.questionType === '4') {
                this.textarea = this.questionAnswer
            }
        }
    }
}
</script>

<style lang="scss">
.u-input {
	position: relative;
	flex: 1;
    display: flex;

    font-size: 30rpx;
    border-radius: 6rpx;
    border: 1px solid #dcdfe6;
}

.u-textarea {
    position: relative;
    width: auto;
    font-size: 28rpx;
    padding: 10rpx 0;
    border: 1px solid #dcdfe6;
    border-radius: 6rpx;
}
</style>