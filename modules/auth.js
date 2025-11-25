import { login, register, setToken } from './api.js';
import { saveUser } from './storage.js';

let isLoginMode = true;

export function renderAuthForm({ onSuccess }) {
  const app = document.querySelector('.container');

  const authHTML = `
    <div class="auth-form">
      <h2>${isLoginMode ? 'Вход' : 'Регистрация'}</h2>
      
      <div class="auth-fields">
        ${
          !isLoginMode
            ? `
          <input type="text" class="auth-input auth-name" placeholder="Имя" />
        `
            : ''
        }
        
        <input type="text" class="auth-input auth-login" placeholder="Логин" />
        <input type="password" class="auth-input auth-password" placeholder="Пароль" />
      </div>
      
      <button class="auth-button">${
        isLoginMode ? 'Войти' : 'Зарегистрироваться'
      }</button>
      <button class="auth-switch">${
        isLoginMode ? 'Зарегистрироваться' : 'Войти'
      }</button>
      
      <div class="auth-error" style="display: none;"></div>
    </div>
  `;

  app.innerHTML = authHTML;

  const authButton = document.querySelector('.auth-button');
  const switchButton = document.querySelector('.auth-switch');
  const errorDiv = document.querySelector('.auth-error');

  const showError = (message) => {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  };

  const hideError = () => {
    errorDiv.style.display = 'none';
  };

  const handleAuth = async () => {
    const loginInput = document.querySelector('.auth-login');
    const passwordInput = document.querySelector('.auth-password');
    const nameInput = document.querySelector('.auth-name');

    const loginValue = loginInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const nameValue = nameInput ? nameInput.value.trim() : '';

    if (!loginValue) {
      showError('Введите логин');
      return;
    }

    if (!passwordValue) {
      showError('Введите пароль');
      return;
    }

    if (passwordValue.length < 6) {
      showError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (!isLoginMode && !nameValue) {
      showError('Введите имя');
      return;
    }

    try {
      hideError();
      authButton.disabled = true;
      authButton.textContent = 'Загрузка...';

      let result;
      if (isLoginMode) {
        result = await login({ login: loginValue, password: passwordValue });
      } else {
        result = await register({
          login: loginValue,
          password: passwordValue,
          name: nameValue,
        });
      }

      setToken(result.user.token);
      saveUser(result.user);
      onSuccess(result.user);
    } catch (error) {
      showError(error.message);
    } finally {
      authButton.disabled = false;
      authButton.textContent = isLoginMode ? 'Войти' : 'Зарегистрироваться';
    }
  };

  const switchMode = () => {
    isLoginMode = !isLoginMode;
    renderAuthForm({ onSuccess });
  };

  authButton.addEventListener('click', handleAuth);
  switchButton.addEventListener('click', switchMode);
}
