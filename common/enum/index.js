/**
 * 枚举型
 */
class Enum {
    constructor(param) {

        if (!Array.isArray(param)) {
            throw new Error('param is not an array!')
        }

        this.data = param
        
        // 防止被修改
        Object.freeze(this)
    }

    getData() {
        return this.data
    }
}

export default Enum