<template>
  <view v-if="!isFirstload">
        <scroll-view>
            <swiper class="home-screen-swiper square-dot"  :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500" :style="[{animation: 'show 0.2s 1'}]">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image class="home-screen-swiper__image" :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
				</swiper-item>
			</swiper>
        </scroll-view>
        

        <view class="content">
        <view class="cuoti animation-slide-right">
            <view class="item">
                <view class="item-top">
                    <view class="cuoti-num ellipse-line">
                        <text>{{examListLen}}</text>
                    </view>
                    <!-- <view class="right">
                        <image src="../../static/you@2x.png" mode="widthFix" />
                    </view> -->
                </view>
                <view class="item-bottom">
                    <view class="bottom-txt">
                        <text>总考试数</text>
                    </view>
                </view>
            </view>
            <view style="width:50rpx;"></view>
            <view class="item">
                <view class="item-top">
                    <view class="cuoti-num ellipse-line">
                        <text>{{examRecodeLen}}</text>
                    </view>
                    <!-- <view class="right">
                        <image src="../../static/you@2x.png" mode="widthFix" />
                    </view> -->
                </view>
                <view class="item-bottom">
                    <view class="bottom-txt">
                        <text>总记录数</text>
                    </view>
                </view>
            </view>
        </view>


        <!-- 考试课程 -->
        <view class="cell-title">
            <view class="left-block"></view>
            <text class="title">
                考试
            </text>
            <!-- <text class="more">更多</text> -->
        </view>

        <view class="exam-list">
            <view class="exam-item" v-for="(item, index) in examList" :key="index">
                <view class="exambg">
                    <image :src="'../../static/exambg'+(index+1)+'.png'" mode="aspectFill" />
                </view>
                <view class="exam-title ellipse-2">
                    <text>{{item.questionHomeName}}</text>
                </view>
                <view class="exam-icon">
                    <image src="../../static/examwin.png" mode="widthFix" />
                </view>
            </view>
            <!-- <view v-show="!examListLen"> -->
                 <view v-show="!examListLen" style="text-align: center;width: 100%;">
                    <image src="../../static/nodata.png" />
                </view>
                <!-- <view class="exam-none">
                    <image class="exam-none" src="../../static/nodata.png">
                </view> -->
            <!-- </view> -->
        </view>
        
        <!-- 今日成绩 -->
        <view class="cell-title">
            <view class="left-block"></view>
            <text class="title">
                成绩
            </text>
            <!-- <text class="more">更多</text> -->
        </view>

        <view class="today-chengji" v-for="item in examRecode" :key="item.id">
            <view class="today-content">
                <view><text class="ellipse-2">{{item.questionHomeName}}</text>
                </view>
                <view>考试成绩：{{item.userScore}}分</view>
            </view>
            <view class="bg">
                <image src="../../static/Oval2@2x@2x.png" mode="widthFix" />
            </view>
        </view>
        <view v-show="!examRecodeLen" style="text-align: center;width: 100%;">
            <image src="../../static/nodata.png" />
        </view>
        <!-- <bottom-view></bottom-view> -->
        </view>
        <!-- 底部撑开块 -->
        <bottom-view></bottom-view>
  </view>
</template>

<script>

import {Home} from '../../common/enum/home'
import * as ExamApi from '../../api/exam';
import { checkLogin } from '@/utils/app';
export default {
    props: {
        isLogin: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            swiperList: Home.data,
            examList: [],
            examListLen: 0,
            examRecode: [],
            examRecodeLen: 0,
            // 正在加载
            isLoading: true,
            // 首次加载
            isFirstload: true,

        }
    },
    created() {
        console.log(this.isLogin);
        // Object.freeze(this.swiperList)
        this.getPageData();
    },

    methods: {
        /**
         * 获取页面数据
         */
        getPageData(callback) {
            Promise.all([this.getExamCenter(), this.getExamRecode()])
                .then(result => {
                    this.isFirstload = false
                    callback && callback()
                })
                .catch(err => console.log('catch', err))
                .finally(() => this.isLoading = false)
        },
        /**
         * 获取考试中心
         */
        getExamCenter() {
            return new Promise((resolve ,reject) => {
                !checkLogin() ? resolve(null) : ExamApi.getAllExamInfo()
                    .then(result => {
                        const list = result.data.examPaperList;
                        this.examListLen = list.length;
                        if (list.length <= 4) {
                            this.examList = list;
                        } else {
                            this.examList = list.splice(0, 4);
                        }
                        console.log(this.examList)
                        resolve(this.examList)
                    })
                    .catch(err => {
                        // this.isLogin = false;
                        reject(err);
                    })
            })
        },
        /**
         * 获取考试记录
         */
        getExamRecode() {
            return new Promise((resolve ,reject) => {
                !checkLogin() ? resolve(null) : ExamApi.selectAllExamPaperAnswer()
                    .then(result => {
                        const list = result.data.answerList
                        this.examRecodeLen = list.length;
                        if (list.length <= 4) {
                            this.examRecode = list;
                        } else {
                            this.examRecode = list.splice(0, 3);
                        }
                        resolve(this.examRecode)
                    })
                    .catch(err => {
                        // this.isLogin = false;
                        reject(err);
                    })
            })
        }
    }
}
</script>

<style lang="scss">
@import "@/styles/tools/index.scss";
@include b(home-screen-swiper) {
    min-height: 375rpx;

    @include e(image) {
        @include dimensions(100%, 100%);
        display: block;
        pointer-events: none;
    }
}

