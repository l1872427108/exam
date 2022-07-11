<template>
	<view class="avatar-image">
		<image class="avatar-image__item circle"
			:style="{width: `${width}rpx`, height: `${width}rpx`, borderWidth: `${borderWidth}rpx`, borderColor: borderColor}"
			:src="url ? url : '/static/default-avatar.png'">
		</image>
	</view>
</template>

<script>
	export default {
		/**
		 * 组件的属性列表
		 * 用于组件自定义设置
		 */
		props: {
			url: {
				type: String,
				default: ''
			},
			width: {
				type: Number,
				default: 90
			},
			borderWidth: {
				type: Number,
				default: 0
			},
			borderColor: {
				type: String,
				default: '#000000'
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/tools/index.scss";
	@include b(avatar-image) {
		@include e(item) {
			display: block;
			@include dimensions(60rpx, 50rpx);
			border-style: solid;
		}
	}
</style>