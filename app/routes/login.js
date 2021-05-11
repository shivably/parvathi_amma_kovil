module.exports = function (app, db) {
  app.post('/api/login/', (req, res) => {
    var credential = req.body;
    return autheticateUser(credential, res, db);
  });
};

function autheticateUser(credential, res, db) {
  var username = credential.username;
  var password = credential.password;

  if (!username && !password) {
    return { response_action: 'redirect', url: '/login', msg: "Login Failed!" };
  }
  else {
    var sql = `select username, isAdmin, language from Users where username = ? and password = ?;`;
    var values = [username, password];

    db.get(sql, values, (err, row) => {
      if (err) {
        return { response_action: 'redirect', url: '/login', msg: "Login Failed!" };
      }
      if (row) {
        res.cookie('sss-session', username + ":" + password, { maxAge: 900000, httpOnly: true });
        //res.status(200).send({ response_action: 'redirect', url: '/add-donation-parvathiamman', msg: "Login Successfull!" })
        return { response_action: 'redirect', url: '/add-donation-parvathiamman', msg: "Login Successfull!" };
      } else {
        return { response_action: 'redirect', url: '/login', msg: "Login Failed!" };
      }
    });
  }
}