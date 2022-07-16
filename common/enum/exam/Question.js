import Enum from '../index';


/**
 * tabber列表
 */

export default new Enum([
    {
        name: '【单选题】',
        type: '0'
    },
    {
        name: '【多选题】',
        type: '1'
    },
    {
        name: '【判断题】',
        type: '2'
    },
    {
        name: '【填空题】',
        type: '3'
    },
    {
        name: '【问答题】',
        type: '4'
    }
])