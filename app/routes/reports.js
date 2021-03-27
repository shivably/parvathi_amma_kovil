const { jsPDF } = require("jspdf");
var fs = require("fs");


module.exports = function (app, db) {
  app.get('/api/reports/:member_id/:income_type_id', (req, res) => {
    var member_id = req.params.member_id;
    var income_type_id = req.params.income_type_id;
    console.dir(req.params)
    processData(res, "SELECT * FROM Income where member_id = " + member_id + " and income_type_id = " + income_type_id);
  });

  function processData(res, sql) {
    db.serialize(function () {
      db.all(sql,
        function (err, rows) {
          if (err) {
            console.error(err);
            res.status(500).send(err);
          }
          else
            sendData(res, rows, err);
        });
    });
  }

  function sendData(res, data, err) {
    console.dir(data)
    var doc = new jsPDF('p', 'pt', 'a4', true);
    data.forEach(function (row) {
      console.log('111111')
      Object.entries(row).forEach(([k, v]) => {
        console.log(`${k} ${v}`); // "a 5", "b 7", "c 9"
        doc.cell(10, 50, 120, 50, k, v);
      });
    });

    doc.save("a4.pdf");
    res.setHeader("Access-Control-Allow-Origin", "*");
    var file = fs.createReadStream('a4.pdf');
    var stat = fs.statSync('a4.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    file.pipe(res);
  }
};


