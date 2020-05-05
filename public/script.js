let socket = undefined;
const loginForm = document.getElementById('login-form');
const chatForm = document.getElementById('chat-form');
const login = document.getElementById('login');
const chat = document.getElementById('chat');
const chatMessages = document.querySelector('.chat-messages');
const onlineUsers = document.getElementById('users');
const onlineNumber = document.getElementById('online-number');
const channelName = document.getElementById('channel-name');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = e.target['name'].value;

  if (username) {
    // Connecting the socket
    socket = window.io();

    socket.emit('user-join', username);

    socket.on('channel-users', ({ channel, users }) => {
      updateUsers(users);
      updateChannelName(channel);
    });

    // Message from server
    socket.on('message', message => {
      sendToChat(message);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('clear-chat', () => {
      document.querySelector('.chat-messages').innerHTML = '';
      document.getElementById("message").classList.remove('disabled-input');
      document.getElementById("message").disabled = false;
      document.getElementById("emoji-btn").classList.remove('disabled-input');
      document.getElementById("emoji-btn").disabled = false;
      document.getElementById("message").focus();
    })

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
  div.innerHTML = `<p><strong class="text-white text-lg mr-1">${message.username}</strong> <span class="text-gray-400">${message.time}</span></p>
  <p class="pr-2 text-lg">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

function updateUsers(users) {
  onlineUsers.innerHTML = `
  ${users.map(user => `<li class="pb-1">${user.username}</li>`).join('')}
  `;
  onlineNumber.innerHTML = `<span class="text-3xl">Online – ${users.length}</span>`;
}

function updateChannelName(channel) {
  channelName.innerText = channel;
};

function changeChannel() {
  const newChannel = event.target.value;
  socket.emit('change-channel', newChannel);
  document.getElementById("message").focus();
}

// Emoji
const emojiBtn = document.getElementById('emoji-btn');
const picker = new EmojiButton({
  theme: 'dark',
  recentsCount: '10',
  emojisPerRow: '6',
  emojiSize: '1.5rem'
});

picker.on('emoji', emoji => {
  document.getElementById('message').value += emoji;
});

emojiBtn.addEventListener('click', () => {
  picker.togglePicker(emojiBtn);
});
