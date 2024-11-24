export const BASE_URL = `http://${
  process.env.REACT_APP_BUILD_MODE === 'development' ? 'localhost:31112' : '46.146.232.223'
}/api/`;
