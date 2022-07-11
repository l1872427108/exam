<!-- 个人中心 -->
<template>
	<view v-if="!isFirstload" class="my-info">
		<!-- 顶部背景 -->
		<view class='my-info-bg pt30' :style="'background-image: url(' + pic[topBackGroupImageIndex].link + ');margin-top:' + CustomBar + 'px;'">
				<!-- 已登录 -->
                <view v-if="isLogin">
					<avatar-image :width="150" />
				</view>
                <!-- 未登录 -->
                <view v-else @tap="handleLogin" class="my-info-bg__nologin">
					<avatar-image :width="150" />
					<view class="my-info-bg__nologin-text">
						未登录，请点击登录账号
					</view>
				</view>

			<image class="my-info-bg__img" src='https://cdn.nlark.com/yuque/0/2019/gif/280373/1570670848649-assets/web-upload/3dbaa72a-062b-470f-9b9d-058ff8f85ab8.gif'
			 mode='scaleToFill'></image>
		</view>
        <!-- 学生信息 -->
		<block>
			<view class="my-info-student pa30">
				<view v-for="(item, index) in studentInfo" :key="index" class="my-info-student__item solid-right animation-slide-bottom">
					<view :class="item.color" class="text-xxl">{{ isLogin ? userInfo[item.key] : '--' }}</view>
					<view class="margin-top-sm">{{item['name']}}</view>
				</view>
			</view>

            <!-- 工具 -->
			<view class="my-info-tool">

				<user-tool-item img="/static/me/icon/bianqian.png" title="个人资料" @click.native="toInfoView"></user-tool-item>
				
                <user-tool-item img="/static/me/icon/lvhang.png" title="分享小程序"></user-tool-item>
				
			</view>


            <!-- 其他工具 -->

            <view class="my-info-tool">

                <user-tool-item img="/static/me/icon/dengta.png" title="技术支持" @tap="callPhoneNumber">
                    <view class="action pr20">
						<view class="cu-tag round bg-blue light">13111182031</view>
					</view>
                </user-tool-item>

                <user-tool-item img="/static/me/icon/chucuo.png" title="问题反馈"></user-tool-item>

                <user-tool-item img="/static/me/icon/xiaoxi.png" title="关于我们" @click.native="toAboutOut"></user-tool-item>
               
			</view>

            <view class="my-info-tool" v-if="isLogin">

                <user-tool-item img="/static/me/icon/xiaoxi.png" title="退出登录" @tap="handleLogout"></user-tool-item>
            
            </view>

		</block>
		
        <!-- 底部撑开块 -->
        <bottom-view></bottom-view>
	</view>
</template>

