var express = require("express");
var router = express.Router();
var pool = require("../database/db-config");

var supportUser = function (userId, empl_id, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      if (conn) {
        conn.release(); // 반드시 해제해야함.
      }
      callback(err, null);
    }
    console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

    var sql =
      "INSERT INTO SUPPORT_LIST (USER_ID, EMPLOYMENT_ID) VALUES( ? , ? )";
    var param = [userId, empl_id];

    conn.query(sql, param, function (err, result) {
      if (err) throw err;
      console.log("행추가 성공");
      console.log("result : " + result);
      callback(null, result);
    });
  });
};

// 지원시 중복지원 체크
var userIdChk = (userId, empl_id, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      if (conn) {
        conn.release(); // 반드시 해제해야함.
      }
      callback(err, null);
    }
    console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
    var sql =
      "SELECT * FROM SUPPORT_LIST WHERE USER_ID = ? AND EMPLOYMENT_ID = ?";
    var param = [userId, empl_id];

    var exec = conn.query(sql, param, function (err, rows) {
      console.log("실행 대상 sql : " + exec.sql);
      if (err) throw err;
      if (rows.length > 0) {
        callback(false);
      } else {
        callback(true);
      }
    });
  });
};

var tta = function (userId, empl_id) {
  var ta = userId;
  var empl = empl_id;
  return "tata";
};

router.get("/supportUser/:employment_id", (req, res) => {
  console.log("supportUser 호출됨.");
  var userId = req.session.user.id;
  var empl_id = req.params.employment_id;
  userIdChk(userId, empl_id, function (chk) {
    if (chk) {
      var context = { result: "지원되었습니다." };
      supportUser(userId, empl_id, function (err, result) {
        req.app.render("empl_success_message", context, function (err, html) {
          res.end(html);
        });
      });
    } else {
      res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
      res.write("<script>alert('중복지원하셨습니다.')</script>");
      res.write("<script>window.location='/employment/employments'</script>");
    }
  });
});

module.exports = router;
