<!-- 蓝色登录页面2 -->
<template>
	<view style="height:100vh;" class="bg-secondary">
        <!-- 头部 -->
		<view class="login-title">
			<view class="login-title__text fz40">
				您好，欢迎使用轻松考
			</view>
		</view>

        <!-- 登录 -->
		<view v-if="reverse == 1" class="login-view">
			<view class="login-view-form fz30">
                <view class="login-view-form__item border-bottom">
                    <input class="login-view-form__inp" type="number" name="phone" placeholder="请输入您的手机号" maxlength="11" v-model="loginData.mobile" />
                </view>
                <view class="login-view-form__item border-bottom">
                    <input class="login-view-form__inp" type="password" name="code" maxlength="18" placeholder="请输入您的密码" v-model="loginData.password" />
                </view>
			</view>
		</view>


        <!-- 注册 -->
        <view v-if="reverse == 2" class="login-view">
			<view class="login-view-form fz30">
                <view class="login-view-form__item border-bottom">
                    <input class="login-view-form__inp" name="nickname" placeholder="请输入1-10位的中文姓名" maxlength="11" v-model="registerData.nickname" />
                </view>
                <view class="login-view-form__item border-bottom">
                    <input class="login-view-form__inp" type="password" name="password" placeholder="6位以上密码,必须同时包含数字、英文字母" v-model="registerData.password" />
                </view>
                <view class="login-view-form__item border-bottom">
                    <input class="login-view-form__inp" type="password" name="rePassword" placeholder="再次确认密码" v-model="registerData.rePassword" />
                </view>
                <view class="login-view-form__item border-bottom">
                    <input class="login-view-form__inp" type="number" name="mobile" placeholder="请输入您的手机号" maxlength="11" v-model="registerData.mobile" />
                </view>
                <view class="login-view-form__item border-bottom">
                    <input class="login-view-form__inp" type="number" name="code" maxlength="4" placeholder="验证码" v-model="registerData.code" />
                    <text @click="handelSmsCaptcha()" v-if="!smsState" class="login-view-form__code">获取验证码</text>
                    <text v-else class="login-view-form__code">重新发送({{ times }})秒</text>
                </view>
			</view>
		</view>
        <view :class="[reverse === 1 ? 'reverse-1' : '']">
            <SumitButton @click="$debounce(handleLogin, 500, true)" :content="reverse === 1 ? '登 录' : '去 登 录'"></SumitButton>
            <SumitButton @click="$debounce(handleReg, 500, true)" :content="reverse === 1 ? '去 注 册' : '注册'"></SumitButton>
        </view>
	</view>
</template>
<script>
import store from '@/store'
import * as Validate from '@/utils/validate'
import * as UserApi from '@/api/user'
import SumitButton from '../../components/SumitButton'

// 倒计时时长(秒)
const times = 60

// 表单验证场景
const LOGIN_STATUS = 1
const REG_STATUS = 2

