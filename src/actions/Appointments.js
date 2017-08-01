import { request } from '../core/helpers/Request';

export function list({ courseId, month, year }, success, fail) {
  return request(`/event/course/${courseId}/month/${month}/year/${year}`, null, 'get', success, fail);
};

export function attach({ eventId }, success, fail) {
  return request(`/event/${eventId}/attach`, null, 'put', success, fail);
};

export function tutorsList({ courseId }, success, fail) {
  return request(`/course/${courseId}/tutors`, null, 'get', success, fail);
};

export function actualForUser({ courseId }, success, fail) {
  return request(`/event/byCourse/${courseId}/self`, null, 'get', success, fail);
};

export function latestGoals(success, fail) {
  return request('/goal/dashboard', null, 'get', success, fail);
};
