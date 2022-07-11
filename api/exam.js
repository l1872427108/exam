import request from '@/utils/request'

const api = {
    exam: '/exam/exam-paper/getAllExamPaperbyuid',
    answer: '/exam/exam-paper-answer/selectAllExamPaperAnswer',
    paper: '/exam/exam-paper/getOneExamPaper',
    submit: '/exam/exam-paper-answer/saveExamPaperAnswer',
    recode: '/exam/exam-paper-answer/getExamPaperUserAnswer/'
}

/**
 * 获取所有考卷
 */
export function getAllExamInfo() {
    return request.get(api.exam);
}


/**
 * 查询考试记录
 */
export function selectAllExamPaperAnswer() {
    return request.get(api.answer);
}


/**
 * 开始答题，根据试卷id查询试卷详情
 */
export function getOneExamPaper(param) {
    return request.get(api.paper, param);
}

/**
 * 提交试卷
 */
export function subimtExamAnswer(data) {
    return request.post(api.submit, data);
}


/**
 * 查看考试记录
 */
export function getExamPaperUserAnswer(id) {
    return request.get(`${api.recode}/${id}`)
}