import { escapeHtml } from "./escapeHtml.js";
import { formatDate } from "./formatDate.js";

export function handleLikeButtonClick(e, comments, renderComments) {
  if (e.target.classList.contains("like-button")) {
    const index = parseInt(e.target.dataset.index);
    if (comments[index].isLiked) {
      comments[index].likes--;
      comments[index].isLiked = false;
    } else {
      comments[index].likes++;
      comments[index].isLiked = true;
    }
    renderComments();
  }
}

export function handleCommentTextClick(e, nameInput, textInput) {
  if (e.target.closest(".comment-text")) {
    const commentText = e.target.textContent;
    const commentAuthor = e.target
      .closest(".comment")
      .querySelector(".comment-header div:first-child").textContent;
    const replyText = `> ${commentText}`;
    const replyAuthor = `Ответ на комментарий ${commentAuthor}:`;
    nameInput.value = replyAuthor;
    textInput.value = replyText;
  }
}

export function handleAddComment(
  nameInput,
  textInput,
  comments,
  renderComments
) {
  const text = textInput.value.trim();
  const author = nameInput.value.trim() || "Аноним";

  if (!text) return;

  const safeText = escapeHtml(text);
  const safeAuthor = escapeHtml(author);

  const newComment = {
    text: safeText,
    author: safeAuthor,
    date: formatDate(new Date()),
    likes: 0,
    isLiked: false,
  };

  comments.push(newComment);
  nameInput.value = "";
  textInput.value = "";
  renderComments();
}
