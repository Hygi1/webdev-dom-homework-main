import { initApp } from './modules/app.js';

try {
  document.addEventListener('DOMContentLoaded', initApp);
  console.log('App initialized');
} catch (error) {
  console.error('Error initializing app:', error);
  document.querySelector('.container').innerHTML = `
    <div style="color: white; text-align: center; padding: 40px;">
      <h2>Ошибка загрузки приложения</h2>
      <p>${error.message}</p>
    </div>
  `;
}
