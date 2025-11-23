import { renderComments } from './renderComments.js';
import {
  handleLikeButtonClick,
  handleCommentTextClick,
  handleAddComment,
} from './handlers.js';
import { getComments } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const commentsList = document.querySelector('.comments');
  const nameInput = document.querySelector('.add-form-name');
  const textInput = document.querySelector('.add-form-text');
  const addButton = document.querySelector('.add-form-button');

  let comments = [];

  const loadAndRenderComments = async () => {
    try {
      comments = await getComments();
      console.log('Полученные комментарии:', comments);
      renderComments(commentsList, comments);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      commentsList.innerHTML = `
        <div style="color: #ff6b6b; text-align: center; padding: 20px;">
          Не удалось загрузить комментарии. Проверьте подключение к интернету.
        </div>
      `;
    }
  };

  const render = () => renderComments(commentsList, comments);

  await loadAndRenderComments();

  document.addEventListener('click', (e) => {
    handleLikeButtonClick(e, comments, render);
    handleCommentTextClick(e, nameInput, textInput);
  });

  addButton.addEventListener('click', () => {
    handleAddComment(nameInput, textInput, comments, loadAndRenderComments);
  });

  textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment(nameInput, textInput, comments, loadAndRenderComments);
    }
  });

  console.log('Приложение загружено и подключено к API!');
});
