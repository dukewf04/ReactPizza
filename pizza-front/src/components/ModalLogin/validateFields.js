import { errorHandler } from '../../utils/alarmHandler';

// Валидация полей формы регистрации, авторизации

export const validateFields = (name, email, password, verifyPassword) => {
  if (!name && name !== null) {
    errorHandler('Не заполнено поле Имя пользователя');
    return false;
  }

  if (!email) {
    errorHandler('Не заполнено поле Email');
    return false;
  }

  if (!password) {
    errorHandler('Не заполнено поле Пароль');
    return false;
  }

  if (password !== verifyPassword && verifyPassword !== null) {
    errorHandler('Пароли не совпадают');
    return false;
  }

  return true;
};
