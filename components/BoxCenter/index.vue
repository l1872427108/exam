<template>
	<view class="box-center font-tertiary">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'BoxCenter'
	}
</script>

<style lang="scss" scoped>
@import "@/styles/tools/index.scss";
@include b(box-center) {
	@include box-center;
}
</style>
