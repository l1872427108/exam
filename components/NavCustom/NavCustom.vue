<template>
	<view>
		<view class="nav-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="nav-custom-bar fixed" :style="style" :class="[bgImage!=''?'nav-custom-bar--bg':'',bgColor]">
				<view class="nav-custom-bar__left" @tap="backPage" v-if="isBack">
					<slot name="backText"></slot>
				</view>
				<view class="nav-custom-bar__content ">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'nav-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
            to: {
                type: String,
                default: ''
            }
		},
		methods: {
			backPage() {
                if (!this.to) {
                    this.$eventBus.$emit('back')
                    uni.navigateBack({
                        delta: 1
                    });
                } else {
                    this.$navTo(this.to, {}, 'redirectTo')
                }
			}
		}
	}
</script>

<style lang="scss">
.nav-custom {
    display: block;
	position: relative;
}

.nav-custom-bar {
    min-height: 0px;
	/* #ifdef MP-WEIXIN */
	padding-right: 220upx;
	/* #endif */
	box-shadow: 0upx 0upx 0upx;
	z-index: 9999;

    .nav-custom-bar__left {
        line-height: 60rpx;
        height: 60upx;
	    font-size: 32upx;
        margin-left: 20rpx;
    }
}

.nav-custom-bar--bg {
    color: #ffffff;
    /* background-size: cover;
	background-position: center;
	background-repeat: no-repeat; */
}


.nav-custom-bar__content {
    width: calc(100% - 440rpx);
    position: absolute;
	text-align: center;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	margin: auto;
	height: 60upx;
	font-size: 32upx;
	line-height: 60upx;
	cursor: none;
	pointer-events: none;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.nav-custom-bar__content image {
    height: 60rpx;
	width: 240rpx;
}



.bg-gradual-blue {
	background-color: #0076fb;
	color: #ffffff;
}

</style>
