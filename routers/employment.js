var employmentList = (req, res) => {
  console.log("/process/EmploymentList 호출됨.");

  res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
  var context = { employ: "employ" };

  req.app.render("employmentList", context, function (err, html) {
    res.end(html);
  });
};

module.exports.employmentList = employmentList;
