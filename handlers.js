import { addComment } from './api.js';

export function handleLikeButtonClick(
  e,
  comments,
  renderComments,
  commentsList
) {
  if (e.target.classList.contains('like-button')) {
    const index = parseInt(e.target.dataset.index);
    comments[index].isLiked = !comments[index].isLiked;
    comments[index].likes += comments[index].isLiked ? 1 : -1;
    renderComments(commentsList, comments);
  }
}

export function handleCommentTextClick(e, nameInput, textInput) {
  if (e.target.closest('.comment-text')) {
    const commentText = e.target.textContent;
    const commentAuthor = e.target
      .closest('.comment')
      .querySelector('.comment-header div:first-child').textContent;
    textInput.value = `> ${commentText}`;
    nameInput.value = `Ответ на комментарий ${commentAuthor}:`;
  }
}

export async function handleAddComment(
  nameInput,
  textInput,
  comments,
  renderComments,
  commentsList
) {
  const text = textInput.value.trim();
  const name = nameInput.value.trim() || 'Аноним';

  if (!text) return;

  const newComment = {
    text,
    name,
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    likes: 0,
    isLiked: false,
  };

  try {
    const response = await addComment(newComment);
    if (response.success) {
      comments.push(newComment);
      nameInput.value = '';
      textInput.value = '';
      renderComments(commentsList, comments);
    } else {
      throw new Error('Сервер вернул ошибку');
    }
  } catch (error) {
    console.error('Ошибка отправки комментария:', error);
    alert('Не удалось отправить комментарий. Попробуйте позже.');
  }
}
