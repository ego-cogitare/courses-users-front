import { request } from '../core/helpers/Request';
import User from '../core/helpers/User';


export function getProfile(success, fail) {
  return request('/self', null, 'get', success, fail);
}

export function updateProfile(data, success, fail) {
  return request('/user', data, 'put', success, fail);
}

export function updatePassword(data, success, fail) {
  return request('/user/password', data, 'put', success, fail);
}

export function getStoredData({ key }, success, fail) {
  return success ?
    request(`/data/${key}`, null, 'get', success, fail) :
    request(`/data/${key}`, null, 'get');
}

export function setStoredData(data, success, fail) {
  return request('/data', data, 'post', success, fail);
}

export function updateStoredData(data, success, fail) {
  return request('/data', data, 'put', success, fail);
}
