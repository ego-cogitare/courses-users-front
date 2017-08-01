import { request } from '../core/helpers/Request';

export function registerDefault(data, success, fail) {
  return request('/user.json', data, 'post', success, fail);
}

export function registerSocial(data, success, fail) {
  return request('/user/social', data, 'post', success, fail);
}
