let socket = io();
socket.on('Random Number is', (msg) => {
  console.log('Random number: ' + msg);
});
