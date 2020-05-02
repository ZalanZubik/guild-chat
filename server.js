const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const moment = require('moment');

let users = [];
const bot = 'Mr. Sparkles BOT';
const lobby = 'Guild Hall';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

io.on('connection', socket => {
  socket.on('user-join', username => {
    const user = {
      id: socket.id,
      username,
      channel: lobby
    }

    users.push(user);

    socket.join(user.channel);

    socket.emit('message', formatMessage(bot, `Welcome to ${user.channel}! Please select a channel.`));
    socket.broadcast.to(user.channel).emit('message', formatMessage(bot, `${user.username} has joined the chat.`));

    io.to(user.channel).emit('channel-users', {
      channel: user.channel,
      users
    });
  });

  socket.on('chat-message', message => {
    const user = getUser(socket.id);
    io.to(user.channel).emit('message', formatMessage(user.username, message));
  });

  socket.on('change-channel', newChannel => {
    const user = getUser(socket.id);
    if (user) {
      const prevChannel = user.channel;

      const userIndex = users.findIndex(user => user.id == socket.id);

      socket.leave(user.channel);

      users[userIndex].channel = newChannel;

      if (prevChannel !== lobby) {
        io.to(prevChannel).emit('channel-users', {
          channel: prevChannel,
          users: getChannelUsers(prevChannel)
        });
        io.to(prevChannel).emit('message', formatMessage(bot, `${user.username} has left the channel.`));
      }

      socket.join(newChannel);

      socket.emit('message', formatMessage(bot, `Joined to ${newChannel} channel.`));
      socket.broadcast.to(newChannel).emit('message', formatMessage(bot, `${user.username} has joined the channel.`));

      io.to(newChannel).emit('channel-users', {
        channel: newChannel,
        users: getChannelUsers(newChannel)
      });
    }
  })

  socket.on('disconnect', () => {
    // Remove the user from the users array
    const user = getUser(socket.id);
    users = [...users.filter(user => user.id !== socket.id)];
    if (user) {
      io.to(user.channel).emit('message', formatMessage(bot, `${user.username} has left the channel.`));
      io.to(lobby).emit('message', formatMessage(bot, `${user.username} has left the chat.`));
      io.to(user.channel).emit('channel-users', {
        channel: user.channel,
        users: getChannelUsers(user.channel)
      });
      io.to(lobby).emit('channel-users', {
        channel: lobby,
        users
      });
    }

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

function getChannelUsers(channel) {
  return users.filter(user => user.channel === channel);
}