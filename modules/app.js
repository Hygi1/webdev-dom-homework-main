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
let comments = [];

export function initApp() {
  const savedUser = getUser();
  if (savedUser && savedUser.token) {
    currentUser = savedUser;
    setToken(savedUser.token);
    renderCommentApp();
  } else {
    renderUnauthorizedApp();
  }
}

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

  const authLink = document.querySelector('.auth-link');
  authLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderAuthForm({
      onSuccess: (user) => {
        currentUser = user;
        renderCommentApp();
      },
    });
  });

  initializeCommentApp(false);
}

function initializeCommentApp(withForm = true) {
  const commentsList = document.querySelector('.comments');
  let nameInput = withForm ? document.querySelector('.add-form-name') : null;
  let textInput = withForm ? document.querySelector('.add-form-text') : null;
  let addButton = withForm ? document.querySelector('.add-form-button') : null;

  const render = () => renderComments(commentsList, comments);

  const loadComments = () => {
    const loadingDiv = document.querySelector('.loading-comments');
    loadingDiv.style.display = 'block';
    commentsList.style.display = 'none';

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
      })
      .finally(() => {
        loadingDiv.style.display = 'none';
        commentsList.style.display = 'block';
      });
  };

  if (withForm) {
    const bindFormHandlers = () => {
      nameInput = document.querySelector('.add-form-name');
      textInput = document.querySelector('.add-form-text');
      addButton = document.querySelector('.add-form-button');

      addButton.addEventListener('click', handleFormSubmit);
      textInput.addEventListener('keypress', handleKeyPress);
    };

    const handleFormSubmit = () => {
      const addForm = document.querySelector('.add-form');
      const originalFormHTML = addForm.innerHTML;

      addForm.innerHTML = `<div style="color: #bcec30; text-align: center; padding: 40px; background: rgba(115, 52, 234, 0.1); border-radius: 20px;">Комментарий добавляется...</div>`;

      handleAddComment(
        { nameInput, textInput, currentUser },
        comments,
        loadComments
      )
        .then(() => {
          if (textInput) textInput.value = '';
        })
        .finally(() => {
          addForm.innerHTML = originalFormHTML;
          bindFormHandlers();
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
    handleLikeButtonClick(e, comments, render, currentUser);
    if (withForm) {
      handleCommentTextClick(e, nameInput, textInput);
    }
  };

  loadComments();
  document.addEventListener('click', handleDocumentClick);
}
