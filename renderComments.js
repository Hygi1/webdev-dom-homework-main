import { comments } from "./comments.js";

export function renderComments(commentsList) {
  commentsList.innerHTML = "";
  comments.forEach((comment, index) => {
    const likeClass = comment.isLiked
      ? "like-button -active-like"
      : "like-button";
    const commentHTML = `
      <li class="comment">
        <div class="comment-header">
          <div>${comment.author}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${comment.text}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="${likeClass}" data-index="${index}"></button>
          </div>
        </div>
      </li>
    `;
    commentsList.insertAdjacentHTML("beforeend", commentHTML);
  });
}
