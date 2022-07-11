<template>
    <!-- 关于作者 -->   
  <view class="about">
	<view class="titleZ text-center align-center">
		<text class="text-bold">关于我们</text>
		<view class="contentZ">
			<text class="text-xl">普歌</text>
		</view>
	</view>
	
	<view class="titleZ text-center align-center margin-top-xl">
		<text class="text-bold">合作</text>
		<view class="contentZ margin-top-lg">
			<image style="width: 300rpx;height: 300rpx" src="/static/ASCElogo.png" />
            <image style="width: 300rpx;height: 300rpx" src="/static/pugelogo.png" />
		</view>
	</view>
    
    <view class="titleZ text-center align-center">
		<text class="text-bold">联系我们</text>
		<view class="contentZ">
			<text class="text-xl">普歌</text>
		</view>
	</view>
	
  </view>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    onLoad() {
    },
    methods: {
      
    }
  }
</script>

<style scoped>

  .about {
    margin: 0;
    width: 100%;
    height: 100vh;
	padding-top: 20%;
    color: #fff;
    background: linear-gradient(-120deg, #F15BB5, #9A5CE5, #01BEFF, #00F5D4);
    /* background: linear-gradient(-120deg, #0976ea, #c471f5, #f956b6, #ea7e0a); */
    background-size: 500% 500%;
    animation: gradientBG 15s ease infinite;
  }

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

    .text-center {
	text-align: center;
}


.align-center {
	align-items: center;
}
.text-bold {
	font-weight: bold;
}

.text-xl {
	font-size: 36upx;
}
.margin-top-xl {
	margin-top: 50upx;
}

  .titleZ{
		width: 750rpx;
		font-size: 52rpx;
		margin-top: 60rpx;
	}
	.contentZ{
		width: 650rpx;
		margin: 10rpx auto 0;
		text-align: left;
	}
  .about-bg {
    background-size: cover;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    flex-direction: column;
    color: #fff;
  }

  .edit-fixed {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 1024;
    box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.1);
  }

  .detail-imgs image {
    width: 100%;
    float: left;
    /* height:400rpx; 不定高了*/
    border: 0;
    padding: 0;
    margin: 0
  }

  .share-img {
    position: fixed;
    padding: 10rpx;
    width: 100rpx;
    height: 100rpx;
    /* top: 680rpx; */
    bottom: 200rpx;
    right: 20rpx;
    z-index: 1024;
    opacity: 0.8;
    box-shadow: 0rpx 8rpx 30rpx 0rpx rgba(0, 0, 0, 0.3);
    border: none;
  }

  .container {
    width: 100%;
    position: absolute;
    text-align: center;
  }

  .like-fx {
    position: fixed;
    right: 0;
    z-index: 1024;
    pointer-events: none;
    /* background-color: red; */
  }
</style>
