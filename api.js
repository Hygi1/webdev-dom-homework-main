const API_URL = 'https://wedev-api.sky.pro/api/v1/danil-mekhanoshin/comments';

export async function fetchComments() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error('Ошибка при загрузке комментариев:', error);
    throw error;
  }
}

export async function addComment(comment) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`
      );
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Ошибка при отправке комментария:', error);
    throw error;
  }
}