.content {
		padding-left: 60rpx;
		padding-right: 60rpx;
		padding-top: calc(30rpx + var(--status-bar-height));
        padding-bottom: 200rpx;
	}

.today-chengji {
		width: 630rpx;
		height: 172rpx;
		background: #ffffff;
		border-radius: 20rpx;
		margin-top: 28rpx;
		position: relative;

		.today-content {
			position: absolute;
			top: 10rpx;
			left: 38rpx;
			width: 400rpx;
			height: 152rpx;
			font-size: 26rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: left;
			color: #0076fb;
			display: flex;
			flex-direction: column;

			view {
				flex: 1;
				display: flex;
				align-items: center;
			}

			view:nth-child(1) {
				font-size: 30rpx;
				font-weight: 700;
			}
		}

		.icon {
			position: absolute;
			right: 80rpx;
			top: 42rpx;

			image {
				height: 88rpx;
				width: 88rpx;
			}
		}

		.bg {
			position: absolute;
			right: 0;
			top: 0;

			image {
				height: 172rpx;
				float: right;
			}
		}
	}

.cuoti {
		height: 200rpx;
		width: 100%;
		display: flex;
		margin-top: 50rpx;
        margin: 0 auto;

		.item {
			width: 290rpx;
			height: 200rpx;
			background: #ffffff;
			border-radius: 50rpx;
			box-shadow: 2rpx 4rpx 40rpx 0rpx rgba(221, 219, 219, 0.4);
			display: flex;
			flex-direction: column;

			.item-top {
                text-align: center;
				.cuoti-num {
                    /* text-align: center; */
					/* margin-left: 58rpx; */
					margin-top: 26rpx;
					/* width: 109rpx; */
					height: 90rpx;
					color: #434242;
					font-size: 64rpx;
					font-family: PingFangSC, PingFangSC-Semibold;
					font-weight: 600;
					text-align: center;

					text {
						font-size: 64rpx;
						font-family: PingFangSC, PingFangSC-Semibold;
						font-weight: 600;
						line-height: 90rpx;
					}
				}

				.right {
					padding-top: 52rpx;
					flex: 1;
					position: relative;

					image {
						width: 26rpx;
						height: 40rpx;
						position: absolute;
						right: 72rpx;
					}
				}
			}

			.item-bottom {
				padding-top: 10rpx;
				color: #888888;
				font-size: 32rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				text-align: center;
				line-height: 44rpx;
			}
		}
	}


    .cell-title {
		width: 100%;
		height: 50rpx;
		display: flex;
		margin-top: 50rpx;

		.left-block {
			width: 10rpx;
			height: 32rpx;
			background: #0076fb;
			border-radius: 6rpx;
			margin-top: 10rpx;
		}

		.title {
			padding-left: 10rpx;
			color: #444444;
			font-size: 36rpx;
			font-family: PingFangSC, PingFangSC-Semibold;
			font-weight: 600;
			text-align: left;
			line-height: 50rpx;
			flex: 1;
		}

		.more {
			width: 56rpx;
			height: 40rpx;
			color: #0076fb;
			font-size: 28rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: center;
			line-height: 50rpx;
		}
	}


    .exam-list {
		width: 632rpx;
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
		flex-wrap: wrap;

		.exam-none {
			/* background-image: url(../../static/exam-none.svg); */
			/* width: 356rpx;
			height: 306rpx; */
			/* background-repeat: no-repeat; */
			/* background-size: 356rpx 306rpx; */
			/* margin-left: 137rpx; */
		}

		.exambg {
			width: 100%;
			height: 130rpx;
			border-radius: 16rpx;
			position: absolute;
			z-index: -1;
			left: 0;
			top: 0;

			image {
				width: 100%;
				height: 130rpx;
				border-radius: 16rpx;
				z-index: -1;
			}
		}

		.exam-item:nth-child(1) {
			margin-bottom: 15rpx;
		}

		.exam-item:nth-child(2) {
			margin-bottom: 15rpx;
		}

		.exam-item {
			padding: 20rpx 16rpx;
			flex: 1;
			// width: 300rpx;
			height: 130rpx;
			border-radius: 16rpx;
			position: relative;

			.exam-title {
				width: 260rpx;
				font-size: 26rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				text-align: left;
				color: #ffffff;
				line-height: 34rpx;
				margin-left: 10rpx;

				text {
					font-size: 26rpx;
					font-family: PingFangSC, PingFangSC-Regular;
					font-weight: 400;
					text-align: left;
					color: #ffffff;
					line-height: 34rpx;
				}
			}

			.exam-icon {
				width: 40rpx;
				height: 42rpx;
				position: absolute;
				right: 20rpx;
				top: 74rpx;

				image {
					width: 40rpx;
					height: 42rpx;
				}
			}
		}
	}


    .cell-title {
		width: 100%;
		height: 50rpx;
		display: flex;
		margin-top: 50rpx;

		.left-block {
			width: 10rpx;
			height: 32rpx;
			background: #0076fb;
			border-radius: 6rpx;
			margin-top: 10rpx;
		}

		.title {
			padding-left: 10rpx;
			color: #444444;
			font-size: 36rpx;
			font-family: PingFangSC, PingFangSC-Semibold;
			font-weight: 600;
			text-align: left;
			line-height: 50rpx;
			flex: 1;
		}

		.more {
			width: 56rpx;
			height: 40rpx;
			color: #0076fb;
			font-size: 28rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: center;
			line-height: 50rpx;
		}
	}


</style>

