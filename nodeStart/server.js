const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const app = new express();
const server = http.createServer(app); //미안 서버야...사과할께..
const path = require('path');

const State = require('./State');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});
const io = socketio(server); //이렇게하면 서버에 소켓이 붙는다.
//io는 서버의 모든 소켓을 관리하는 객체
//on은 이벤트를 연결해주는 것으로 addEventListener과 동일

let roomList = [

];
let conSocket = {};

io.on("connection", socket => {
    console.log(`${socket.id} is connected`);
    socket.state = State.IN_LOGIN;

    socket.on("disconnecting", async () => {
        console.log(`${socket.id} is disconnected`);


        await [...socket.rooms].filter(x => x != socket.id).forEach(async r => {
            let targetRoom = roomList.find(y => y.roomNo === r);
            targetRoom.num--;
            if (targetRoom.num === 0) {
                let idx = roomList.findIndex(x => x.roomNo === r);
                roomList.splice(idx, 1);
            } else {
                let userList = [...await io.in(targetRoom.roomNo).allSockets()];
                console.log(userList)
                userList = userList.map(id => ({ id, nickName: conSocket[id].nickName }));
                io.to(targetRoom.roomNo).emit("user-refresh", { userList });
            }
        });

        delete conSocket[socket.id];
    });

    socket.on("login", data => {
        socket.nickName = data.nickName;
        socket.state = State.IN_LOBBY; // 로비로 진입

        conSocket[socket.id] = socket;
        socket.emit("login", { roomList });

        //console.log(conSocket);
    });

    socket.on("enter-room", async data => {
        if (socket.state !== State.IN_LOBBY) {
            socket.emit("bad-access", { msg: "잘못된 접근입니다" });
            return;
        }
        const { roomNo } = data;
        let targetRoom = roomList.find(x => x.roomNo === roomNo);
        if (targetRoom === undefined) {
            socket.emit("bad-access", { msg: "존재하지 않는 방입니다" });
            return;
        }
        if (targetRoom.num >= targetRoom.maxNumber) {
            socket.emit("bad-access", { msg: "방이 가득 찼습니다" });
            return;
        }

        socket.join(roomNo); // 방에 들어가짐

        let userList = [...await io.in(roomNo).allSockets()];

        // let dataList = []
        // userList.forEach(x => {
        //     const id = x;
        //     const nickName = conSocket[socket.id].nickName;
        //     dataList.push({ id, nickName })
        // });
        // userList = dataList;
        userList = userList.map(id => ({ id, nickName: conSocket[id].nickName }));

        // let userList = []; // 해당 방에 존재하는 모든 유저를 넣어준다.
        // Pro
        socket.emit("enter-room");
        io.to(roomNo).emit("user-refresh", { userList });
        socket.state = State.IN_CHAT;
        targetRoom.num++;
    });

    socket.on("chat", data => {
        if (socket.state !== State.IN_CHAT) {
            socket.emit("bad-access", { msg: "잘못된 접근입니다." });
            return;
        }
        let { msg, nickName } = data;

        let room = socket.rooms;
        // 내 아이디와 다른 방번호 가져온다.
        [...room].filter(x => x != socket.id).forEach(r => {
            io.to(r).emit("chat", { sender: socket.id, msg, nickName });
        });
    });

    socket.on("create-room", async data => {
        if (socket.state !== State.IN_LOBBY) {
            socket.emit("bad-access", { msg: "잘못된 접근입니다." });
            return;
        }
        const { title, maxNumber } = data;
        const roomNo = 1
        if (roomList.length > 0) {
            roomNo = Math.max(...roomList.map(x => x.roomNo)) + 1;
        }

        roomList.push({ title, roomNo, num: 1, maxNumber });
        socket.join(roomNo);

        let userList = [{ id: socket.id, nickName: socket.nickName }];
        socket.state = State.IN_CHAT;
        socket.emit("enter-room");
        io.to(roomNo).emit("user-refresh", { userList });
    })
});

server.listen(15454, () => {
    console.log("서버가 15454포트에서 돌아가고 있습니다.");
});