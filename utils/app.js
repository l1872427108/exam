import store from '@/store'
import * as util from '@/utils/util'

/**
 * 验证是否已登录
 */
export const checkLogin = () => {
    console.log('store.getters.token', store.getters.token)
    return !!store.getters.token
}


/**
 * 显示成功的提示框
 */
export const showSuccess = (msg, callback) => {
    uni.showToast({
        title: msg,
        icon: 'success',
        mask: true,
        duration: 1500,
        success() {
          callback && callback()
        }
    })
}


/**
 * 显示失败提示框
 */
 export const showError = (msg, callback) => {
    uni.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback()
      }
    })
}

/**
 * 显示纯文字提示框
 */
export const showToast = msg => {
    uni.showToast({
      title: msg,
      icon: 'none'
    })
}



/**
 * 跳转到指定页面url
 */
export const navTo = (url, query = {}, modo = 'navigateTo') => {
    if (!url || url.length == 0) {
      return false
    }
    // 生成query参数
    const queryStr = !util.isEmpty(query) ? '?' + util.urlEncode(query) : ''
    // 普通页面, 使用navigateTo
    modo === 'navigateTo' && uni.navigateTo({
      url: `/${url}${queryStr}`
    })
    // 特殊指定, 使用redirectTo
    modo === 'redirectTo' && uni.redirectTo({
      url: `/${url}${queryStr}`
    })
    return true
}

