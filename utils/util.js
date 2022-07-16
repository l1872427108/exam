import {isNumber} from './validate'
/**
 * 对象转URL
 * @param {object} obj
 */
export const urlEncode = (obj = {}) => {
    const result = []
    for (const key in obj) {
      const item = obj[key]
      if (!item) {
        continue
      }
      if (isArray(item)) {
        item.forEach(val => {
          result.push(key + '=' + val)
        })
      } else {
        result.push(key + '=' + item)
      }
    }
    return result.join('&')
}



/**
 * 判断是否为空
 * @param {*} object 源对象
 */
export const isEmpty = (value) => {
    if (isArray(value)) {
      return value.length === 0
    }
    if (isObject(value)) {
      return isEmptyObject(value)
    }
    return !value
}

/**
 * 判断是否为对象
 * @param {*} object
 */
export const isObject = (object) => {
    return Object.prototype.toString.call(object) === '[object Object]'
}
  
/**
 * 判断是否为数组
 * @param {*} array
 */
export const isArray = (array) => {
    return Object.prototype.toString.call(array) === '[object Array]'
}


/**
 * 判断是否为空对象
 * @param {*} object 源对象
 */
export const isEmptyObject = (object) => {
    return Object.keys(object).length === 0
}


/**
 * 添加单位
 */

export const addUnit = (value = 'auto', unit = 'rpx') => {
    value = String(value);
    return isNumber(value) ? `${value}${unit}` : value;
}


/**
 * 补全时间
 */
export const addPreZero = (num) => {
    var s = "";
    if(num<10){
        s = '0'
    }
    return s+num;
}

export function throttle(func, wait = 500, immediate = true) {
    let timer, flag;
	if (immediate) {
		if (!flag) {
			flag = true;
			// 如果是立即执行，则在wait毫秒内开始时执行
			typeof func === 'function' && func();
			timer = setTimeout(() => {
				flag = false;
			}, wait);
		}
	} else {
		if (!flag) {
			flag = true
			// 如果是非立即执行，则在wait毫秒内的结束处执行
			timer = setTimeout(() => {
				flag = false
				typeof func === 'function' && func();
			}, wait);
		}
		
	}
};