const API_BASE_URL = 'https://wedev-api.sky.pro/api/v1/danil-mekhanoshin';
const COMMENTS_URL = `${API_BASE_URL}/comments`;

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

export function postComment({ text, name }, retryCount = 0) {
  return fetch(COMMENTS_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: text,
      name: name,
      forceError: Math.random() > 0.5,
    }),
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error('Имя и комментарий должны быть не короче 3 символов');
      }
      if (response.status === 500) {
        throw new Error('Сервер сломался, попробуй позже');
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

      if (
        error.message === 'Сервер сломался, попробуй позже' &&
        retryCount < 2
      ) {
        return postComment({ text, name }, retryCount + 1);
      }

      throw error;
    });
}
