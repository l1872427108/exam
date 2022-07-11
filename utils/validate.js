

// 验证是否为空
export const isEmpty = (str) => {
    return str == '' || str == null;
}

/**
 * 匹配phone
 */
export const isMobile = (str) => {
    console.log(str);
    const reg = /^(1[3456789]\d{9})$/
    
    return reg.test(str)
}


 
/**
 * 判断数值类型，包括整数和浮点数
 */
export const isNumber = (str) => {
    if (isDouble(str) || isInteger(str)) return true
    return false
}


/**
 * 判断是否为正整数(只能输入数字[0-9])
 */
export const isPositiveInteger = (str) => {
    return /(^[0-9]\d*$)/.test(str)
}



/**
 * 匹配integer
 */
export const isInteger = (str) => {
    if (str == null || str == "") return false
    var result = str.match(/^[-\+]?\d+$/)
    if (result == null) return false
    return true
}
  
/**
 * 匹配double或float
 */
export const isDouble = (str) => {
    if (str == null || str == "") return false
    var result = str.match(/^[-\+]?\d+(\.\d+)?$/)
    if (result == null) return false
    return true
}
  

/**
 * 匹配用户名 只允许4-30位中文、数字
 */
export function isUsername(str) {
    const valid_map = /^[\u4e00-\u9fa5]{1,30}$/
    return valid_map.test(str)
}

/**
 * 匹配密码
 */
export function isPassword(str) {
    const valid = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
    return valid.test(str)
}


/**
 * 四位验证码
 */
export function isNoteCode(str) {
    const valid_map = /^\d{4}$/
    return valid_map.test(str)
}

/**
 * 匹配邮箱
 */
export function isEmail(str) {
    const valid_map = /^[A-Za-z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    return valid_map.test(str)
}
  