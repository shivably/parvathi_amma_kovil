module.exports = function (app, db) {
  // Load products by ID: http://localhost:4300/api/product/id/$id
  // example: http://localhost:4300/api/product/id/15
  app.get('/api/donation_details/id/:id', (req, res) => {
    processData(res, "SELECT * FROM DonationDetails where id == " + req.params.id);
  });

  app.get('/api/donation_type/', (req, res) => {
    processData(res, "SELECT * FROM DonationType");
  });

  app.get('/api/donor/id/:id', (req, res) => {
    processData(res, "SELECT * FROM Donor where id == " + req.params.id);
  });

  app.get('/api/receipt/member_id/:member_id/', (req, res) => {
    processData(res, "SELECT * FROM Donor where member_id == " + req.params.member_id);
  });

  // Load all products: http://localhost:4300/api/product/
  app.get('/api/donor', (req, res) => {
    processData(res, "SELECT * FROM Donor");
  });

  app.get('/api/ayyan_donation_type', (req, res) => {
    processData(res, "SELECT * FROM DonationType where kovil_name = 'Ayyan Kovil'");
  });

  app.get('/api/parvathiamman_donation_type', (req, res) => {
    processData(res, "SELECT * FROM DonationType where kovil_name = 'Parvathiamman Kovil'");
  });

  app.post('/api/receipt', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    if(data.member_id){
      processData(res, "SELECT * FROM Donor,DonationDetails where member_id == " + data.member_id +" and donor.id=donationdetails.receipt_id and donor.date between '"+ data.from_date + "' and '"+ data.to_date + "'");
    }else{
      processData(res, "SELECT * FROM Donor,DonationDetails where name like '%" + data.name + "%' and donor.id=donationdetails.receipt_id and donor.date between '"+ data.from_date + "' and '"+ data.to_date + "'");
    }
  });

  app.get('/api/receipt/id/:id', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    processData(res, "SELECT * FROM Donor where name id =" + req.params.id);
  });

  // Load all products: http://localhost:4300/api/product/
  app.get('/api/donation_details', (req, res) => {
    processData(res, "SELECT * FROM DonationDetails");
  });

  app.get('/api/donation_details/receipt_id/:receipt_id', (req, res) => {
    processData(res, "SELECT * FROM DonationDetails where receipt_id =" + req.params.receipt_id);
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
      res.status(404).send("DonationDetails not found");
    }
  }

  app.post('/api/donation_details/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;

    if ((data.constructor === Array))
      processDonationDetails(req, res, db);
    else
      processDonationDetail(req, res, db);
  });

  app.post('/api/donor/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;

    if ((data.constructor === Array))
      processDonors(req, res, db);
    else
      processDonor(req, res, db);
  });

  app.put('/api/donation_details/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    var data = req.body;

    if ((data.constructor === Array))
      editMembers(req, res, db);
    else
      editMember(req, res, db);
  });
};

function processDonationDetails(req, res, db) {
  var values = []
  var values2 = []

  var receipt_id;
  for (var prod of req.body) {
    receipt_id = prod.receipt_id
    values.push([prod.receipt_id, prod.donation_type, prod.unit_value, prod.quantity, prod.value]);
    values2.push(prod.receipt_id, prod.donation_type, prod.unit_value, prod.quantity, prod.value);

  }
  bulkinsertDonationDetail(receipt_id, values, values2, res, db);
}

function processDonationDetail(req, res, db) {
  //validateRequest(req, res);
  insertDonationDetail(req.body, res, db);
}

function processDonors(req, res, db) {
  for (var prod of req.body) {
    insertDonor(prod, res, db);
  }
}

function processDonor(req, res, db) {
  //validateRequest(req, res);
  insertDonor(req.body, res, db);
}

function insertDonor(income, res, db) {
  var member_id = income.member_id;
  var name = income.name;
  var contact = income.contact;
  var date =income.date;

  var sql = `insert into Donor (member_id, name, contact,date) 
          VALUES 
          (?, ?, ?,?);`;

  var values = [member_id, name, contact,date];

  db.serialize(function () {
    db.run(sql, values, function (err) {
      console.warn("inserted id:", this.lastID);
      if (err) {
        console.error(err);
        res.status(500).send(err);
      }
      else {
        res.status(200).send({ response_action: 'redirect', url: '/members', msg: "Successfully Added New Member", id: this.lastID })
      }
    });
  });
}

function bulkinsertDonationDetail(receipt_id, donation_list, donation_list2, res, db) {

  placeholders = donation_list.map((i) => '(?, ?, ?,?, ?)').join(',');
  var sql = `insert into DonationDetails (receipt_id, donation_type, unit_value, quantity, value) 
          VALUES `+
          placeholders+`;`;
          console.log(sql)

  var values = donation_list2;
  console.dir(values)

  db.serialize(function () {
    db.run(sql, values, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      }
      else {
        res.status(200).send({ response_action: 'redirect', url: '/receipt/', 'receipt_id': receipt_id, msg: "Successfully Added New Member" })
      }
    });
  });
}

function validateRequest(req, res) {
  var fs = require('fs');
  var schema = JSON.parse(fs.readFileSync('app/data/product-schema.json', 'utf8'));

  var JaySchema = require('jayschema');
  var js = new JaySchema();
  var instance = req.body;

  js.validate(instance, schema, function (errs) {
    if (errs) {
      console.error(errs);
      res.status(400).send(errs);
    }
  });

  if (req.body.id) {
    res.status(400).send("ID cannot be submmited");
  }
};

// Edit
function editMembers(req, res, db) {
  for (var prod of req.body) {
    console.dir(prod)
    modifyMemberDetails(prod, res, db);
  }
}

function editMember(req, res, db) {
  modifyMemberDetails(req.body, res, db);
}

function modifyMemberDetails(income, res, db) {
  var receipt_id = income.receipt_id;
  var donation_type = income.donation_type;
  var unit_value = income.unit_value;
  var quantity = income.quantity;
  var value = income.value;

  if (!id) {
    res.status(400).send("ID is mandatory");
  }

  else {
    var sql = `update DonationDetails set quantity = ?, value = ?, unit_value = ? where receipt_id = ? and donation_type = ?;`;
    var values = [quantity, value, unit_value, receipt_id, donation_type];

    db.serialize(function () {
      db.run(sql, values, function (err) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        }
        else
          res.send();
      });
    });
  }
}

