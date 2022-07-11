<template>
    <scroll-view class="exam-nav" scroll-x  scroll-with-animation :scroll-left="scrollLeft">
        <view class="exam-nav__item mh10 ph20" 
            v-for="(item,index) in tabList"
            :class="index == tabCur?'exam-nav__item--active':''"
            :key="index"
            @tap="tabSelect"
            :style="[{ animation: 'show ' + ((index + 1) * 0.2 + 1) + 's 1' }]"
            :data-id="index">
            {{item.title}}
        </view>
    </scroll-view>
</template>

<script>
export default {
    props: {
        tabList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            // tab选项索引
            tabCur: 0,
            // 滑动距离
            scrollLeft: 0,
        }
    },
    methods: {
        /**
         * 切换tab选项
         */
        tabSelect(e) {
            let ne = e.currentTarget.dataset.id;
            this.tabCur = ne;
            this.scrollLeft = (ne - 1) * 60
            this.$emit('tabChange', this.tabCur);
        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/settings/var.scss";
@import "@/styles/tools/index.scss";
@include b(exam-nav) {
    background-color: $background-color-secondary;
    white-space: nowrap;
    @include e(item) {
        height: 90rpx;
        display: inline-block;
        line-height: 90rpx;
        @include m(active) {
            border-bottom: 4rpx $border-style-base $color-text-quaternary;
        }
    }
}
</style>