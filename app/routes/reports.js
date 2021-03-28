module.exports = function (app, db) {
  app.get('/api/reports/:member_id/:income_type_id', (req, res) => {
    var member_id = req.params.member_id;
    var income_type_id = req.params.income_type_id;
    console.dir(req)
    processData(res, "SELECT * FROM Income where member_id = " + member_id + " and income_type_id = " + income_type_id);
  });

  app.get('/api/reports/id/', (req, res) => {
    var id = req.params.id;
    console.dir(req)
    processData(res, "SELECT * FROM Income where id = " + id);
  });

  app.post('/api/reports/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    processData(res, "SELECT * FROM Income where donor_name like '%" + data.donor_name + "%'");
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
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (data[0])
      res.send(data);
    else {
      res.status(404).send("Income not found");
    }
  }
};


