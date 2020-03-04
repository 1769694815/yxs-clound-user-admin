import request from '@/utils/request'

export function fetchList(query) {
    for (const key in query) {
        if (query[key] == null || query[key] === '') {
            delete query[key]
        }
    }
    return request({
        url: '/news/navigation/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/news/navigation',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/news/navigation/' + id,
        method: 'get'
    })
}

export function delObj(row) {
    return request({
        url: '/news/navigation/' + row.id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/news/navigation',
        method: 'put',
        data: obj
    })
}
