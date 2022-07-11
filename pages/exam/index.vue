<template>
  <view>
    <!-- 自定义导航 -->
    <cu-custom bgColor="bg-gradual-blue" :isBack="false">
        <block slot="content">考试中心</block>
    </cu-custom>
    
    <!-- tab栏 -->
    <TabScroll :tab-list="navList" @tabChange="tabChange"></TabScroll>

    <!-- 考试详情 -->
    <view v-if="isLogin && cur === 0">
        <exam-item :nav-index="cur" :list-data="examPaperList"></exam-item>
    </view>
    
    <view v-else-if="isLogin && cur === 1">
        <exam-item :nav-index="cur" :list-data="answerList"></exam-item>
    </view>

    <view style="text-align: center;" v-else>
        <image style="width:300rpx; height:300rpx; margin-top: 100rpx" src="/static/ASCElogo.png" />
    </view>
	
    <!-- 底部撑开块 -->
    <bottom-view></bottom-view>
  </view>
</template>

<script>
import * as ApiExam from '@/api/exam';
import ExamItem from './components/ExamItem';
import {Exam} from '@/common/enum/exam'
import TabScroll from '../../components/TabScroll'
export default {
    components: {
        ExamItem,
        TabScroll
    },
    props: {
        isLogin: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // tab选项卡索引
            cur: 0,
            // 考试数据
            examPaperList: [],
            // 考试记录
            answerList: [],
            // tab列表
            navList: []
		};
	},

    /**
     * 监听页面加载
     */
    created() {
        console.log(Exam.data);
        this.navList = Exam.data
        console.log(this.navList)
        this.onRefreshPage()
    },

    methods: {
        /**
         * 刷新页面
         */
        onRefreshPage() {
            // 判断是否已经登录
            // this.isLogin = checkLogin();
            // 获取页面数据
            this.getPageData();
        },

        /**
         * 获取页面数据
         */
        getPageData() {
            this.getAllExam()
        },

        /**
         * 获取所有的试卷
         */
        getAllExam() {
            this.isLogin && ApiExam.getAllExamInfo()
                .then(result => {
                    this.examPaperList = result.data.examPaperList
                })
                .catch(err => {
                    reject(err)
                })
        },

        /**
         * 查询考试记录
         */
        getRecodeScore() {
            // return new Promise((resolve, reject) => {
            this.isLogin && ApiExam.selectAllExamPaperAnswer()
                .then(result => {
                    this.answerList = result.data.answerList
                })
                .catch(err => {
                    reject(err)
                })
            // })
        },

        /**
         * 切换tab选项
         */
        tabChange(cur) {
            console.log(cur)
            this.cur = cur;
            if (this.cur === 0) {
                this.getAllExam()
            } else if (this.cur === 1) {
                this.getRecodeScore()
            }
        }
    },


    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        this.tabSelect(this.TabCur)
        uni.stopPullDownRefresh()
    }
}
</script>

<style lang="scss" scoped>
</style>