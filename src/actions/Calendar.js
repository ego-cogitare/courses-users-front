import { request } from '../core/helpers/Request';

export function list({ month, year }, success, fail) {
  return request(`/goal/month/${month}/year/${year}`, null, 'get', success, fail);
}

export function fetch(data, success, fail) {
  return request(`/goal`, data, 'get', success, fail);
}

export function add(data, success, fail) {
  return request(`/goal`, data, 'post', success, fail);
}

export function update(data, success, fail) {
  return request(`/goal/${data.goalId}`, data, 'put', success, fail);
}

export function remove(goalId, success, fail) {
  return request(`/goal/${goalId}`, null, 'delete', success, fail);
}
