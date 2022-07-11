var express = require("express"); // Express 모듈 불러오기
var http = require("http");
var path = require("path");
var pool = require("./database/db-config"); // db connection 가져오기

// 익스프레스 미들웨어 불러오기
var bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser");
var expressSession = require("express-session"); // session 미들웨어 불러오기

var app = express(); // 익스프레스 객체 생성

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
console.log("뷰 엔진이 ejs로 설정되었습니다.");

// 세션 설정
app.use(
  expressSession({
    secret: "mykey",
    resave: true,
    saveUninitialized: true,
  })
);

var emplRouter = require("./routers/employment");
var supportRouter = require("./routers/support");

// router.route("EmploymentList").get(employment.employmentList);
app.use("/employment", emplRouter); // 라우터 객체 등록
app.use("/support", supportRouter); // 라우터 객체 등록

http.createServer(app).listen(app.get("port"), function () {
  console.log("서버가 시작되었습니다. 포트 : " + app.get("port"));
});
