<template>
	<view>
        <!-- 自定义头部 -->
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">编辑资料</block>
		</cu-custom>

		<!-- <u-line color="#dddddd"></u-line>

        <view class="margin-top cu-progress radius striped active">
            <view class="bg-blue" :style="[{ width: progress + '%' }]">{{  progress }}%</view>
        </view> -->

        <!-- form表单区域 -->
        <view class="user-edit">
            <view class="user-edit__item">
				<text class="user-edit__item-text">姓 名</text>
				<input
                    class="user-edit__item-inp"
					type="number"
					v-model="userInfo.userName"
					disabled
				/>
			</view>
			<view class="user-edit__item">
				<text class="user-edit__item-text">手机号</text>
				<input
                    class="user-edit__item-inp"
					type="number"
					v-model="userInfo.userPhone"
					disabled
				/>
			</view>
			<view class="user-edit__item">
				<text class="user-edit__item-text">性　别</text>
				<radio-group @change="handleGenderChange">
					<label
						class="ml20"
						v-for="(item, index) in genders"
						:key="index"
					>
						<radio
							color="#409EFF"
							:value="item.value"
							:checked="item.value === userInfo.sex"
						/>
						<text class="pl10">{{ item.name }}</text>
					</label>
				</radio-group>
			</view>
            <view class="user-edit__item">
				<text class="user-edit__item-text">班 级</text>
				<picker class="user-edit__item-class" @change="bindPickerChange" :value="schoolIndex" :range="schoolSection">
					<view class="uni-input">{{schoolSection[schoolIndex]}}</view>
				</picker>
			</view>
			<view class="user-edit__item">
				<text class="user-edit__item-text">生　日</text>
				<picker class="user-edit__item-class" mode="date" v-model="userInfo.age" @change="bindDateChange">
					<view class="user-edit__item-date" style="background: none;">{{
						userInfo.age || '请选择日期'
					}}</view>
				</picker>
			</view>
			<view class="user-edit__item">
				<text class="user-edit__item-text">邮　箱</text>
				<input class="user-edit__item-inp" v-model="userInfo.userEmail" placeholder="请输入您的邮箱" />
			</view>
            <view class="user-edit__item">
				<text class="user-edit__item-text">学 号</text>
				<input
                    class="user-edit__item-inp"
					type="number"
					v-model="userInfo.userNum"
                    placeholder="请输入您的学号"
				/>
			</view>


            <!-- 提交按钮 -->
            <submit-button :btn-loading="btnLoading" @click="$debounce(handleUpdateInfo, 500, true)" content="提交"></submit-button>
            
        </view>
		</form>
	</view>
</template>

