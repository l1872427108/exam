<script>
    import Vue from 'vue'
    import storage from '@/utils/storage'
    import store from '@/store'
    import { SET_TOKEN } from '@/store/mutation-types'
	export default {
		onLaunch: function() {

            this.Initializer()

            this.updateManager()

            this.getSysmtenInfo()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
        methods: {
            /**
             * Vuex状态持久化
             */
            Initializer() {
                store.commit(`users/${SET_TOKEN}`, storage.get('AccessToken'))
            },

            /**
             * 小程序更新
             */
            updateManager() {
                const updateManager = uni.getUpdateManager();
                updateManager.onCheckForUpdate(res => {
                    // 请求完新版本信息的回调
                    // console.log(res.hasUpdate)
                })
                updateManager.onUpdateReady(() => {
                    uni.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，即将重启应用',
                        showCancel: false,
                        success(res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                        }
                    })
                })
                updateManager.onUpdateFailed(() => {
                    // 新的版本下载失败
                    uni.showModal({
                        title: '更新提示',
                        content: '新版本下载失败',
                        showCancel: false
                    })
                })
            },

            /**
             * 获取系统信息
             */
            getSysmtenInfo() {
                uni.getSystemInfo({
                    success: function(e) {
                        // #ifdef MP-WEIXIN
                        Vue.prototype.StatusBar = e.statusBarHeight;
                        let custom = wx.getMenuButtonBoundingClientRect();
                        Vue.prototype.Custom = custom;
                        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight + 4;
                        // #endif	
                    }
			    });
            }
        }
	}
</script>

<style lang="scss">
	/* ACSS */
	@import "@/styles/index.scss";
    /* 动画 */
    @import "@/styles/animation.scss";
    /* 基础样式 */
    @import "@/styles/app.scss";
    /* #ifndef APP-PLUS-NVUE */
    @import "@/styles/iconfont.scss";
    /* #endif */
</style>
