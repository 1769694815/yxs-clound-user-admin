import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/classroom/classroom/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/classroom/classroom',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/classroom/classroom/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/classroom/classroom/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/classroom/classroom',
        method: 'put',
        data: obj
    })
}
