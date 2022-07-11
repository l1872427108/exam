<template>
	<view class="single-center">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'SingleCenter'
	}
</script>

<style lang="scss" scoped>
@import "@/styles/tools/index.scss";
@include b(single-center) {
  @include grid($align-items: center);
}
</style>
