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
    /* box-shadow: 2rpx 2rpx 2rpx #222224; */
    margin: 50rpx auto;
}


.bg-gradual-blue {
	background-color: #0076fb;
	color: #ffffff;
}
</style>