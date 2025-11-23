// api.js
const API_BASE_URL = 'https://wedev-api.sky.pro/api/v1/danil-mekhanoshin';
const COMMENTS_URL = `${API_BASE_URL}/comments`;

export async function getComments() {
  try {
    const response = await fetch(COMMENTS_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Ошибка при загрузке комментариев');
    }

    const data = await response.json();
    return data.comments;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

export async function postComment({ text, name }) {
  try {
    const response = await fetch(COMMENTS_URL, {
      method: 'POST',
      body: JSON.stringify({
        text: text,
        name: name,
      }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении комментария');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}
