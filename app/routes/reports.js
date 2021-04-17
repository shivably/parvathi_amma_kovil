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

  app.post('/api/reports/expense', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    if(data.type_id){
      processData(res, "SELECT * FROM Expense where type_id = "+ data.type_id +" and dor between '"+ data.fromdate + "' and '"+ data.todate + "'");
    } else {
      processData(res, "SELECT * FROM Expense where dor between '"+ data.fromdate + "' and '"+ data.todate + "'");
    }
  });

  app.post('/api/reports/total_expense', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    processData(res, "SELECT sum(value) as TotalExpense FROM Expense where dor between '"+ data.fromdate + "' and '"+ data.todate + "'");
  });

  app.post('/api/reports/total_donation', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    //processData(res, "SELECT sum(value) as TotalDonation FROM DonationDetails where dor between '"+ data.fromdate + "' and '"+ data.todate + "'");
    processData(res, "SELECT sum(value) as TotalDonation FROM DonationDetails");
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


