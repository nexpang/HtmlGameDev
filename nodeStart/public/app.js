const loginIdInput = document.querySelector("#userId");
const loginPage = document.querySelector(".inner-box:nth-child(1)");
const lobbyPage = document.querySelector(".inner-box:nth-child(2)");
const chatPage = document.querySelector(".inner-box:nth-child(3)");
const btnLogin = document.querySelector("#btnLogin");

const msgInput = document.querySelector("#msgInput");
const btnSend = document.querySelector("#btnSend");
const chatList = document.querySelector("#chatList"); //채팅을 집어넣는거

const popup = document.querySelector("#popup");
const roomTitleInput = document.querySelector("#roomTitle");
const roomMaxnumberInput = document.querySelector("#roomMaxnumber");

let nickName = "";
let socket = null;
let roomList = []; //채팅방 리스트고
let userList = []; //해당 채팅방에 있는 유저들의 리스트다

document.querySelector("#btnCreateRoom").addEventListener("click", e => {
    popup.classList.add("on");
})
document.querySelector("#btnCreate").addEventListener("click", e => {
    let title = roomTitleInput.value;
    let maxNumber = roomMaxnumberInput.value * 1;
    if (title.trim() === "") {
        Swal.fire("방이름은 공백일 수 없습니다");
        return;
    }
    socket.emit("create-room", { title, maxNumber })
    popup.classList.remove("on");
})

btnLogin.addEventListener("click", e => {
    let name = loginIdInput.value;
    if (name.trim() === "") {
        alert("이름은 공백일 수 없습니다.");
        return;
    }
    nickName = name;
    socketConnect(); //소켓 연결 함수 실행하기
});

function socketConnect() {
    socket = io(); //소켓 연결 시작

    socket.emit("login", { nickName });

    socket.on("login", data => {
        roomList = data.roomList;
        loginPage.classList.add("left");
        lobbyPage.classList.remove("right");  //로비페이지로 진행
        makeRoomData(roomList); //룸리스트를 기반으로 html을 만들어준다.
        //console.log(roomList);
    });

    socket.on("enter-room", data => {

        lobbyPage.classList.add("left");
        chatPage.classList.remove("right");
    });

    socket.on("user-refresh", data => {
        userList = data.userList;
        makeUserData(userList);
    });

    socket.on("chat", data => {
        let li = document.createElement("li");
        li.classList.add("chat-item");
        li.innerHTML = `<div class="inner-data">
                            <span class="sender">${data.nickName}</span>
                            <span class="msg">${data.msg}</span>
                        </div>`;
        if (data.sender === socket.id) {
            li.classList.add("my");
        }
        chatList.appendChild(li);
        chatList.scrollTop = chatList.scrollHeight;
    });

    socket.on("bad-access", data => {
        Swal.fire(data.msg);
        return;
    });

    //메시지 전송버튼 눌렀을때
    btnSend.addEventListener("click", e => {
        if (msgInput.value.trim() === "") return;
        let msg = msgInput.value;
        msgInput.value = "";//전송된 데이터는 공백으로 초기화
        socket.emit("chat", { nickName, msg });
    });
}
const userListDom = document.querySelector("#connectionList");

function makeUserData(userList) {
    userListDom.innerHTML = "";

    userList.forEach(x => {
        let li = document.createElement("li");
        li.innerHTML = x.nickName;
        userListDom.appendChild(li);
    });
}
const roomListDom = document.querySelector("#roomList");


function makeRoomData(roomList) {
    roomListDom.innerHTML = "";

    roomList.forEach(x => {
        let li = document.createElement("li");
        li.innerHTML = `<span class="title">
                            ${x.title}
                        </span>
                        <span class="number">
                            ${x.num}/${x.maxNumber}
                        </span>`;
        li.classList.add("room");
        roomListDom.appendChild(li);

        li.addEventListener("click", e => {
            socket.emit("enter-room", { roomNo: x.roomNo });
        });
    });
}

// loginIdInput.value = "테스트";
// document.querySelector("#btnLogin").click();