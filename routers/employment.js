var express = require("express");
var router = express.Router();
var pool = require("../database/db-config");

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

var empl_detail = (empl_id, callback) => {
  console.log("emplList 호출됨.");
  pool.getConnection(function (err, conn) {
    var exec = conn.query(
      "SELECT * FROM EMPLOYMENT_LIST a, COMPANY b WHERE a.COM_ID = b.COM_ID AND a.EMPLOYMENT_ID = ?",
      empl_id,
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

var add_employment = (
  com_id,
  com_name,
  emp_position,
  emp_money,
  emp_content,
  use_tech,
  com_country,
  com_region,
  callback
) => {
  console.log("add_employment 호출됨.");
  // 커넥션 풀에서 연결 객체를 가져옵니다.
  pool.getConnection(function (err, conn) {
    if (err) {
      if (conn) {
        conn.release(); // 반드시 해제해야함.
      }

      callback(err, null);
    }
    console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

    // ?를 넣으면 배열로 받는다.
    var sql =
      "INSERT INTO COMPANY (com_id, com_name, com_country,com_region) VALUES (?,?,?,?)";
    var param = [com_id, com_name, com_country, com_region];

    var sql2 =
      "INSERT INTO EMPLOYMENT_LIST (com_id, emp_position, emp_money, emp_content,use_tech) VALUES (?,?,?,?,?)";
    var param2 = [com_id, emp_position, emp_money, emp_content, use_tech];

    console.log("sql : " + sql);
    console.log("sql : " + sql2);
    // sql문을 실행합니다.
    var exec = conn.query(sql, param, function (err, result) {
      if (err) throw err;
      console.log("행추가 성공");
      console.log("sql : " + exec);
      console.log("result : " + result);
    });
    conn.query(sql2, param2, function (err, result) {
      if (err) throw err;
      console.log("행추가 성공2");
      console.log("sql : " + exec);
      console.log("result : " + result);
      callback(null, result);
    });
  });
};

var update_employment = function (
  com_id,
  com_name,
  com_country,
  com_region,
  emp_position,
  emp_money,
  use_tech,
  empl_id,
  emp_content,
  callback
) {
  console.log("update_employment 호출됨.");

  pool.getConnection(function (err, conn) {
    if (err) {
      if (conn) {
        conn.release(); // 반드시 해제해야함.
      }

      callback(err, null);
    }
    console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

    // ?를 넣으면 배열로 받는다.
    var sql =
      "UPDATE COMPANY SET com_name = ?, com_country = ?, com_region = ? WHERE com_id = ?";
    var param = [com_name, com_country, com_region, com_id];

    var sql2 =
      "UPDATE EMPLOYMENT_LIST SET EMP_POSITION = ?, EMP_MONEY = ?, EMP_CONTENT = ?, USE_TECH = ? WHERE EMPLOYMENT_ID = ?";
    var param2 = [emp_position, emp_money, emp_content, use_tech, empl_id];

    conn.query(sql, param, function (err, result) {
      if (err) throw err;
      console.log("행추가 성공");
      console.log("result : " + result);
    });

    conn.query(sql2, param2, function (err, result) {
      if (err) throw err;
      console.log("행추가 성공2");
      console.log("result : " + result);
      callback(null, result);
    });
  });
};

router.get("/employments", (req, res) => {
  console.log("/process/EmploymentList 호출됨.");
  res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
  var context, com_id;
  emplList(function (err, result) {
    console.log(result);
    context = { result: result };
    req.app.render("employmentList", context, function (err, html) {
      res.end(html);
    });
  });
});

router.get("/employment/:empl_id", (req, res) => {
  var empl_id = req.params.empl_id;
  var context;
  console.log("empl_id : " + empl_id);
  empl_detail(empl_id, function (err, result) {
    console.log("result : " + result);
    context = { result: result };
    req.app.render("employment_list", context, function (err, html) {
      res.end(html);
    });
  });
});

router.post("/addEmploymentList", (req, res) => {
  console.log("addEmploymentList 호출됨.");
  var com_id = req.body.com_id;
  var com_name = req.body.com_name;
  var com_country = req.body.com_country;
  var com_region = req.body.com_region;
  var emp_position = req.body.emp_position;
  var emp_momey = req.body.emp_momey;
  var use_tech = req.body.use_tech;
  var emp_content = req.body.emp_content;

  // pool 객체가 초기화 된 경우, add_employment함수를 호출하여 채용공고 추가
  if (pool) {
    add_employment(
      com_id,
      com_name,
      com_country,
      com_region,
      emp_position,
      emp_momey,
      use_tech,
      emp_content,
      function (err, addEmployment) {
        res.app.render("add_empl_success", function (err, html) {
          res.end(html);
        });
      }
    );
  }
});

// 채용공고 수정
router.post("/updateEmplList/:employment_id", (req, res) => {
  console.log("updateEmplList 호출됨.");
  var com_id = req.body.com_id;
  var com_name = req.body.com_name;
  var com_country = req.body.com_country;
  var com_region = req.body.com_region;
  var emp_position = req.body.emp_position;
  var emp_money = req.body.emp_money;
  var use_tech = req.body.use_tech;
  var emp_content = req.body.emp_content;
  var empl_id = req.params.employment_id;

  if (pool) {
    update_employment(
      com_id,
      com_name,
      com_country,
      com_region,
      emp_position,
      emp_money,
      use_tech,
      empl_id,
      emp_content,
      function (err, addEmployment) {
        res.app.render("add_empl_success", function (err, html) {
          res.end(html);
        });
      }
    );
  }
});

module.exports = router;
