const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.43.40:3000');
ws.onopen = () => {
    ws.send('reciver');
}

ws.onmessage = (e) => {
    console.log(e.data);
    setTimeout(function () {
        ws.send('reciver');
    }, 1000);
}

ws.onerror = (e) => {
    console.log(e.message);
};

ws.onclose = (e) => {
    console.log(e.code, e.reason);
};