<template>
	<view class="box-skin bg-secondary"
	:class="type ? 'box-skin--' + type : ''">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'BoxSkin',
		/**
		 * 组件的属性列表
		 * 用于组件自定义设置
		 */
		props: {
		    type: {
		      default: '',
		      required: false,
		      validator: function(value) {
		        return ['', 'top', 'bottom'].indexOf(value) !== -1
		      }
		    }
		}
	}
</script>

<style lang="scss" scoped>
@import "@/styles/tools/index.scss";
@import "@/styles/settings/var.scss";
@include b(box-skin) {
  @include m(top) {
    border-top: $border-base;
  }
  @include m(bottom) {
    border-bottom: $border-base;
  }
}
</style>
