import { request } from '../core/helpers/Request';

export function tutorsList(data, success, fail) {
  return request(`/course/${data.courseId}/tutors`, null, 'get', success, fail);
}

export function countUnread(data, success, fail) {
    return request('/message/unread/count', data, 'get', success, fail);
}
