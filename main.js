import { fetchComments, addComment } from './api.js';
import { renderComments } from './render.js';
import {
  handleLikeButtonClick,
  handleCommentTextClick,
  handleAddComment,
} from './handlers.js';
import { escapeHtml } from './escapeHtml.js';
import { formatDate } from './formatDate.js';

let comments = [];

document.addEventListener('DOMContentLoaded', async () => {
  const commentsList = document.querySelector('.comments');
  const nameInput = document.querySelector('.add-form-name');
  const textInput = document.querySelector('.add-form-text');
  const addButton = document.querySelector('.add-form-button');

  try {
    comments = await fetchComments();
    renderComments(commentsList, comments);
  } catch (error) {
    console.error('Ошибка загрузки комментариев:', error);
    alert(
      'Не удалось загрузить комментарии. Проверьте подключение к интернету.'
    );
  }

  document.addEventListener('click', (e) => {
    handleLikeButtonClick(e, comments, renderComments, commentsList);
    handleCommentTextClick(e, nameInput, textInput);
  });

  addButton.addEventListener('click', () =>
    handleAddComment(
      nameInput,
      textInput,
      comments,
      renderComments,
      commentsList
    )
  );
});
