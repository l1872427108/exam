<template>
    <!-- tabbar子项 -->
	<view class="tabbar-box-wrap fixed pa0">
		<view v-for="(item, index) in tabbarData" class="tabbar-box-wrap__item fz22" :key="index" @click="handleChange" :data-cur="item.cur">
			<view class='tabbar-box-wrap__item fz36'>
                <view v-if="isLogin && index == tabbarData.length - 1" class="tabbar-box-wrap__badge"></view>
				<image class="tabbar-box-wrap__image" v-if="pageCur == item.cur" :src="item.curImg"></image>
				<image class="tabbar-box-wrap__image" v-if="pageCur != item.cur" :src="item.img"></image>
			</view>
			<view :class="pageCur == item.cur ? 'tabbar-box-wrap__item--main':'tabbar-box-wrap__item--gray'">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
// import Page from '@/common/mixin/page';
export default {
    props: {
        tabbarData: {
            type: Array,
            default: () => []
        },
        pageCur: {
            type: String,
            default: ''
        },
        isLogin: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleChange(e) {
            this.$emit('cur', e.currentTarget.dataset.cur);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/tools/index.scss";
@import "@/styles/settings/var.scss";
@include b(tabbar-box-wrap) {
    @include box-center($justify: space-between);
	min-height: 100rpx;
	bottom: 0;
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
	padding-bottom: calc(env(safe-area-inset-bottom) / 2);
    box-shadow: 0 2rpx 7rpx $color-transparent-black;
    background-color: #fff;

    @include e(item) {
        @include box-center($justify:center, $align: center);
        max-width: 100%;
        flex: 1;
        text-align: center;
        display: block;
        line-height: 1;
    }

    @include e(item) {

        position: relative;

        @include m(main) {
            color: $color-black;
		    font-weight: 900;
        }

        @include m(gray) {
            color: #aaaaaa;
        }
    }

    @include e(image) {
        @include dimensions(50rpx, 50rpx);
    }


    @include e(badge) {
        border-radius: 200rpx;
        position: absolute;
        right: 20%;
        font-size: 20rpx;
        padding: 0rpx 10rpx;
        height: 20rpx;
        color: #ffffff;
        background-color: #dd514c;
    }   
}

</style>