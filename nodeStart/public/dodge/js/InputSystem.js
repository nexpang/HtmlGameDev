class InputSystem{
    static instance = new this();
    static getKey(code) {
        return InputSystem.instance.getKeycode(code);
    }

    constructor(){
        this.keyArr = [];
        document.addEventListener("keydown", e => {
            this.keyArr[e.keyCode] = true;
        });
        document.addEventListener("keyup", e => {
            this.keyArr[e.keyCode] = false;
        });
    }

    getKeycode(code){
        return this.keyArr[code];
    }
}
// 이렇게 만들어두면 어디서든 InputSystem.getKey(코드) 로 호출하는게 가능하다
// 별도의 인스턴스 없이 사용하는 싱글턴 기법임. 이대로 사용해도 되고 너희들에게 익숙한대로 써도 돼.