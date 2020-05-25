# Guild Chat

## Used

- Socket.io
- Node.js
- Express
- Moment.js
- Tailwind CSS
- CSS
- Emoji Button
- Nodemon

## About

Guild Chat is a real-time chat application for Guild Wars 2 players. I did not use any frontend framework, only vanilla javascript. Socket.IO enables realtime, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.js.

Users enter to the chat lobby after login, where they are not allowed to chat. A chatbot welcome them, show the chat rules and ask them to choose a channel to start chatting. When a user joins/leaves the chat, a message shows up in the lobby for everyone. In the lobby you can see all online users, but when you join a channel you can see only those who are in the same channel. You can switch between channels, but all the previous messages won't be visible since messages are not saved in a database. There is an emoji button where you can find lots of emojis.

The website is hosted by Heroku. [Check here!](https://guild-chat-gw2.herokuapp.com/)
