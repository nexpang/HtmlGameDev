let saveBtn = document.querySelector("#btnSave");
let loadBtn = document.querySelector("#btnLoad");
let OpenBtn = document.querySelector("#btnOpen");
let CloseBtn = document.querySelector("#btnClose");

let nameInput = document.querySelector("#nameInput");
let scoreInput = document.querySelector("#scoreInput");
let msgInput = document.querySelector("#msgInput");

let rl = document.querySelector("#rankList")

let p = document.querySelector("#popup");

OpenBtn.addEventListener("click", function(){
    p.classList.add("on");
});

CloseBtn.addEventListener("click", function(){
    p.classList.remove("on");
});

saveBtn.addEventListener("click", function(){
    let list = localStorage.getItem("list");

    if(list == null)
        list = [];
    else
        list = JSON.parse(list);

    let obj = {
        name : nameInput.value,
        score : scoreInput.value * 1,
        msg : msgInput.value
    }
    list.push(obj);
    localStorage.setItem("list", JSON.stringify(list));

    nameInput.value = "";
    scoreInput.value = "";
    msgInput.value = "";
});

loadBtn.addEventListener("click", function(){
    rl.innerHTML = "";

    let list = localStorage.getItem("list");

    if(list == null)
        list = [];
    else
        list = JSON.parse(list);
        
    for(let i = 0; i< list.length; i++){
            //console.log(list[i]);
            let div = document.createElement("div");
            div.innerHTML = `
                    <span>이름 : ${list[i].name}</span><br>
                    <span>점수 : ${list[i].score}</span><br>
                    <span>남길말 : ${list[i].msg}</span>`;
            rl.appendChild(div);
    }
});