const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.43.40:3000');
ws.onopen = () => {
    ws.send('sender');
}

ws.onmessage = (e) => {
    console.log(e.data);
    setTimeout(function () {
        ws.send(JSON.stringify({ x: 0.5, y: 0.5, z: 0.5 }));
        // ws.close();
    }, 1000);
}

ws.onerror = (e) => {
    console.log(e.message);
};

ws.onclose = (e) => {
    console.log(e.code, e.reason);
};