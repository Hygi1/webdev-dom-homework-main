const API_BASE_URL = 'https://wedev-api.sky.pro/api/v2/danil-mekhanoshin';
const COMMENTS_URL = `${API_BASE_URL}/comments`;
const LOGIN_URL = 'https://wedev-api.sky.pro/api/user/login';
const REGISTER_URL = 'https://wedev-api.sky.pro/api/user';

let token = null;

export function setToken(newToken) {
  token = newToken;
}

export function getToken() {
  return token;
}

export function getComments() {
  return fetch(COMMENTS_URL, {
    method: 'GET',
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error('Сервер сломался, попробуй позже');
      }
      if (!response.ok) {
        throw new Error('Ошибка при загрузке комментариев');
      }
      return response.json();
    })
    .then((data) => {
      return data.comments;
    })
    .catch((error) => {
      if (error.message === 'Failed to fetch') {
        throw new Error('Кажется, у вас сломался интернет, попробуйте позже');
      }
      throw error;
    });
}

export function postComment({ text }) {
  return fetch(COMMENTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text: text,
    }),
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error('Комментарий должен быть не короче 3 символов');
      }
      if (response.status === 500) {
        throw new Error('Сервер сломался, попробуй позже');
      }
      if (response.status === 401) {
        throw new Error('Ошибка авторизации');
      }
      if (!response.ok) {
        throw new Error('Ошибка при добавлении комментария');
      }
      return response.json();
    })
    .catch((error) => {
      if (error.message === 'Failed to fetch') {
        throw new Error('Кажется, у вас сломался интернет, попробуйте позже');
      }
      throw error;
    });
}

export function login({ login, password }) {
  return fetch(LOGIN_URL, {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      return response.json().then((errorData) => {
        throw new Error(errorData.error || 'Неверный логин или пароль');
      });
    }
    if (!response.ok) {
      throw new Error('Ошибка авторизации');
    }
    return response.json();
  });
}

export function register({ login, password, name }) {
  return fetch(REGISTER_URL, {
    method: 'POST',
    body: JSON.stringify({
      login,
      name,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      return response.json().then((errorData) => {
        throw new Error(errorData.error || 'Пользователь уже существует');
      });
    }
    if (!response.ok) {
      throw new Error('Ошибка регистрации');
    }
    return response.json();
  });
}
