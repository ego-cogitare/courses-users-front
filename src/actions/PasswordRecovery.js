import { request } from '../core/helpers/Request';

export function getLink(data, success, fail) {
  return request(`/password-link`, data, 'post', success, fail);
};

export function resetPassword({ password, linkId }, success, fail) {
  return request(`/password-link/${linkId}`, { password }, 'post', success, fail);
};
