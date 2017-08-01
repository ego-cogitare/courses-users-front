import { request } from '../core/helpers/Request';

export function loginDefault(data, success, fail) {
  return request('/login', data, 'post', success, fail);
}

export function loginSocial(data, success, fail) {
  return request('/login/social', data, 'post', success, fail);
}
