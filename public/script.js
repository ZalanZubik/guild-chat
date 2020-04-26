let socket = undefined;
const loginForm = document.getElementById('login-form');
const chatForm = document.getElementById('chat-form');
const login = document.getElementById('login');
const chat = document.getElementById('chat');
const chatMessages = document.querySelector('.chat-messages');
const onlineUsers = document.getElementById('users');
const onlineNumber = document.getElementById('online-number');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = e.target['name'].value;
  const channel = e.target['channel'].value;

  if (username) {
    // Connecting the socket
    socket = window.io();

    // User joins a channel
    socket.emit('user-join', username, channel);

    // Get all users from server
    socket.on('get-users', users => {
      updateUsers(users);
    });

    // Message from server
    socket.on('message', message => {
      sendToChat(message);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    login.classList.add('hidden');
    chat.classList.remove('hidden');
    document.getElementById("message").focus();
  }
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target['message'].value;

  if (message) {
    // Message to server
    socket.emit('chat-message', message);
    e.target['message'].value = '';
    e.target['message'].focus();
  }
});

// Send message to chat
function sendToChat(message) {
  const div = document.createElement('div');
  div.classList.add('chat-message');
  div.innerHTML = `<p><strong class="text-white text-base mr-1">${message.username}</strong> <span class="text-gray-400">${message.time}</span></p>
  <p class="pr-2">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

function updateUsers(users) {
  onlineUsers.innerHTML = `
  ${users.map(user => `<li class="pb-1">${user.username}</li>`).join('')}
  `;
  onlineNumber.innerHTML = `<span>Online – ${users.length}</span>`;
}
