import { dispatch } from './EventEmitter';

export function request(url, params, type, onSuccess, onFail) {

  type = type.toUpperCase();

  if (['GET', 'POST'].indexOf(type) === -1) {
    params = params || {};
    params._method = type;
    type = 'POST';
  }

  let result = jQuery.ajax({
      url: url.match(/^http:\/\//) ? url : config.BACK_URL + url,
      data: params,
      dataType: 'json',
      type: type,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
  });
  /**
   * If onSuccess callback not set promise will be returned
   */
  if (typeof onSuccess === 'undefined') {
    return result;
  }

  return result
    .done(onSuccess)
    .fail(onFail)
    .always((r) => dispatch('request:result', r));
};
