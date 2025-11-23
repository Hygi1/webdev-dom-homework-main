const API_BASE_URL = 'https://wedev-api.sky.pro/api/v1/danil-mekhanoshin';
const COMMENTS_URL = `${API_BASE_URL}/comments`;

export function getComments() {
  return fetch(COMMENTS_URL, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка при загрузке комментариев');
      }
      return response.json();
    })
    .then((data) => {
      return data.comments;
    });
}

export function postComment({ text, name }) {
  return fetch(COMMENTS_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: text,
      name: name,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Ошибка при добавлении комментария');
    }
    return response.json();
  });
}
