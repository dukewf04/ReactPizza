import { jwtDecode } from 'jwt-decode';

// Интерфейс для работы с объектом пользователя, JWT токеном

export default class UserAuth {
  COOKIE_NAME = 'users_access_token';
  JWT;

  constructor() {
    // Получаем JWT токен из cookie
    this.JWT = this.getCookie(this.COOKIE_NAME);
  }

  // Получить cookie по имени
  getCookie(name) {
    const fullCookieString = '; ' + document.cookie;
    const splitCookie = fullCookieString.split('; ' + name + '=');
    if (splitCookie.length === 2) {
      const cookieValue = splitCookie.pop().split(';').shift();
      return cookieValue;
    } else {
      return null;
    }
  }

  // Удаление cookie
  deleteCookie() {
    document.cookie = this.COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  getDecodedData() {
    // Декодируем jwt токен, проверяем, чтобы он не был просрочен. Если срок истек, то удаляем cookie
    if (!this.JWT) return null;

    const decoded = jwtDecode(this.JWT);
    let currentTime = new Date().getTime();
    currentTime = Math.floor(currentTime / 1000);
    if (currentTime > decoded.exp) this.deleteCookie();

    return { ...decoded };
  }

  isValid() {
    // Проверка валидности токена

    return this.getDecodedData() ? true : false;
  }

  hasRole(roleName) {
    // Проверка роли пользователя

    const role = this.getDecodedData();

    return !role || role['role'] !== roleName ? false : true;
  }
}
