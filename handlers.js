import { postComment } from './api.js';

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

export function handleLikeButtonClick(e, comments, renderCallback) {
  if (e.target.classList.contains('like-button') && !e.target.disabled) {
    const index = parseInt(e.target.dataset.index);
    const comment = comments[index];

    if (comment.isLikeLoading) return;

    comment.isLikeLoading = true;
    renderCallback();

    delay(2000)
      .then(() => {
        if (comment.isLiked) {
          comment.likes = Math.max(0, comment.likes - 1);
          comment.isLiked = false;
        } else {
          comment.likes += 1;
          comment.isLiked = true;
        }
        comment.isLikeLoading = false;
      })
      .then(() => {
        renderCallback();
      })
      .catch((error) => {
        console.error('Ошибка при лайке:', error);
        comment.isLikeLoading = false;
        renderCallback();
      });
  }
}

export function handleCommentTextClick(e, nameInput, textInput) {
  if (e.target.classList.contains('comment-text')) {
    const commentText = e.target.textContent;
    const commentHeader = e.target
      .closest('.comment')
      .querySelector('.comment-header');
    const commentAuthor =
      commentHeader.querySelector('div:first-child').textContent;

    nameInput.value = `Ответ ${commentAuthor}`;
    textInput.value = `> ${commentText}\n\n`;
    textInput.focus();
  }
}

export function handleAddComment(
  nameInput,
  textInput,
  comments,
  loadCommentsCallback
) {
  const text = textInput.value.trim();
  const name = nameInput.value.trim();

  if (!text) {
    alert('Пожалуйста, введите текст комментария');
    return Promise.reject('Пустой текст');
  }

  if (!name) {
    alert('Пожалуйста, введите имя');
    return Promise.reject('Пустое имя');
  }

  return postComment({
    text: text,
    name: name,
  })
    .then(() => {
      return loadCommentsCallback();
    })
    .catch((error) => {
      console.error('Ошибка при добавлении:', error);
      alert('Не удалось добавить комментарий. Попробуйте позже.');
      throw error;
    });
}
