const WebSocket = require('ws');

const wss = new WebSocket.Server(
    { port: 3000 }, () => {
        console.log("ws startuje na porcie 3000")
    });

const players = []
const obstacles = []
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
            id = null
            for (let i = 0; i < players.length; i++) {
                if (players[i] && !players[i].active) {
                    id = i
                    players[i].active = true
                    status = "reciver"
                    break
                }
            }
            ws.send(JSON.stringify({ status: "init", id: id, players: players, obstacles: obstacles }))
        } else if (status == "sender") {
            let decoded = JSON.parse(message)
            players[id].x = decoded.x
            players[id].y = decoded.y
            players[id].z = decoded.z
            players[id].color = color
        } else if (status == "reciver") {
            let decoded = JSON.parse(message)
            console.log(decoded)
            if (decoded.status == "add") {
                obstacles.push(decoded.obstacle)
            }
            if (decoded.status == "remove") {
                obstacles.splice(obstacles.indexOf(decoded.obstacle), 1)
            }
            ws.send(JSON.stringify({ status: "data", players: players, obstacles: obstacles }))
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