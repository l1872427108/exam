<template>
    <button class="btn-box__button bg-gradual-blue"
        :disabled="btnLoading"
        :loading="btnLoading"
        @tap="handleClick">
        {{content}}
    </button>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            default: ''
        },
        btnLoading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e);
        }
    }
}
</script>

<style lang="scss">


.btn-box__button {
    width: 90%;
    height: 80rpx;
    border-radius: 100rpx;
    text-align: center;
    line-height: 80rpx;
    color: #fffafe;
    font-size: 28rpx;
    box-shadow: 2rpx 2rpx 2rpx #efeef3;
    margin: 100rpx auto;
}


.bg-gradual-blue {
	background-image: linear-gradient(45deg, #0081ff, #1cbbb4);
	color: #ffffff;
}
</style>