const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const moment = require('moment');

let users = [];
const bot = 'Mr. Sparkles BOT';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

io.on('connection', socket => {
  socket.on('user-join', (username, channel) => {
    const user = {
      id: socket.id,
      username,
      channel
    }

    // Add the user to the users array
    users.push(user);

    // Welcome message to a user
    socket.emit('message', formatMessage(bot, 'Welcome to Guild Chat!'));

    socket.broadcast.emit('message', formatMessage(bot, `${user.username} joined the chat.`));

    io.emit('get-users', users);
  });

  // Send message to chat
  socket.on('chat-message', message => {
    const user = getUser(socket.id);
    io.emit('message', formatMessage(user.username, message));
  });

  socket.on('disconnect', () => {
    // Remove the user from the users array
    const user = getUser(socket.id);
    users = [...users.filter(user => user.id !== socket.id)];
    if (user) {
      io.emit('message', formatMessage(bot, `${user.username} left the chat.`));
    }
    io.emit('get-users', users);
  });
});

function formatMessage(username, message) {
  return {
    username,
    text: message,
    time: moment().calendar()
  }
}

function getUser(id) {
  return users.find(user => user.id === id);
}