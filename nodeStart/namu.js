const request = require("request");
const cheerio = require("cheerio");

let titleId = process.argv[2];  //747269
let no = process.argv[3];       // 1

let uri = `https://comic.naver.com/webtoon/detail.nhn?titleId=${titleId}&no=${no}`
request(uri, (err, res, body) => {
    let $ = cheerio.load(body);

    let list = $(".wt_viewer > img");

    for (let i = 0; i < list.length; i++) {
        let src = list.eq(i).attr("src");
        console.log(src);
    }
});