import Enum from '../index';


/**
 * tabber列表
 */

export default new Enum([
    {
        name: '首页',
        cur: 'index',
        curImg: '/static/tabBar/index_cur.png',
        img: '/static/tabBar/index.png',
    },
    {
        name: '考试中心',
        cur: 'cases',
        curImg: '/static/tabBar/order_cur.png',
        img: '/static/tabBar/order.png',
    },
    {
        name: '个人中心',
        cur: 'me',
        curImg: '/static/tabBar/me_cur.png',
        img: '/static/tabBar/me.png',
    }
])