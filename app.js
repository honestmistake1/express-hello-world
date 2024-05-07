const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Game state
let board = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  ['--', '--', '--', '--', '--', '--', '--', '--'],
  ['--', '--', '--', '--', '--', '--', '--', '--'],
  ['--', '--', '--', '--', '--', '--', '--', '--'],
  ['--', '--', '--', '--', '--', '--', '--', '--'],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the initial board state
  socket.emit('updateBoard', board);

  // Handle piece moves
  socket.on('movePiece', (source, target) => {
    const [sourceRow, sourceCol] = source.split('');
    const [targetRow, targetCol] = target.split('');

    // Move the piece
    board[targetRow][targetCol] = board[sourceRow][sourceCol];
    board[sourceRow][sourceCol] = '--';

    // Broadcast the updated board to all connected clients
    io.emit('updateBoard', board);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
