import { escapeHtml } from './escapeHtml.js';
import { postComment } from './api.js';

export function handleLikeButtonClick(e, comments, renderCallback) {
  if (e.target.classList.contains('like-button')) {
    const index = parseInt(e.target.dataset.index);

    if (comments[index].isLiked) {
      comments[index].likes--;
      comments[index].isLiked = false;
    } else {
      comments[index].likes++;
      comments[index].isLiked = true;
    }
    renderCallback();
  }
}

export function handleCommentTextClick(e, nameInput, textInput) {
  if (e.target.classList.contains('comment-text')) {
    const commentText = e.target.textContent;
    const commentAuthor = e.target
      .closest('.comment')
      .querySelector('.comment-header div:first-child').textContent;

    nameInput.value = `Ответ ${commentAuthor}`;
    textInput.value = `> ${commentText}\n\n`;
    textInput.focus();
  }
}

export async function handleAddComment(
  nameInput,
  textInput,
  comments,
  loadCommentsCallback
) {
  const text = textInput.value.trim();
  const name = nameInput.value.trim();

  if (!text) {
    alert('Пожалуйста, введите текст комментария');
    return;
  }

  if (!name) {
    alert('Пожалуйста, введите имя');
    return;
  }

  try {
    const addButton = document.querySelector('.add-form-button');
    const originalText = addButton.textContent;
    addButton.textContent = 'Добавляем...';
    addButton.disabled = true;

    await postComment({
      text: text,
      name: name,
    });

    nameInput.value = '';
    textInput.value = '';

    await loadCommentsCallback();
  } catch (error) {
    alert('Не удалось добавить комментарий. Попробуйте позже.');
    console.error('Ошибка при добавлении:', error);
  } finally {
    const addButton = document.querySelector('.add-form-button');
    addButton.textContent = 'Написать';
    addButton.disabled = false;
  }
}
