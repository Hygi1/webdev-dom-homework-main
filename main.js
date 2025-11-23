import { renderComments } from './renderComments.js';
import {
  handleLikeButtonClick,
  handleCommentTextClick,
  handleAddComment,
} from './handlers.js';
import { getComments } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const commentsList = document.querySelector('.comments');
  const nameInput = document.querySelector('.add-form-name');
  const textInput = document.querySelector('.add-form-text');
  const addButton = document.querySelector('.add-form-button');
  const container = document.querySelector('.container');

  let comments = [];

  const render = () => renderComments(commentsList, comments);

  const loadComments = () => {
    commentsList.innerHTML = `
      <div style="color: #bcec30; text-align: center; padding: 40px; 
                  background: rgba(115, 52, 234, 0.1); border-radius: 20px;">
        Комментарии загружаются...
      </div>
    `;

    return getComments()
      .then((loadedComments) => {
        comments = loadedComments;
        render();
      })
      .catch((error) => {
        console.error('Ошибка загрузки:', error);
        commentsList.innerHTML = `
          <div style="color: #ff6b6b; text-align: center; padding: 20px; 
                      background: rgba(255,107,107,0.1); border-radius: 10px;">
            Не удалось загрузить комментарии. Проверьте подключение к интернету.
          </div>
        `;
      });
  };

  loadComments();

  document.addEventListener('click', (e) => {
    handleLikeButtonClick(e, comments, render);
    handleCommentTextClick(e, nameInput, textInput);
  });

  addButton.addEventListener('click', () => {
    const addForm = document.querySelector('.add-form');
    const originalFormHTML = addForm.innerHTML;

    addForm.innerHTML = `
      <div style="color: #bcec30; text-align: center; padding: 40px; 
                  background: rgba(115, 52, 234, 0.1); border-radius: 20px;">
        Комментарий добавляется...
      </div>
    `;

    handleAddComment(nameInput, textInput, comments, loadComments).finally(
      () => {
        addForm.innerHTML = originalFormHTML;

        const newAddButton = addForm.querySelector('.add-form-button');
        const newNameInput = addForm.querySelector('.add-form-name');
        const newTextInput = addForm.querySelector('.add-form-text');

        newAddButton.addEventListener('click', addButtonHandler);
        newTextInput.addEventListener('keypress', textInputHandler);

        newNameInput.value = nameInput.value;
        newTextInput.value = textInput.value;
      }
    );
  });

  const addButtonHandler = () => {
    const addForm = document.querySelector('.add-form');
    const originalFormHTML = addForm.innerHTML;
    const currentNameInput = document.querySelector('.add-form-name');
    const currentTextInput = document.querySelector('.add-form-text');

    addForm.innerHTML = `
      <div style="color: #bcec30; text-align: center; padding: 40px; 
                  background: rgba(115, 52, 234, 0.1); border-radius: 20px;">
        Комментарий добавляется...
      </div>
    `;

    handleAddComment(
      currentNameInput,
      currentTextInput,
      comments,
      loadComments
    ).finally(() => {
      addForm.innerHTML = originalFormHTML;
      const newAddButton = addForm.querySelector('.add-form-button');
      const newTextInput = addForm.querySelector('.add-form-text');

      newAddButton.addEventListener('click', addButtonHandler);
      newTextInput.addEventListener('keypress', textInputHandler);
    });
  };

  const textInputHandler = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      const addForm = document.querySelector('.add-form');
      const originalFormHTML = addForm.innerHTML;
      const currentNameInput = document.querySelector('.add-form-name');
      const currentTextInput = document.querySelector('.add-form-text');

      addForm.innerHTML = `
        <div style="color: #bcec30; text-align: center; padding: 40px; 
                    background: rgba(115, 52, 234, 0.1); border-radius: 20px;">
          Комментарий добавляется...
        </div>
      `;

      handleAddComment(
        currentNameInput,
        currentTextInput,
        comments,
        loadComments
      ).finally(() => {
        addForm.innerHTML = originalFormHTML;
        const newAddButton = addForm.querySelector('.add-form-button');
        const newTextInput = addForm.querySelector('.add-form-text');

        newAddButton.addEventListener('click', addButtonHandler);
        newTextInput.addEventListener('keypress', textInputHandler);
      });
    }
  };

  textInput.addEventListener('keypress', textInputHandler);

  console.log('Приложение загружено!');
});
