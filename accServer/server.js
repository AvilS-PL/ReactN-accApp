const WebSocket = require('ws');

const wss = new WebSocket.Server(
    { port: 3000 }, () => {
        console.log("ws startuje na porcie 3000")
    });

const players = []
const colors = [
    "brown",
    "aqua",
    "gold",
    "greenyellow",
    "orangered",
    "teal"
]

wss.on('connection', (ws, req) => {

    const clientip = req.socket.remoteAddress;
    let id = null
    let status = null
    let color = null

    ws.on('message', (message) => {
        if (message.toString() == "sender") {
            id = players.length
            for (let i = 0; i < players.length; i++) {
                if (players[i] == null) {
                    id = i
                    break
                }
            }
            console.log(id)
            color = colors[Math.floor(Math.random() * colors.length)]
            for (let i = 0; i < colors.length; i++) {
                if (color == colors[i]) {
                    colors.splice(i, 1)
                    break
                }
            }
            players[id] = {
                active: false
            }
            status = "sender"
            ws.send(color)
        } else if (message.toString() == "reciver") {
            status = "reciver"
            ws.send(JSON.stringify(players))
        } else if (status == "sender") {
            let decoded = JSON.parse(message)
            players[id] = {
                color: color,
                x: decoded.x,
                y: decoded.y,
                z: decoded.z,
                active: players[id].active
            }
        } else if (status == "reciver") {
            color = message.toString()
            id = null
            for (let i = 0; i < players.length; i++) {
                if (players[i] && players[i].color == color && !players[i].active) {
                    players[i].active = true
                    id = i
                    break
                }
            }
            if (id == null) {
                ws.send(id)
            } else {
                ws.send(id)
            }
        }
    });

    ws.on('close', (e) => {
        console.log("left")
        if (status == "sender") {
            colors.push(color)
            players[id] = null
        } else if (status == "reciver") {
            if (players[id]) {
                players[id].active = false
            }
        }
    });

});