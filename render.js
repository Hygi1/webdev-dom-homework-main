import { escapeHtml } from './escapeHtml.js';

export function renderComments(commentsList, comments) {
  commentsList.innerHTML = '';

  if (comments.length === 0) {
    commentsList.innerHTML = '<li class="no-comments">Комментариев нет</li>';
    return;
  }

  comments.forEach((comment, index) => {
    const escapedAuthor = escapeHtml(comment.author);
    const escapedText = escapeHtml(comment.text);

    const likeClass = comment.isLiked
      ? 'like-button -active-like'
      : 'like-button';

    const commentHTML = `
      <li class="comment">
        <div class="comment-header">
          <div>${escapedAuthor}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${escapedText}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="${likeClass}" data-index="${index}"></button>
          </div>
        </div>
      </li>
    `;

    commentsList.insertAdjacentHTML('beforeend', commentHTML);
  });
}
