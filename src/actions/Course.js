import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(data) {
  return request('/course/self', data, 'get',
    (r) => dispatch('course:list', r),
    (e) => dispatch('course:list', e)
  );
};

export function get(data) {
  return request('/course', data, 'get',
    (r) => dispatch('course:get', r),
    (e) => dispatch('course:get', e)
  );
};