<script>
import AvatarImage from '@/components/AvatarImage';
import SubmitButton from '@/components/SumitButton';
import School from '@/common/enum/user/School'
import Sex from '@/common/enum/user/Sex';
import * as Validate from '@/utils/validate'
    import * as UserApi from '@/api/user'
	export default {
        components: {
            AvatarImage,
            SubmitButton
        },

		data() {
			return {
                 // 当前用户信息
                userInfo: {},
                // 性别弹框
                // showModalSex: false,
                // loading: false,
                // progress: 50,
                // num: 0,
                genders: Sex.data,
                schoolIndex: 0,
                schoolSection: School.data,
                btnLoading: false
			};
		},

        /**
         * 监听页面展示--获取数据
         */
        onLoad() {
            this.getUserInfo()
        },

        watch: {
            // progress(val) {
            //     console.log(this.progress + '% - 进度');
            //     if (this.progress == 100) {
            //         this.noData = true;
            //         this.hasData = false;
            //         setTimeout(() => {
			// 			this.show = true;
			// 		}, 1300);
            //     }
            // }
        },

        methods: {
            /**
             * 获取用户信息
             */
            getUserInfo() {
                UserApi.getUserInfo({})
                .then(result => {
                    this.userInfo = result.data.qskInfo
                    this.schoolIndex = this.schoolSection.findIndex(item => item === this.userInfo.userClass);
                })
            },

            /**
             * 监听性别变化
             */
            handleGenderChange(e) {
                this.userInfo.sex = e.detail.value;
            },

            /**
             * 监听日期变化
             */
            bindDateChange(e) {
                this.userInfo.age = e.target.value;
            },

            /**
             * 点击更新用户信息按钮
             */
            handleUpdateInfo() {
                if (!this.btnLoading && this.formValidation()) {
                    this.submitInfo()
                }
            },

            /**
             * 更新用户信息
             */
            submitInfo() {
                this.btnLoading = true;
                UserApi.updateUserInfo(this.userInfo)
                .then(result => {
                    this.$success('资料修改成功')
                    setTimeout(() => {
                        uni.navigateBack({
                            delta: 1
                        });
                    }, 1000)
                })
                .catch(() => {
                    this.btnLoading = false
                })
                .finally(() => this.btnLoading = false)
            },

            /**
             * 表单验证
             */
            formValidation() {
                console.log(this.userInfo);
                if (Validate.isEmpty(this.userInfo.sex)) {
                    this.$toast('请选择性别');
                    return false;
                }
                if (Validate.isEmpty(this.userInfo.userClass)) {
                    this.$toast('请选择班级');
                    return false;
                }
                if (Validate.isEmpty(this.userInfo.age)) {
                    this.$toast('请选择生日');
                    return false;
                }
                if (Validate.isEmpty(this.userInfo.userEmail)) {
                    this.$toast('请输入邮箱');
                    return false;
                }
                if (!Validate.isEmail(this.userInfo.userEmail)) {
                    this.$toast('请输入正确的邮箱');
                    return false;
                }
                if (Validate.isEmpty(this.userInfo.userNum)) {
                    this.$toast('请输入学号');
                    return false;
                }
                return true;
            },

            bindPickerChange(e) {
                console.log("e:", e);
                this.schoolIndex = e.detail.value
                this.userInfo.userClass = this.schoolSection[e.detail.value]
            },
        }
	}
</script>

<style lang="scss">





/* ==================
         进度条
 ==================== */

.cu-progress {
	overflow: hidden;
	height: 28upx;
	background-color: #ebeef5;
	display: inline-flex;
	align-items: center;
	width: 100%;
}

.cu-progress+view,
.cu-progress+text {
	line-height: 1;
}

.cu-progress.xs {
	height: 10upx;
}

.cu-progress.sm {
	height: 20upx;
}

.cu-progress view {
	width: 0;
	height: 100%;
	align-items: center;
	display: flex;
	justify-items: flex-end;
	justify-content: space-around;
	font-size: 20upx;
	color: #ffffff;
	transition: width 0.6s ease;
}

.cu-progress text {
	align-items: center;
	display: flex;
	font-size: 20upx;
	color: #333333;
	text-indent: 10upx;
}

.cu-progress.text-progress {
	padding-right: 60upx;
}

.cu-progress.striped view {
	background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
	background-size: 72upx 72upx;
}

.cu-progress.active view {
	animation: progress-stripes 2s linear infinite;
}

@keyframes progress-stripes {
	from {
		background-position: 72upx 0;
	}

	to {
		background-position: 0 0;
	}
}

.bg-blue {
	background-color: #0081ff;
	color: #ffffff;
}


.user-edit {
    padding: 40rpx 60rpx;

    .user-edit__item {
        display: flex;
        padding: 0 30upx;
        background: #f8f6fc;
        height: 80upx;
        line-height: 80upx;
        border-radius: 4px;
        margin-bottom: 30upx;
    }

    .user-edit__item-class {
        width: 100%;
    }

    .user-edit__item-text {
        width: 100upx;
        font-size: 26upx;
        color: #606266;
    }

    .user-edit__item-inp {
        width: calc(100% - 100upx);
        height: 80upx;
        line-height: 80upx;
        font-size: 30upx;
        color: #303133;
    }


    .user-edit__item-date, .uni-input {
        height: 80upx;
        line-height: 80upx;
        font-size: 30upx;
        color: #303133;
    }
}


</style>
