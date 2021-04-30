module.exports = function (app, db) {
    // Load products by ID: http://localhost:4300/api/income_type/id/$id
    // example: http://localhost:4300/api/income_type/id/15
    app.post('/api/login/', (req, res) => {
        var credential = req.body;
        autheticateUser(credential, res, db);
    });
  };

  function autheticateUser(credential, res, db){
    var username = credential.username;
    var password = credential.password;
  
    if(!username){
        res.status(400).send("username is mandatory");
    }
  
    else{
        var sql = `select username,isAdmin from Users where username = ? and password = ?;`;
        var values = [username, password];

        db.get(sql, values, (err, row) => {
            if (err) {
              return console.error(err.message);
            }
            return row
              ? res.status(200).send({response_action: 'redirect', url:'/add-donation-parvathiamman', msg: "Login Successfull!"})
              : res.status(200).send({response_action: 'redirect', url:'/login', msg: "Login Failed!"});
          });

    }
  }