<script>
import store from '@/store'
import * as UserApi from '@/api/user'
import { checkLogin } from '@/utils/app';
import AvatarImage from '@/components/AvatarImage';
import BottomView from '@/components/BottomView';
import UserToolItem from './components/UserToolItem';
import {User, Pic} from '../../common/enum/user';
	export default {
        components: {
            AvatarImage,
            BottomView,
            UserToolItem
        },
        props: {
            isLogin: {
                type: Boolean,
                default: false
            }
        },
		data() {
			return {
                // 主题颜色
				pic: Pic.data,
				topBackGroupImageIndex: 4,
                // 正在加载
                isLoading: true,
                // isLogin: false,
                // 首次加载
                isFirstload: false,
                // 当前用户信息
                userInfo: {},
                // 学生信息
                studentInfo: User.data
			}
		},

		/**
         * 声命周期--监听页面显示
         */
        created() {
            this.onRefreshPage();
        },

        /**
         * 监听--用户状态发生改变
         */
        watch: {
            isLogin: {
                handler(newVal, oldVal) {
                    newVal && this.onRefreshPage()
                }
            }
        },

        /**
         * 分享
         */
        onShareAppMessage(res) {
            return {
                title: '看看这个小程序多好玩～',
            };
        },
        
        methods: {

            /**
             * 刷新页面
             */
            onRefreshPage() {
                // 获取页面数据
                this.getPageData();
            },
            
            /**
             * 获取当前用户信息
             */
            getUserInfo() {
                return new Promise((resolve, reject) => {
                    console.log('qqqq', this.isLogin)
                    !this.isLogin ? resolve(null) : UserApi.getUserInfo({}, { load: this.isFirstload })
                    .then(result => {
                        console.log('result', result)
                        this.userInfo = result.data.qskInfo
                        resolve(this.userInfo)
                    })
                    .catch(err => {
                        reject(err)
                    })
                })
            },

            /**
             * 获取页面数据
             */
            getPageData(callback) {
                this.isLoading = true
                this.getUserInfo()
                .then(() => {
                    this.isFirstload = false
                    callback && callback()
                })
                .catch(err => console.log('catch', err))
                .finally(() => this.isLoading = false)
            },

            /**
             * 去用户信息页面
             */
            toInfoView() {
                console.log(111)
                uni.navigateTo({
					url: '/pages/user/userdetail'
				})
            },

            /**
             * 去关于我们
             */
            toAboutOut() {
                uni.navigateTo({
					url: '/pages/user/about'
				})
            },

            /**
             * 技术支持
             */
            callPhoneNumber() {
                uni.makePhoneCall({
					phoneNumber: "13111182031",
				});
            },

            /**
             * 跳转登录页面--进行登录
             */
            handleLogin() {
                !this.isLogin && this.$navTo('pages/login/index')
            },

            /**
             * 退出登录
             */
            handleLogout() {
                const that = this
                uni.showModal({
                    title: '友情提示',
                    content: '您确定要退出登录吗?',
                    success(res) {
                        if (res.confirm) {
                            store.dispatch('users/logout', {})
                            .then(() => {
                                that.$emit('update:is-login', checkLogin())
                                that.$nextTick(() => {
                                    that.onRefreshPage()
                                })
                            })
                        }
                    }
                })
            }
        },

        /**
         * 下拉刷新
         */
        onPullDownRefresh() {
            this.getPageData(() => {
                uni.stopPullDownRefresh()
            })
        }
	}
</script>

<style lang="scss">
	@import "@/styles/tools/index.scss";
    @import "@/styles/settings/var.scss";

	@include b(my-info-bg) {
        position: relative;
		background: $background-color-secondary;  // 1
		background-size: 100% 100%;
		height: 550rpx;
        @include box-center($justify:center, $align: center);
		overflow: hidden;  // 
		color: $color-text-tertiary;   //
		font-weight: 300; 
		text-shadow: 0 0 3px $color-transparent-black;   

        @include e(nologin) {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        @include e(nologin-text) {
            margin-top: 28rpx;
            color: #333;
            font-size: 36rpx;
            font-weight: 700;
        }
		
		@include e(img) {
			position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            z-index: 99;
            mix-blend-mode: screen;
            height: 100rpx;
		}
	}

    @include b(my-info-student) {
        /* padding: 30upx; */
        display: flex;
        text-align: center;
        color: #8799a3;
        background-color: $background-color-secondary;
        position: relative;
        box-shadow: 0 10rpx 10rpx $color-transparent-black;

        @include e(item) {
            @include grid($flex-direction: column);
            flex: 1;
        }
    }

    @include b(my-info-tool) {
        margin: 30rpx 30rpx 20rpx 30rpx;
        border-radius: 20rpx;
        box-shadow: 0rpx 0rpx 90rpx 0rpx $color-transparent-black;
        color: $color-text-secondary;
        overflow: hidden;
    }
    @include b(my-info-tool-item) {
        position: relative;
        @include box-center($justify: space-between);
        min-height: 100upx;
        background-color: $background-color-secondary;

        @include e(btn) {
            width: 100%;
            @include box-center($justify:flex-start, $align: center);
            font-size: 28rpx;
            height: 64rpx;
            line-height: 1;
            text-align: center;
            padding: 0;
        }
        @include e(img) {
            width: 1.6em;
            height: 1.6em;
        }
    }

    .my-info-tool .my-info-tool-item:after {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: 200%;
        height: 200%;
        border-bottom: 1upx solid $background-color-primary;
        border-radius: inherit;
        content: " ";
        transform: scale(.5);
        transform-origin: 0 0;
        pointer-events: none
    }
    .solid-right {
        border-right: 1rpx solid rgba(0, 0, 0, .1);
    }


    .text-blue {
        color: #0081ff;
    }


    .text-orange {
        color: #f37b1d;
    }


    .text-red {
        color: #e54d42;
    }
</style>
