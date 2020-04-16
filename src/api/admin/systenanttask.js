import request from '@/utils/request'

export function fetchList(query) {
    for (const key in query) {
        if (query[key] == null || query[key] === '') {
            delete query[key]
        }
    }
    return request({
        url: '/admin/systenanttask/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/admin/systenanttask',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/admin/systenanttask/' + id,
        method: 'get'
    })
}

export function delObj(row) {
    return request({
        url: '/admin/systenanttask/' + row.id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/admin/systenanttask',
        method: 'put',
        data: obj
    })
}
