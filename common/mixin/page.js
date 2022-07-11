import BottomView from '@/components/BottomView';
import { checkLogin } from '@/utils/app';
export default {
    components: {
        BottomView
    },
    data() {
        return {
            // 是否已经登录
            isLogin: false
        }
    },
    /**
     * 初始化
     */
    created() {
        this.isLogin = checkLogin()
    }
}