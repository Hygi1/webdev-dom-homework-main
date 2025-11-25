import { formatDate } from './formatDate.js';
import { escapeHtml } from './escapeHtml.js';

function getSafeText(text) {
  if (typeof text === 'string') return text;
  if (text && typeof text === 'object') {
    return (
      text.text ||
      text.content ||
      text.value ||
      text.message ||
      text.name ||
      text.title ||
      JSON.stringify(text)
    );
  }
  return String(text);
}

function getSafeAuthor(author) {
  if (typeof author === 'string') return author;
  if (author && typeof author === 'object') {
    return (
      author.name ||
      author.author ||
      author.username ||
      author.login ||
      author.email ||
      JSON.stringify(author)
    );
  }
  return String(author);
}

export function renderComments(commentsList, comments) {
  commentsList.innerHTML = '';

  comments.forEach((comment, index) => {
    const formattedDate = formatDate(new Date(comment.date));
    const author = escapeHtml(getSafeAuthor(comment.author || comment.name));
    const text = escapeHtml(getSafeText(comment.text));

    let likeClass = 'like-button';
    if (comment.isLiked) likeClass += ' -active-like';
    if (comment.isLikeLoading) likeClass += ' -loading-like';

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
            <button class="${likeClass}" data-index="${index}" 
                    ${comment.isLikeLoading ? 'disabled' : ''}></button>
          </div>
        </div>
      </li>
    `;
    commentsList.insertAdjacentHTML('beforeend', commentHTML);
  });
}
