import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/question/question/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/question/question',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/question/question/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/question/question/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/question/question',
        method: 'put',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: obj
    })
}

export function getCourseList() {
    return request({
        url: '/course/course/getCourseAll',
        method: 'get'
    })
}

export function getLessonList(courseId) {
    return request({
        url: '/course/courselesson/getCourseLessonByCourseId?courseId=' + courseId,
        method: 'get'
    })
}

export function getAllQuestion() {
    return request({
        url: '/question/questiontype/getAllQuestion',
        method: 'get'
    })
}
