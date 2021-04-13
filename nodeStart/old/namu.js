const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

let titleId = process.argv[2] * 1;  //747269
let no = process.argv[3] * 1;       // 1
let no1 = process.argv[4] * 1;       // 1

for (let j = no; j <= no1; j++) {
    let uri = `https://comic.naver.com/webtoon/detail.nhn?titleId=${titleId}&no=${j}`
    request(uri, (err, res, body) => {
        let $ = cheerio.load(body);

        let list = $(".wt_viewer > img");

        fs.mkdirSync(titleId + "/" + j, { recursive: true });
        for (let i = 0; i < list.length; i++) {
            let src = list.eq(i).attr("src");
            download(src, `${i}.jpg`, j);
            console.log(src);
        }
    });
}

function download(src, filename, no) {
    let option = {
        method: "GET",
        uri: src,
        Headers: { "User-Agent": "Mozilla/5.0" },
        encoding: null
    };

    let fileStream = fs.createWriteStream(titleId + "/" + no + "/" + filename)
    request(option).pipe(fileStream);
}