import { renderComments } from './renderComments.js';
import {
  handleLikeButtonClick,
  handleCommentTextClick,
  handleAddComment,
} from './handlers.js';
import { getComments, setToken } from './api.js';
import { renderAuthForm } from './auth.js';
import { getUser, removeUser } from './storage.js';

let currentUser = null;

function renderCommentApp() {
  const app = document.querySelector('.container');

  app.innerHTML = `
    <div class="comments-container">
      <div class="user-header">
        <span>Вы вошли как: ${currentUser.name}</span>
        <button class="logout-button">Выйти</button>
      </div>
      
      <div class="loading-comments" style="display: none;">
        Комментарии загружаются...
      </div>
      
      <ul class="comments"></ul>
      
      <div class="add-form">
        <input
          type="text"
          class="add-form-name"
          placeholder="Ваше имя"
          readonly
          value="${currentUser.name}"
        />
        <textarea
          type="textarea"
          class="add-form-text"
          placeholder="Введите ваш комментарий"
          rows="4"
        ></textarea>
        <div class="add-form-row">
          <button class="add-form-button">Написать</button>
        </div>
      </div>
    </div>
  `;

  initializeCommentApp();
}

function renderUnauthorizedApp() {
  const app = document.querySelector('.container');

  app.innerHTML = `
    <div class="comments-container">
      <div class="loading-comments" style="display: none;">
        Комментарии загружаются...
      </div>
      
      <ul class="comments"></ul>
      
      <div class="auth-prompt">
        <p>Чтобы добавить комментарий, <a href="#" class="auth-link">авторизуйтесь</a></p>
      </div>
    </div>
  `;

  setTimeout(() => {
    const authLink = document.querySelector('.auth-link');
    if (authLink) {
      authLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderAuthForm({
          onSuccess: (user) => {
            currentUser = user;
            renderCommentApp();
          },
        });
      });
    }
  }, 0);

  initializeCommentApp(false);
}

function initializeCommentApp(withForm = true) {
  const commentsList = document.querySelector('.comments');

  if (!commentsList) return;

  let nameInput = withForm ? document.querySelector('.add-form-name') : null;
  let textInput = withForm ? document.querySelector('.add-form-text') : null;
  let addButton = withForm ? document.querySelector('.add-form-button') : null;

  let comments = [];
  let savedFormData = { name: '', text: '' };

  const render = () => renderComments(commentsList, comments);

  const loadComments = () => {
    const loadingDiv = document.querySelector('.loading-comments');
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (commentsList) commentsList.style.display = 'none';

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
        if (commentsList) {
          commentsList.innerHTML = `<div style="color: #ff6b6b; text-align: center; padding: 20px; background: rgba(255,107,107,0.1); border-radius: 10px;">${
            error.message || 'Не удалось загрузить комментарии'
          }</div>`;
        }
      })
      .finally(() => {
        const loadingDiv = document.querySelector('.loading-comments');
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (commentsList) commentsList.style.display = 'block';
      });
  };

  if (withForm) {
    const bindFormHandlers = () => {
      nameInput = document.querySelector('.add-form-name');
      textInput = document.querySelector('.add-form-text');
      addButton = document.querySelector('.add-form-button');

      if (textInput) {
        textInput.addEventListener('input', (e) => {
          savedFormData.text = e.target.value;
        });
      }

      if (addButton) {
        addButton.addEventListener('click', handleFormSubmit);
      }

      if (textInput) {
        textInput.addEventListener('keypress', handleKeyPress);
      }
    };

    const handleFormSubmit = () => {
      const addForm = document.querySelector('.add-form');
      if (!addForm) return;

      const originalFormHTML = addForm.innerHTML;
      savedFormData.text = textInput ? textInput.value : '';

      addForm.innerHTML = `<div style="color: #bcec30; text-align: center; padding: 40px; background: rgba(115, 52, 234, 0.1); border-radius: 20px;">Комментарий добавляется...</div>`;

      handleAddComment(
        { nameInput, textInput, currentUser },
        comments,
        loadComments
      ).finally(() => {
        addForm.innerHTML = originalFormHTML;
        bindFormHandlers();
        if (textInput) textInput.value = savedFormData.text;
      });
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleFormSubmit();
      }
    };

    bindFormHandlers();

    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        removeUser();
        currentUser = null;
        setToken(null);
        renderUnauthorizedApp();
      });
    }
  }

  const handleDocumentClick = (e) => {
    handleLikeButtonClick(e, comments, render);
    if (withForm) {
      handleCommentTextClick(e, nameInput, textInput);
    }
  };

  loadComments();
  document.addEventListener('click', handleDocumentClick);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedUser = getUser();
  if (savedUser && savedUser.token) {
    currentUser = savedUser;
    setToken(savedUser.token);
    renderCommentApp();
  } else {
    renderUnauthorizedApp();
  }
});
