import { request } from '../core/helpers/Request';

export function list(data, success, fail) {
  return request(`/quiz/current/byCourse/${data.courseId}`, {}, 'get', success, fail);
}

export function get(data, success, fail) {
  return request('/quizQuestions', data, 'get', success, fail);
}

export function finishQuiz(data, success, fail) {
  return request('/quizProgress', data, 'post', success, fail);
}

export function getQuizById(id, success, fail) {
    return request(`/quiz/${id}`, {}, 'get', success, fail);
}

export function getQuizByLection(lectionId, success, fail) {
  return request(`/quiz/byLection/${lectionId}`, {}, 'get', success, fail);
}