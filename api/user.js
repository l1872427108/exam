import request from '@/utils/request'

const api = {
    register: '/api/puge/register',
    login: '/api/puge/login',
    info: '/puge',
    update: '/exam/users',
    code: '/api/msm/send'
}

/**
 * 用户登录(手机号+验证码)
 */
export function login(data) {
    return request.post(api.login, data);
}

/**
 * 用户注册
 */
export function register(data) {
    return request.post(api.register, data)
}

/**
 * 手机号
 */
export function sendCode(phone) {
    return request.get(`${api.code}/${phone}`)
}

/**
 * 获取用户信息
 */
export function getUserInfo(param, option) {
    const options = {
        isPrompt: false,
        load: false,
        ...option
    }
    return request.get(api.info, param, options);
}


/**
 * 修改用户信息
 */
export function updateUserInfo(data) {
    return request.put(api.update, data);
}


