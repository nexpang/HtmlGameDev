const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const mysql = require("mysql2/promise");
const p = require("./private");
const connPool = mysql.createPool(p);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "db.html"));
});
app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dodge.html"));
});

io.on("connection", socket => {
    socket.on("savescore", async data => {
        let { name, score, msg } = data;
        let con = await connPool.getConnection();
        try {
            const sql = `INSERT INTO score_list(name, score, msg) VALUES (?,?,?)`;
            let result = await con.query(sql, [name, score, msg]);
            if (result[0].affectedRows == 1) { // affectedRows 영향을 받은 행
                socket.emit("msg", { msg: "저장 완료" });
            }
        } catch (e) {
            socket.emit("msg", { msg: "저장 실패" })
        }
    })
    socket.on("loadscore", async () => {
        //let { name, score, msg } = data;
        let con = await connPool.getConnection();
        try {
            const sql = `SELECT * FROM score_list ORDER BY score DESC LIMIT 0, 10`;
            let result = await con.query(sql);

            socket.emit("refreshscore", result[0]);

        } catch (e) {
            socket.emit("msg", { msg: "로드 실패" })
        }
    })
    socket.on("register", async data => {
        let { name, email, pass } = data;
        let con = await connPool.getConnection();
        try {
            const sql = `INSERT INTO users(name, email, password) VALUES (?,?,PASSWORD(?))`;
            let result = await con.query(sql, [name, email, pass]);
            if (result[0].affectedRows == 1) { // affectedRows 영향을 받은 행
                socket.emit("msg", { msg: "성공적으로 회원가입되었습니다." });
            }
        } catch (e) {
            socket.emit("msg", { msg: "회원가입 중 오류 발생" })
        }
    })
})

server.listen(12435, () => {
    console.log("서버가 12435 포트에서 구동중입니다")
})

// async function test(email, pass) {
//     let con = await connPool.getConnection(); //연결을 하나 가져온다.
//     let result = await con.query(
//         `SELECT email FROM users 
//         WHERE email = ? AND 
//         password = PASSWORD(?)`, [email, pass]);
//     if (result[0].length >= 1) {
//         console.log("로그인 성공");
//     } else {
//         console.log("로그인 실패");
//     }
//     con.release();
// }

// test("test1@gmail.com", "1234");