export default {

    components: {
        SumitButton
    },
    
	data() {
		return {
            // 加载中
            isLoading: false,
            // 登录表单数据
            loginData: {
                mobile: '', //手机号码
			    password: '' //密码
            },
            // 注册表单数据
            registerData: {
                code: '',
                mobile: '',
                nickname: '',
                password: '',
                // 二次验证密码
                rePassword: ''
            },
            // 旋转 1 登录， 2 注册
            reverse: 1,
            // 高亮当前标签名
            tab: 1,
            // 短信验证码发送状态
            smsState: false,
            // 倒计时
            times,
		};
	},
	onLoad() {},
	methods: {
        /**
         * 验证手机号
         */
        validteMobile(str) {
            if (Validate.isEmpty(str)) {
                this.$toast('请先输入手机号')
                return false
            }
            console.log(Validate.isMobile(str))
            if (!Validate.isMobile(str)) {
                this.$toast('请输入正确格式的手机号')
                return false
            }
            return true;
        },
        /**
         * 验证密码
         */
        validtePassword(str) {
            if (Validate.isEmpty(str)) {
                this.$toast('请先输入密码')
                return false
            }
            return true;
        },
		/**
         * 点击登录
         */
		handleLogin() {
            if (this.reverse !== 1) {
                this.reverse = 1;
                return;
            }
            if (!this.isLoading && this.formValidation(LOGIN_STATUS)) {
                this.submitLogin()
            }
		},
        /**
         * 确认登陆
         */
        submitLogin() {
            this.isLoading = true
            store.dispatch('users/login', this.loginData).then(res => {
                this.$toast('登录成功')
                // 跳转回首页
                setTimeout(() => {
                    this.onNavigateBack(1)
                    // this.$navTo('/pages/tabBar/index')
                }, 2000)
            })
            .finally(() => this.isLoading = false)
        },
        /**
         * 跳转回首页
         */
        onNavigateBack(delta = 1) {
            const pages = getCurrentPages()
            if (pages.length > 1) {
                uni.navigateBack({
                    delta: Number(delta || 1)
                })
            } else {
                this.$navTo('pages/index/tabBar')
            }
            
        },
		//注册按钮点击
		handleReg() {
            if (this.reverse !== 2) {
                this.reverse = 2;
                return;
            }
            if (!this.isLoading && this.formRegValidation()) {
                this.submitReg()
            }
        },

        formRegValidation() {
            if (!Validate.isUsername(this.registerData.nickname)) {
                this.$toast('请输入您的中文姓名')
                return false
            }
            if (!Validate.isPassword(this.registerData.password)) {
                this.$toast('请输入6位以上密码,必须同时包含数字、英文字母,不少于6位')
                return false
            }
            if (this.registerData.password !== this.registerData.rePassword) {
                this.$toast('两次输入密码不一致')
                return false
            }
            if (!Validate.isMobile(this.registerData.mobile)) {
                this.$toast('请输入正确的11位手机号')
                return false
            }
            if (!Validate.isNoteCode(this.registerData.code)) {
                this.$toast('请输入4位验证码')
                return false
            }

            return true;
        },
        submitReg() {
            this.isLoading = true
            delete this.registerData.rePassword
            UserApi.register(this.registerData).then(res => {
                this.$toast('注册成功')
                // 回登录
                setTimeout(() => {
                    this.reverse = 1;
                }, 2000)
            })
            .finally(() => this.isLoading = false)
        },

        /**
         * 发送短信验证码
         */
        handelSmsCaptcha() {
            if (!this.isLoading && !this.smsState && this.formValidation(REG_STATUS)) {
                this.sendSms()
            }
        },

        /**
         * 发送短信接口
         */
        sendSms() {
            this.isLoading = true;
            UserApi.sendCode(this.registerData.mobile)
            .then(result => {
                console.log(result);
                this.$toast('请注意查收短信');
                // 执行定时器
                this.timer();
            })
            .finally(() => this.isLoading = false)
        },

        /**
         * 执行定时器
         */
        timer() {
            this.smsState = true
            const inter = setInterval(() => {
                this.times = this.times - 1;
                if (this.times <= 0) {
                    this.smsState = false
                    this.times = times
                    clearInterval(inter)
                }
            }, 1000)
        },

        /**
         * 表单验证
         */
        formValidation(status = REG_STATUS) {
            if (status === REG_STATUS) {
                if (!this.validteMobile(this.registerData.mobile)) {
                    return false;
                }
            }

            if (status === LOGIN_STATUS) {
                if (!this.validteMobile(this.loginData.mobile) || !this.validtePassword(this.loginData.password)) {
                    return false;
                }
            }

            return true;
        },
	}
};
</script>
<style lang="scss">
@import "@/styles/tools/index.scss";
@import "@/styles/settings/var.scss";

@include b(login-title) {
	height: 430rpx;
	background-image: url(https://zhoukaiwen.com/img/loginImg/head.png);
	background-size: 100%;

    @include e(text) {
        text-align: left;
        padding: 130rpx 0 0 70rpx;
        font-weight: bold;
        line-height: 70rpx;
    }
}

@include b(login-view) {
	/* position: relative; */
	margin-top: -120rpx;
	background-color: $background-color-secondary;  // bg-secondary
	border-radius: 8% 8% 0% 0;
}

@include b(login-view-form) {
    width: 600rpx;
	margin: 0 auto;
	padding-top: 80rpx;

    @include e(item) {
        /* font-size: 42rpx; */  // fz40
        display: flex;
        color: #000000;   // color-
        font-weight: bold;
        line-height: 120rpx;
        flex-wrap: nowrap;
        /* border-bottom: 1px solid #e9e9e9; */  // border-bottom
    }

    @include e(text) {
        /* font-size: 32rpx;  // f */
        /* font-weight: bold; */
        /* color: $color-text-secondary; */
        /* color: #000000; */
    }

    @include e(reg) {
        /* background: #f5f6fa; */
        /* color: #000000; */
        /* text-align: center; */
    }

    @include e(inp) {
        height: 120rpx;
        line-height: 120rpx;
        /* font-size: 28rpx; */
        width: 100%;
    }

    @include e(code) {
        /* font-size: 25rpx; */
        /* padding-right: 20rpx; */
        min-width: 220rpx;
        /* flex: 1; */
    }
}




</style>
