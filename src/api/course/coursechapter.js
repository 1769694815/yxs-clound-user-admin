import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/course/coursechapter/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/course/coursechapter',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/course/coursechapter/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/course/coursechapter/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/course/coursechapter',
        method: 'put',
        data: obj
    })
}
