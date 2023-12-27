const WebSocket = require('ws');

const wss = new WebSocket.Server(
    { port: 3000 }, () => {
        console.log("ws startuje na porcie 3000")
    });

wss.on('connection', (ws, req) => {

    const clientip = req.socket.remoteAddress; //ip

    ws.on('message', (message) => {
        console.log('klient(' + clientip + "): ", message.toString());
        ws.send('serwer odsyła do klienta -> ' + message);
    });

});