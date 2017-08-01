import { request } from '../core/helpers/Request';

export function comletionState(success, fail) {
  return request('/data/self-assigment', null, 'get', success, fail);
};
