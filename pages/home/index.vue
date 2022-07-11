<template>
  <view>
        <scroll-view>
            <swiper class="home-screen-swiper square-dot"  :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500" :style="[{animation: 'show 0.2s 1'}]">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image class="home-screen-swiper__image" :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
				</swiper-item>
			</swiper>
        </scroll-view>
        <div class="bg-tertiary" style="width: 200rpx; height: 200rpx;"></div>
        <!-- 底部撑开块 -->
        <bottom-view></bottom-view>
  </view>
</template>

<script>
import {Home} from '../../common/enum/home'
export default {
    props: {
        isLogin: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            swiperList: Home.data
        }
    },
    created() {
        Object.freeze(this.swiperList)
    }
}
</script>

<style lang="scss">
@import "@/styles/tools/index.scss";
@include b(home-screen-swiper) {
    min-height: 375rpx;

    @include e(image) {
        @include dimensions(100%, 100%);
        display: block;
        pointer-events: none;
    }
}

</style>
