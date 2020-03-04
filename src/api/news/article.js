import request from '@/utils/request'

export function fetchList(query) {
    for (const key in query) {
        if (query[key] == null || query[key] === '') {
            delete query[key]
        }
    }
    return request({
        url: '/news/article/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/news/article',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/news/article/' + id,
        method: 'get'
    })
}

export function delObj(row) {
    return request({
        url: '/news/article/' + row.id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/news/article',
        method: 'put',
        data: obj
    })
}
