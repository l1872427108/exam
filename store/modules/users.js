import { SET_TOKEN, SET_USER_ID } from '@/store/mutation-types'
import * as LoginApi from '@/api/user'
import storage from '@/utils/storage';

/**
 * 登录成功后执行方法
 */
const loginSuccess = (commit, {token}) => {
    const expiryTime = 30 * 86400
    // storage.set('userId', userId, expiryTime)
    storage.set('AccessToken', token, expiryTime)
    commit(SET_TOKEN, token)
    // commit(SET_USER_ID, userId)
}
const state = {
    // 用户认证token
    token: '',
    // 用户ID
    userId: null
}

const mutations = {
  [SET_TOKEN]: (state, value) => {
      console.log('value=>', value)
    state.token = value
    console.log('token=>', state.token)
  },
  [SET_USER_ID]: (state, value) => {
    state.userId = value
  }
}

const actions = {
    /**
     * 用户登录
     * 手机号和密码
     */
    login({ commit }, data) {
        console.log(data);
        return new Promise((resolve, reject) => {
            LoginApi.login(data)
            .then(response => {
                console.log(response);
                const result = response.data;
                loginSuccess(commit, result);
                resolve(response);
            })
            .catch(reject);
        })
    },

    /**
     * 退出登录
     */
    logout({ commit }, data) {
        const store = this
        return new Promise((resolve, reject) => {
            if (store.getters.token) {}
            storage.remove('AccessToken')
            commit(SET_TOKEN, '')
            resolve()
        })
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
