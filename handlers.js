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
  { nameInput, textInput, currentUser },
  comments,
  loadCommentsCallback
) {
  const text = textInput.value.trim();

  if (text.length < 3) {
    alert('Комментарий должен быть не короче 3 символов');
    return Promise.reject('Слишком короткий комментарий');
  }

  return postComment({
    text: text,
  })
    .then(() => {
      textInput.value = '';
      return loadCommentsCallback();
    })
    .catch((error) => {
      if (
        error.message.includes('Сервер сломался') ||
        error.message.includes('интернет') ||
        error.message.includes('короче 3 символов') ||
        error.message.includes('авторизации')
      ) {
        alert(error.message);
      } else {
        alert('Неизвестная ошибка. Попробуйте позже.');
      }
      throw error;
    });
}
