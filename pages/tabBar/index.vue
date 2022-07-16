<template>
	<view>
        <!-- tabbar组件 -->
		<home :is-login="isLogin" v-if="pageCur=='index'"></home>
		<exam :is-login="isLogin" v-if="pageCur=='cases'"></exam>
		<me :is-login.sync="isLogin" v-if="pageCur=='me'"></me>

        <!-- tabbar -->
        <bar-item :is-login="isLogin" @cur="navChange" :page-cur="pageCur" :tabbar-data="tabbarData" />
	
	
        <!-- 撑开块 -->
        <bottom-view></bottom-view>
	</view>
</template>

<script>
	import Home from "../home";	//首页
	import Exam from "../exam";	//考试
	import Me from "../user";	//个人中心
    import BarItem from './components/BarItem';
    import { TabBar } from '@/common/enum/tabbar.js';
    // import Page from '../../common/mixin/page';
    import {checkLogin} from '../../utils/app'
	export default {
		components: {
			Home,
			Exam,
			Me,
            BarItem
		},
        // mixins: [Page],
		data() {
			return {
                // 是否已经登录
                isLogin: false,
                // tabbar激活项
				pageCur: 'index',
                // tabbar选项数据
                tabbarData: TabBar.data
			};
		},

        onShow() {
            console.log('11111');
            this.isLogin = checkLogin()
        },

        /**
         * 监听页面加载---初始化数据
         */
        onload() {
            this.pageCur = 'index'
        },
		methods: {
            /**
             * 改变tabbar栏
             */
			navChange(cur) {
				this.pageCur = cur;

				if (this.pageCur == 'index') {
					// document.title = '首页'
				} else if (this.pageCur == 'cases') {
					// document.title = '宅家学'
				} else if (this.pageCur == 'me') {
					// document.title = '个人中心'
                }
			},
            // updateLogin(val){
            //     this.isLogin = val
            // }
		}
	}
</script>

<style lang="scss" scoped>

</style>
