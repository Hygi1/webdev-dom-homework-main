import { formatDate } from './formatDate.js';

function getTextFromField(field) {
  if (typeof field === 'string') {
    return field;
  } else if (field && typeof field === 'object') {
    return (
      field.text ||
      field.value ||
      field.content ||
      field.name ||
      JSON.stringify(field)
    );
  }
  return String(field);
}

function getAuthorFromField(field) {
  if (typeof field === 'string') {
    return field;
  } else if (field && typeof field === 'object') {
    return (
      field.name ||
      field.author ||
      field.username ||
      field.login ||
      JSON.stringify(field)
    );
  }
  return String(field);
}

export function renderComments(commentsList, comments) {
  commentsList.innerHTML = '';

  comments.forEach((comment, index) => {
    const formattedDate = formatDate(new Date(comment.date));

    const author = getAuthorFromField(comment.author || comment.name);
    const text = getTextFromField(comment.text);

    const likeClass = comment.isLiked
      ? 'like-button -active-like'
      : 'like-button';
    const commentHTML = `
      <li class="comment">
        <div class="comment-header">
          <div>${author}</div>
          <div>${formattedDate}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${text}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes || 0}</span>
            <button class="${likeClass}" data-index="${index}"></button>
          </div>
        </div>
      </li>
    `;
    commentsList.insertAdjacentHTML('beforeend', commentHTML);
  });
}
