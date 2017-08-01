import { request } from '../core/helpers/Request';

export function get({courseId}, success, fail) {
  return request(`/statistics/byCourseId/${courseId}`, {}, 'get', success, fail);
}