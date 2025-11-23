import { renderComments } from './renderComments.js';
import {
  handleLikeButtonClick,
  handleCommentTextClick,
  handleAddComment,
} from './handlers.js';
import { getComments } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const commentsList = document.querySelector('.comments');
  let nameInput = document.querySelector('.add-form-name');
  let textInput = document.querySelector('.add-form-text');
  let addButton = document.querySelector('.add-form-button');

  let comments = [];
  let savedFormData = { name: '', text: '' };

  const render = () => renderComments(commentsList, comments);

  const loadComments = () => {
    commentsList.innerHTML = `<div style="color: #bcec30; text-align: center; padding: 40px; background: rgba(115, 52, 234, 0.1); border-radius: 20px;">Комментарии загружаются...</div>`;

    return getComments()
      .then((loadedComments) => {
        comments = loadedComments;
        render();
      })
      .catch((error) => {
        if (
          error.message.includes('интернет') ||
          error.message.includes('Сервер сломался')
        ) {
          alert(error.message);
        }
        commentsList.innerHTML = `<div style="color: #ff6b6b; text-align: center; padding: 20px; background: rgba(255,107,107,0.1); border-radius: 10px;">${
          error.message || 'Не удалось загрузить комментарии'
        }</div>`;
      });
  };

  const bindFormHandlers = () => {
    nameInput = document.querySelector('.add-form-name');
    textInput = document.querySelector('.add-form-text');
    addButton = document.querySelector('.add-form-button');

    nameInput.addEventListener('input', (e) => {
      savedFormData.name = e.target.value;
    });

    textInput.addEventListener('input', (e) => {
      savedFormData.text = e.target.value;
    });

    addButton.addEventListener('click', handleFormSubmit);
    textInput.addEventListener('keypress', handleKeyPress);
  };

  const handleFormSubmit = () => {
    const addForm = document.querySelector('.add-form');
    const originalFormHTML = addForm.innerHTML;

    savedFormData.name = nameInput.value;
    savedFormData.text = textInput.value;

    addForm.innerHTML = `<div style="color: #bcec30; text-align: center; padding: 40px; background: rgba(115, 52, 234, 0.1); border-radius: 20px;">Комментарий добавляется...</div>`;

    handleAddComment({ nameInput, textInput }, comments, loadComments).finally(
      () => {
        addForm.innerHTML = originalFormHTML;
        bindFormHandlers();
        nameInput.value = savedFormData.name;
        textInput.value = savedFormData.text;
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleFormSubmit();
    }
  };

  const handleDocumentClick = (e) => {
    handleLikeButtonClick(e, comments, render);
    handleCommentTextClick(e, nameInput, textInput);
  };

  const init = () => {
    loadComments();
    document.addEventListener('click', handleDocumentClick);
    bindFormHandlers();
  };

  init();
});
