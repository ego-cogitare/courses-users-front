import { request } from '../core/helpers/Request';

export function list(data, success, fail) {
  return request(`/steps/byUser/${data.userId}/byCourse/${data.courseId}`, data, 'get', success, fail);
}

export function fetchByCourseId({ courseId }, success, fail) {
  return request(`/keylearning/byCourse/${courseId}`, null, 'get', success, fail);
}

export function listDashboard(courseId, success, fail) {
  return request(`/keylearning/byCourse/${courseId}/dashboard`, {}, 'get', success, fail);
}

export function add(data, success, fail) {
  return request('/keylearning', data, 'post', success, fail);
}

export function update(data, success, fail) {
  return request('/keylearning', data, 'put', success, fail);
}
