const fs = require('fs');
const express = require('express')
const app = express()
const server = require('https').createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/alpha.tyze.me/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/alpha.tyze.me/cert.pem')
}, app)
const io = require('socket.io').listen(server)
const path = require('path')

const { PeerServer } = require('peer');

const peerServer = PeerServer({
    port: 9000,
    path: '/myapp',
    proxied: true,
    ssl: {
        key: fs.readFileSync('/etc/letsencrypt/live/alpha.tyze.me/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/alpha.tyze.me/cert.pem')
    }
});

server.listen(8080, "0.0.0.0")

let nickname = {}
let colors = {}
let chats = []

function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function getNickname(userId) {
    if (nickname[userId] === undefined) {
        nickname[userId] = "User" + Math.round(Math.random() * 100000)
    }
    return nickname[userId];
}

function getColor(userId) {
    if (colors[userId] === undefined) {
        colors[userId] = getRandomRgb()
    }
    return colors[userId]
}


let streamer = { socketId: "", peerId: "", isOnline: false }
io.on('connection', (socket) => {
    console.log('connect from ' + socket.id)
    if (streamer.isOnline)
        socket.emit('is-online', streamer.peerId)
    socket.on('chat-message', (msg) => {
        let chat = {
            author: getNickname(socket.id),
            color: getColor(socket.id),
            text: msg
        }
        chats.push(chat)
        let { author, color, text } = chat
        io.emit('new-chat-message', author, color, text)
    });

    socket.on('join-stream', (peerId) => {
        if (streamer.isOnline)
            io.to(streamer.socketId).emit('join-stream', peerId);
    });

    socket.on('start-stream', (peerId) => {
        streamer.socketId = socket.id;
        streamer.peerId = peerId;
        streamer.isOnline = true;
        io.emit('is-online', peerId)
        console.log('開始直播 ' + JSON.stringify(streamer))
    });

    socket.on('disconnect', () => {
        console.log('disconnect from ' + socket.id)
        if (socket.id === streamer.socketId) {
            streamer.isOnline = false;
        }
    })
});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('op')
})