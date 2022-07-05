var pool;
var init = (p) => {
  console.log("employment.js init 호출됨.");
  pool = p;
};

var emplList = (callback) => {
  // 애로우패턴
  console.log("emplList 호출됨.");
  pool.getConnection(function (err, conn) {
    // 커넥션풀에서 연결객체를 가져옵니다.
    if (err) {
      // 에러가 있고,
      if (conn) {
        // 커넥션이 살아 있으면,
        conn.release(); // 반드시 해제해야 합니다. pool에 반납한다는 뜻.
      }
      callback(err, null);
      return;
    }

    console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
    var exec = conn.query(
      "SELECT * FROM EMPLOYMENT_LIST a, COMPANY b WHERE a.COM_ID = b.COM_ID",
      function (err, rows) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 sql : " + exec.sql);

        if (rows.length > 0) {
          callback(null, rows);
        } else {
          callback(err, null);
        }
      }
    );
  });
};

var employmentList = (req, res) => {
  console.log("/process/EmploymentList 호출됨.");
  res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
  var context;
  emplList(function (err, result) {
    console.log(res);
    context = { result: result };
    req.app.render("employmentList", context, function (err, html) {
      res.end(html);
    });
  });
};

module.exports.init = init;
module.exports.employmentList = employmentList;
