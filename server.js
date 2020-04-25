const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', socket => {
  socket.on('user-join', (name, channel) => {
    const user = {
      id: socket.id,
      name,
      channel
    }

    // Add the user to the users array
    users.push(user);

    console.log(`${name} joined the ${channel} channel.`);
    console.log(users);
  });

  socket.on('chat-message', message => {
    console.log(message);
  });

  socket.on('disconnect', () => {
    // Remove the user from the users array
    users = [...users.filter(user => user.id !== socket.id)];
    console.log(socket.id, 'disconnected.');
  });
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));