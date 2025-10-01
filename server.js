// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from "public" folder
app.use(express.static('public'));

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

io.on('connection', (socket) => {
  socket.on('chat:send', (payload) => {
    if (!payload) return;

    const username = escapeHTML(payload.username || 'Anonymous');
    const text = escapeHTML((payload.text || '').slice(0, 1000));
    const time = new Date().toISOString();

    if (!text.trim()) return;

    io.emit('chat:message', { username, text, time });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Chat server running at http://localhost:${PORT}`);
});
