/*
 * @Author: zhoum
 * @Date: 2020-02-28 13:59:32
 * @LastEditTime: 2020-04-09 12:00:48
 * @LastEditors: Donkey
 * @Description:
 */
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
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
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
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: obj
  })
}

export function getCourseSimpleById(classroomId) {
  return request({
    url: '/classroom/classroom/getCourseSimpleById?classroomId=' + classroomId,
    method: 'get'
  })
}

export function saveClassCourse(obj) {
  return request({
    url: '/classroom/classroomcourses/addClassCourse',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: obj
  })
}

export function updateAllTeacherName() {
  return request({
    url: '/classroom/classroom/updateAllTeacherName',
    method: 'put'
  })
}
