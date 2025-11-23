import { comments } from "./comments.js";
import { renderComments } from "./renderComments.js";
import { handleLikeButtonClick } from "./handlers.js";
import { handleCommentTextClick } from "./handlers.js";
import { handleAddComment } from "./handlers.js";

document.addEventListener("DOMContentLoaded", () => {
  const commentsList = document.querySelector(".comments");
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");

  renderComments(commentsList);

  document.addEventListener("click", (e) => {
    handleLikeButtonClick(e, comments, () => renderComments(commentsList));
    handleCommentTextClick(e, nameInput, textInput);
  });

  addButton.addEventListener("click", () =>
    handleAddComment(nameInput, textInput, comments, () =>
      renderComments(commentsList),
    ),
  );

  console.log("It works!");
});
