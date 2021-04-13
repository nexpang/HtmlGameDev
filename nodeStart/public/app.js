const loginIdInput = document.querySelector("#userId");
const loginPage = document.querySelector(".inner-box:nth-child(1)");
const chatPage = document.querySelector(".inner-box:nth-child(2)");
const btnLogin = document.querySelector("#btnLogin");

const msgInput = document.querySelector("#msgInput");
const btnSend = document.querySelector("#btnSend");
const chatList = document.querySelector("#chatList");

let nickName = "";
let socket = null;

btnLogin.addEventListener("click", e => {
    let name = loginIdInput.value;
    if (name.trim() === "") {
        alert("이름은 공백일 수 없습니다.");
        return;
    }
    nickName = name;
    loginPage.classList.add("left");
    chatPage.classList.remove("right");
    socketConnect(); // 소켓 연결 함수 실행하기
})

function socketConnect() {
    socket = io();
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
    })
    btnSend.addEventListener("click", e => {
        if (msgInput.value.trim() === "") return;
        let msg = msgInput.value;
        msgInput.value = "";
        socket.emit("chat", { nickName, msg });
    })
}