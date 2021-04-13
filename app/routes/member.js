module.exports = function(app, db) {
  // Load products by ID: http://localhost:4300/api/product/id/$id
  // example: http://localhost:4300/api/product/id/15
  app.get('/api/members/id/:id', (req, res) => {
    processData(res, "SELECT * FROM Members where id == "+req.params.id);
  });

  // Load products by attribute: http://localhost:4300/api/product/$attribute/$name
  // example: http://localhost:4300/api/product/price/24
  //          http://localhost:4300/api/product/name/Suntone
  // $attribute = ['name', 'price', 'currency', 'description']*
  // * this is not checked values, wrong parameters will return in a DB error.
  app.get('/api/members/:attribute/:name', (req, res) => {
    processData(res, "SELECT * FROM Members where "+req.params.attribute+" = '"+req.params.name+"'");
  });

  // Load all products: http://localhost:4300/api/product/
  app.get('/api/members', (req, res) => {
    processData(res, "SELECT * FROM Members");
  });

  // Load products: http://localhost:4300/api/product/sort/$attribute
  // example: http://localhost:4300/api/product/sort/price
  //          http://localhost:4300/api/product/sort/name
  // $attribute = ['name', 'price', 'currency', 'description']*
  app.get('/api/members/sort/:way', (req, res) => {
    processData(res, "SELECT * FROM Members order by " + req.params.way);
  });

  // Load products: http://localhost:4300/api/product/sort/$direction/$attribute
  // example: http://localhost:4300/api/product/sort/asc/price
  //          http://localhost:4300/api/product/sort/desc/price
  // $attribute = ['name', 'price', 'currency', 'description']*
  // $direction [ASC or DESC]C]*
  // * the direction is checked and when wrong will return a 401 business error.
  app.get('/api/members/sort/:direction/:way', (req, res) => {
    var way = req.params.way;
    var direction = req.params.direction;

    if(direction !== "asc" && 
        direction !== "desc"){
      res.status(404).send("Sorting direction invalid!");
    }
    processData(res, "SELECT * FROM Members order by " + way + " " + direction);
  });

  function processData(res, sql){
    db.serialize(function() {
      db.all(sql, 
        function(err, rows) {
          if(err){
            console.error(err);
            res.status(500).send(err);
          }
          else
            sendData(res, rows, err);
      });
    });
  }

  function sendData(res, data, err){
    res.setHeader("Access-Control-Allow-Origin","*");
    if(data[0])
      res.send(data);
    else{
      res.status(404).send("Member not found");
    }
  }

    // Add new product
    // http://localhost:4300/api/product
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
    app.post('/api/members/', (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
       var data = req.body;
       
       if((data.constructor === Array))
          processProducts(req, res, db);
       else
          processProduct(req, res, db);
  });

      
    // Delete a product
    // http://localhost:4300/api/product
    // Sending a JSON body: (ID is needed)
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
    app.delete('/api/members/', (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");

       var data = req.body;
       
       if((data.constructor === Array))
          activateMembers(req, res, db);
       else
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
    app.put('/api/members/', (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");

       var data = req.body;
       
       if((data.constructor === Array))
          editMembers(req, res, db);
       else
          editMember(req, res, db);
  });
};

function processProducts(req, res, db){
  for (var prod of req.body) {
      insertProduct(prod, res, db);
  }
}

function processProduct(req, res, db){
  //validateRequest(req, res);
  insertProduct(req.body, res, db);
}

function insertProduct(members, res, db){
  var name = members.name;
  var address = members.address;
  var permanent_address = members.permanent_address;
  var phone = members.phone;
  var email = members.email;
  var aadhar = members.aadhar;
  var dob = members.dob;
  console.dir(members)

  var sql = `insert into Members (name, address, permanent_address, phone, email, aadhar, dob) 
          VALUES 
          (?, ?, ?, ?, ?, ?, ?);`;

  var values = [name, address, permanent_address, phone, email, aadhar, dob];

  db.serialize(function () {
      db.run(sql, values, function (err) {
          if (err){
              console.error(err);
              res.status(500).send(err);
          }
          else {
              res.status(200).send({response_action: 'redirect', url:'/members', msg: "Successfully Added New Member"})
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

// Delete
function activateMembers(req, res, db){
  for (var prod of req.body) {
      updateProduct(prod, res, db);
  }
}

function activateMember(req, res, db){
  updateProduct(req.body, res, db);
}

function updateProduct(product, res, db){
  var id = product.id;

  if(!id){
      res.status(400).send("ID is mandatory");
  }
  else{
      var sql = `delete from Members where id = ?;`;
      var values = [id];

      db.serialize(function () {
          db.run(sql, values, function (err) {
              if (err){
                  console.error(err);
                  res.status(500).send(err);
              }
              else
                  res.send({response_action: 'redirect', url:'/members', msg: "Successfully Updated Member"});
          });
      });
  }
}

// Edit
function editMembers(req, res, db){
  for (var prod of req.body) {
      console.dir(prod)
      modifyMembersDetails(prod, res, db);
  }
}

function editMember(req, res, db){
  modifyMembersDetails(req.body, res, db);
}

function modifyMembersDetails(members, res, db){
  var id = members.id;
  var name = members.name;
  var address = members.address;
  var permanent_address = members.permanent_address;
  var phone = members.phone;
  var email = members.email;
  var aadhar = members.aadhar;
  var dob = members.dob;

  if(!id){
      res.status(400).send("ID is mandatory");
  }

  else{
      var sql = `update Members set name = ?, address = ?, permanent_address = ?, phone = ?, email = ?, aadhar = ?, dob = ? where id = ?;`;
      var values = [name, address, permanent_address, phone, email, aadhar, dob, id];

      db.serialize(function () {
          db.run(sql, values, function (err) {
              if (err){
                  console.error(err);
                  res.status(500).send(err);
              }
              else
                  res.send({response_action: 'redirect', url:'/members', msg: "Successfully Added New Member"});
          });
      });
  }
}

