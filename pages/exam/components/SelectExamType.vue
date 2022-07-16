<template>
  <view>

    <!-- 头部 -->
    <view class="text-header fz35 mt30 ml35">
        <view v-for="item in questionHeader" :key="item.type">
            <block v-if="question.questionType == item.type">
                {{mode ? '' : `${questionIndex}、`}}{{item.name}} <text :decode="true">{{question.questionTopic}}</text>
            </block>
        </view>
    </view>

    <!-- 单选 -->
    <view v-if="question.questionType === '0'">
        
        <view v-for="item in question.stemLists" :key="item.id" class="text-option mt30 ml35"
            :class="{'text-option--action': item.options === singleActiveOpt}"
            data-type="single" :data-option="item.options" @tap="selectOption">
            <text>{{item.options}}.{{item.content}}</text>
        </view>
    </view>

    <!-- 多选 -->
    <view v-if="question.questionType === '1'">
        <view v-for="item in question.stemLists" :key="item.id" class="text-option mt30 ml35"
            :class="multipleActiveOpt.indexOf(item.options) !== -1 ? 'text-option--action' : ''"
            data-type="multiple" :data-option="item.options" @tap="selectOption">
            <text>{{item.options}}.{{item.content}}</text>
        </view>
    </view>

    <!-- 判断 -->
    <view v-if="question.questionType === '2'">
        <view :class="{'text-option--action': judgeActiveOpt === '0'}" class="text-option mt30 ml35" data-type="judge"
            data-option="0" @tap="selectOption">
            <text>正确</text>
        </view>
        <view :class="{'text-option--action': judgeActiveOpt === '1'}" class="text-option mt30 ml35"
            data-type="judge" data-option="1" @tap="selectOption">
            <text>错误</text>
        </view>
    </view>

    <!-- 填空题 -->
    <view v-if="question.questionType === '3'">
        <view v-for="(item, index) in blankNum" :key="index" class="text-option mt30 ml35">
            <input class="text-input fz30" ref="input" :value="inputData[index]" data-type="blank" @input="selectOption($event, index)" height="90"></input>
        </view>
    </view> 

    <!-- 问答题 -->
    <view v-if="question.questionType === '4'">
        <view class="text-option mt30 ml35">
            <textarea maxlength="-1" class="text-textarea fz35 pv10" data-type="areablank" :value="textarea" @input="selectOption"></textarea>
        </view>
    </view>

            
        <!-- </uni-transition> -->
  </view>
</template>

<script>
import Question from '@/common/enum/exam/Question'
export default {
    components: {
    },
    props: {
        // 当前问题
        question: {
            type: Object,
            default: () => {}
        },
        // 当前索引
        questionIndex: {
            type: Number,
            default: -1
        },
        // 当前答案
        questionAnswer: {
            type: String,
            default: ''
        },
        mode: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            questionHeader: Question.data,
            // 填空个数
            blankNum: 0,
            // 单选
            singleActiveOpt: '',
            // 判断
            judgeActiveOpt: '',
            // 多选
            multipleActiveOpt: [],
            // 填空
            inputData: [],
            // 多行文本
            textarea: ''
        }
    },

    

    watch: {
        question: {
            handler(val) {
                if (val.questionType === '3') {
                    this.blankNum = this.question.questionTopic.match(/____&nbsp;/g).length;
                }
                this.handleSaveAnswer(val);
            },
            immediate:true
        }
    },
    methods: {
        /**
         * 做答
         */
        selectOption(e, i) {
            // if (!this.mode) {
            //     return;
            // }
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
                    console.log(this.textarea);
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
        },

        /**
         * 获取html数据
         */
         getOptionData(name, type) {
             return `${name} ${type}`
         }
    }
}
</script>

<style lang="scss" scoped>
.text-input {
    border: 1rpx solid #dcdfe6;
    height: 88rpx;
}

.text-textarea {
    border: 1rpx solid #dcdfe6;
    width: auto;
}


.text-header {
    width: 670rpx;
    font-weight: 400;  
    text-align: left;  
    line-height: 50rpx;
    display: flex;
}


.text-option {
    width: 670rpx;
    background: #eeeeee;
    border-radius: 4rpx;
    text-align: left;
}

.text-option text {
    font-size: 36rpx;
    font-weight: 400;
    color: #888888;
    line-height: 50rpx;
    display: flex;
    padding: 30rpx;
    text-align: left;
}


.text-option--action {
    background: #0076fb !important;

    text {
        color: #ffffff !important;
    }
}


</style>