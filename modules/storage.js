export function saveUser(userData) {
  localStorage.setItem('user', JSON.stringify(userData));
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem('user');
}
