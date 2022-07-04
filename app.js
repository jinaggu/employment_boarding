var express = require("express"); // Express 모듈 불러오기
var http = require("http");
var pool = require("./database/db-config"); // db connection 가져오기
// 익스프레스 미들웨어 불러오기
var bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser");

var app = express(); // 익스프레스 객체 생성

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

http.createServer(app).listen(app.get("port"), function () {
  console.log("서버가 시작되었습니다. 포트 : " + app.get("port"));
});
