let socket = undefined;
const loginForm = document.getElementById('login-form');
const chatForm = document.getElementById('chat-form');
const login = document.getElementById('login');
const chat = document.getElementById('chat');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = e.target['name'].value;
  const channel = e.target['channel'].value;

  if (name) {
    // Connecting the socket
    socket = window.io();

    // User joins a channel
    socket.emit('user-join', name, channel);

    login.classList.add('hidden');
    chat.classList.remove('hidden');
  }
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target['message'].value;

  if (message) {
    // Send message to chat
    socket.emit('chat-message', message);
    e.target.elements.message.value = '';
    e.target.elements.message.focus();
  }
});