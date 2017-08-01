import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function markCompleted({ stepId }, success, fail) {
  return request('/stepProgress', { stepId }, 'post', success, fail);
};

export function markUncompleted({ id }, success, fail) {
  return request(`/stepProgress/${id}`, null, 'delete', success, fail);
};

export function completionState({ lectionId }, success, fail) {
  return request(`/stepProgress/byLection/${lectionId}`, null, 'get', success, fail);
};

export function listByLectionId({ lectionId }, success, fail) {
  return request(`/steps?lectionId=${lectionId}`, null, 'get',
    (r) => dispatch('lection:steps', r),
    (e) => dispatch('lection:steps', e)
  );
};

export function listByUserAndCourseId(data) {
  return request(`/steps/byUser/${data.userId}/byLection/${data.lectionId}`, data, 'get',
    (r) => dispatch('lection:steps', r),
    (e) => dispatch('lection:steps', e)
  );
};
