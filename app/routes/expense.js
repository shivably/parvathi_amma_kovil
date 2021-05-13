module.exports = function (app, db) {
  // Load products by ID: http://localhost:4300/api/income_type/id/$id
  // example: http://localhost:4300/api/income_type/id/15
  app.get('/api/expense_type/id/:id', (req, res) => {
    processData(res, "SELECT * FROM ExpenseType where id == " + req.params.id);
  });

  // Load all products: http://localhost:4300/api/income_type/
  app.get('/api/expense_type', (req, res) => {
    processData(res, "SELECT * FROM ExpenseType");
  });

  // Load products by ID: http://localhost:4300/api/income_type/id/$id
  // example: http://localhost:4300/api/income_type/id/15
  app.get('/api/expense/id/:id', (req, res) => {
    processData(res, "SELECT * FROM Expense where id == " + req.params.id);
  });

  // Load all products: http://localhost:4300/api/income_type/
  app.get('/api/expenses', (req, res) => {
    processData(res, "SELECT * FROM Expense");
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
      res.status(200).send([]);
    }
  }

  // Add new product
  // http://localhost:4300/api/income_type
  // Sending a JSON body:
  // {
  //     "name": "ExampleProductName",
  //     "description": "Example product description",
  //     "price": 2.00,
  //     "currency": "EUR" 
  // }

  // or an array of products:
  // [
  //     {...},{...}
  // ]
  app.post('/api/expense_type/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    processProduct(req, res, db);
  });

  app.post('/api/expense/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    addExpense(req, res, db);
  });

  app.delete('/api/expense_type/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    activateMember(req, res, db);
  });

  // Update a product
  // http://localhost:4300/api/product
  // Sending a JSON body:
  // {
  //     "id": "12",            
  //     "name": "ExampleProductName",
  //     "description": "Example product description",
  //     "price": 2.00,
  //     "currency": "EUR" 
  // }

  // or an array of products:
  // [
  //     {...},{...}
  // ]
  app.put('/api/expense_type/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    editMember(req, res, db);
  });

  app.put('/api/expense/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var data = req.body;
    modifyExpenseDetails(data, res, db);
  });
  
};

function addExpense(req, res, db) {
  //validateRequest(req, res);
  insertExpense(req.body, res, db);
}

function insertExpense(income_type, res, db) {
  var type_id = income_type.type_id;
  var receipt = income_type.receipt;
  var value = income_type.value;
  var description = income_type.description;
  var dor = income_type.dor;
  console.dir(income_type)
  var sql = `insert into Expense (type_id, receipt, value, description, dor) 
          VALUES 
          (?, ?, ?, ?, ?);`;

  var values = [type_id, receipt, value, description, dor];

  db.serialize(function () {
    db.run(sql, values, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      }
      else {
        res.status(200).send({ response_action: 'redirect', url: '/expenses', msg: "Successfully Added Income Type" })
      }
    });
  });
}

function processProduct(req, res, db) {
  //validateRequest(req, res);
  insertProduct(req.body, res, db);
}

function insertProduct(income_type, res, db) {
  var name = income_type.name;
  var description = income_type.description;

  console.dir(income_type)

  var sql = `insert into ExpenseType (name, description) 
          VALUES 
          (?, ?);`;

  var values = [name, description];

  db.serialize(function () {
    db.run(sql, values, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      }
      else {
        res.status(200).send({ response_action: 'redirect', url: '/expenses', msg: "Successfully Added Income Type" })
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


function activateMember(req, res, db) {
  updateProduct(req.body, res, db);
}

function updateProduct(product, res, db) {
  var id = product.id;

  if (!id) {
    res.status(400).send("ID is mandatory");
  }
  else {
    var sql = `delete from ExpenseType where id = ?;`;
    var values = [id];

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


function editMember(req, res, db) {
  modifyMemberDetails(req.body, res, db);
}

function modifyMemberDetails(income_type, res, db) {
  var id = income_type.id;
  var name = income_type.name;
  var description = income_type.description;

  if (!id) {
    res.status(400).send("ID is mandatory");
  }

  else {
    var sql = `update ExpenseType set name = ?, description = ? where id = ?;`;
    var values = [name, description, id];

    db.serialize(function () {
      db.run(sql, values, function (err) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        }
        else
          res.status(200).send({ response_action: 'redirect', url: '/expenses', msg: "Successfully Edited Expense Type" });
      });
    });
  }
}

function modifyExpenseDetails(expense, res, db) {
  var type_id = expense.type_id;
  var receipt = expense.receipt;
  var value = expense.value;
  var description = expense.description;
  var id = expense.id;
  var dor = expense.dor;
  if (!id) {
    res.status(400).send("ID is mandatory");
  }

  else {
    var sql = `update Expense set type_id = ?, receipt = ?, value = ?, description =  ?,dor = ? where id = ?;`;
    var values = [type_id, receipt, value, description, dor, id];

    db.serialize(function () {
      db.run(sql, values, function (err) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        }
        else
          res.status(200).send({ response_action: 'redirect', url: '/expenses', msg: "Successfully Edited Expense" });
      });
    });
  }
}