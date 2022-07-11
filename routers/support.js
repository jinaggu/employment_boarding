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

router.get("/supportUser/:employment_id", (req, res) => {
  console.log("supportUser 호출됨.");
  var userId = req.session.user.id;
  var empl_id = req.params.employment_id;
  supportUser(userId, empl_id, function (err, result) {
    res.redirect("/main.html");
  });
});

module.exports = router;
