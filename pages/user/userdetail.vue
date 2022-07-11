<template>
	<view v-if="isLogin" :class="[isLogin ? '' : 'bg']">
    <!-- 自定义头部 -->
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">用户详情</block>
    </cu-custom>

    <!-- list列表 -->
    <view class="user-detail">
        <!-- <view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.1s'}]">
            <view class="content">
                <text class="text-grey">头像</text>
            </view>
            <view class="action">
                <avatar-image :width="50" />
            </view>
        
        </view> -->
        
        <user-detail-item title="姓名" :info="userInfo.userName" />

        <user-detail-item title="性别" :info="userInfo.sex" />
        
        <user-detail-item title="年龄" :info="userInfo.age" />

        <user-detail-item title="班级" :info="userInfo.userClass" />
        
        <user-detail-item title="学号" :info="userInfo.userNum" />
        
        <user-detail-item title="邮箱" :info="userInfo.userEmail" />

        <user-detail-item title="手机号" :info="userInfo.userPhone" />
    </view>
    
    <!-- 编辑按钮 -->
    <submit-button @click="toEidtInfo" content="编辑"></submit-button>
			
	</view>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';
    import * as UserApi from '@/api/user'
    import { checkLogin } from '@/utils/app';
    import UserDetailItem from './components/UserDetailItem'
    import SubmitButton from '@/components/SumitButton';
	export default {
        components: {
            AvatarImage,
            UserDetailItem,
            SubmitButton
        },
		data() {
			return {
                // 当前用户信息
                userInfo: {},
                // 是否已登录
                isLogin: false
			};
		},

        /**
         * 
         */
        onShow() {
            // 是否已经登录
            this.isLogin = checkLogin();
            // 获取用户信息
            this.getUserInfo()
        },

        methods: {
            /**
             * 去编辑
             */
            toEidtInfo() {
                uni.navigateTo({
					url: '/pages/user/useredit'
				})
            },
            
            /**
             * 获取用户信息
             */
            getUserInfo() {
                UserApi.getUserInfo({})
                .then(result => {
                    this.userInfo = result.data.qskInfo
                })
            }
        }
	}
</script>

<style lang="scss">
.user-detail {
    position: relative;
	/* display: flex; */
	padding: 0 30upx;
	/* min-height: 100upx; */
	background-color: #ffffff;
	/* justify-content: space-between;
	align-items: center */
}

.user-detail__item {
    transition: all .6s ease-in-out 0s;
	transform: translateX(0upx);
    position: relative;
	display: flex;
	padding: 0 30upx;
	min-height: 100upx;
	background-color: #ffffff;
	justify-content: space-between;
	align-items: center;
}

.user-detail__item:after {
    position: absolute;
	top: 0;
	left: 0;
	box-sizing: border-box;
	width: 200%;
	height: 200%;
	border-bottom: 1upx solid #ddd;
	border-radius: inherit;
	content: " ";
	transform: scale(.5);
	transform-origin: 0 0;
	pointer-events: none;

}


.user-detail__btn {
    width: 90%;
    height: 80rpx;
    border-radius: 100rpx;
    text-align: center;
    line-height: 80rpx;
    color: #fffafe;
    font-size: 28rpx;
    box-shadow: 2rpx 2rpx 2rpx #efeef3;
    margin: 100rpx auto;
}


.bg-gradual-blue {
	background-image: linear-gradient(45deg, #0081ff, #1cbbb4);
	color: #ffffff;
}

.bg {
    background-color: rgba(0, 0, 0, .2);
}
</style>
