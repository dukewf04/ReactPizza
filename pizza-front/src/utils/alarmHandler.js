import axios from 'axios';
import Noty from 'noty';

export const createAxiosInterceptors = () => {
  axios.defaults.withCredentials = true;

  // Добавляем перехват запросов
  axios.interceptors.request.use(
    function (config) {
      // Здесь можете сделать что-нибудь с перед отправкой запроса
      return config;
    },
    function (error) {
      // Обработка ошибок
      errorHandler('Ошибка отправки данных на сервер');
      return Promise.reject(error);
    },
  );

  // Добавляем перехват ответов
  axios.interceptors.response.use(
    function (response) {
      // Любой код состояния, находящийся в диапазоне 2xx, вызывает срабатывание этой функции
      return response;
    },
    function (error) {
      return Promise.reject(error);
    },
  );
};

const alarmHandler = (text, type, container) => {
  new Noty({
    text: text,
    theme: 'bootstrap-v4',
    type: type,
    layout: 'topRight',
    closeWith: ['click'],
    killer: true,
    container: container,
    timeout: 2000,
  }).show();
};

export const showError = (error) => {
  alarmHandler(error, 'error', '');
};

export const errorHandler = (error) => {
  console.log(error)
  try {
    const errorText = error.response.data.detail;
    alarmHandler(`${errorText}`, 'error', '');
  } catch {
    alarmHandler(`Непредвиденная ошибка`, 'error', '');
  }
};

export const successHandler = (text) => {
  alarmHandler(text, 'success', '');
};
