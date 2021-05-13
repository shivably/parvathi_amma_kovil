const express = require('express');
var cookieParser = require('cookie-parser')
const app = express();
const port = 80;
const ip = '0.0.0.0'

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('app/data/sqlitedb');
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
require('./app/routes')(app, db);

var backup = require('./app/routes/backup');

var notLoggedIn = 0;

function userLoggedIn(req, res) {

    if (req.cookies['sss-session'] == null || req.cookies['sss-session'] == "") {
        notLoggedIn = 1
        return
    }
    console.log('Cookies: ', req.cookies['sss-session'])
    var credential = req.cookies['sss-session'].split(':');
    var username = credential[0];
    var password = credential[1];
    console.log(username)
    console.log(password)
    if (!username && !password) {
        notLoggedIn = 1
    } else {
        var sql = `select username, isAdmin, language from Users where username = ? and password = ?;`;
        var values = [username, password];

        db.get(sql, values, (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            if (row) {
                notLoggedIn = 0
            } else {
                notLoggedIn = 1
            }
        });
    }
}

app.get('/', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    } else {
        res.sendFile('./app/assets/html/add-donation-parvathiamman.html', { root: __dirname });
    }
});

app.get('/members', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    } else {
        res.sendFile('./app/assets/html/members.html', { root: __dirname });
    }
});

app.get('/add-member', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add-member.html', { root: __dirname });
});

app.get('/kovil', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/kovil.html', { root: __dirname });
});

app.get('/add_kovil', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add_kovil.html', { root: __dirname });
});

app.get('/income_type', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/income_type.html', { root: __dirname });
});
app.get('/add_income_type', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add_income_type.html', { root: __dirname });
});

app.get('/add-donation-ayyan', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add-donation-ayyan.html', { root: __dirname });
});

app.get('/add-donation-parvathiamman', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add-donation-parvathiamman.html', { root: __dirname });
});

app.get('/add-donation', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add-donation.html', { root: __dirname });
});

app.get('/expenses', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/expenses.html', { root: __dirname });
});

app.get('/add_expense_type', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add_expense_type.html', { root: __dirname });
});

app.get('/add_expense', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add_expense.html', { root: __dirname });
});

app.get('/reports', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/reports.html', { root: __dirname });
});

app.get('/receipt', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/receipt.html', { root: __dirname });
});
app.get('/edit-member', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/edit-member.html', { root: __dirname });
});

app.get('/edit_expense', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/edit_expense.html', { root: __dirname });
});

app.get('/expense_report', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/expense_report.html', { root: __dirname });
});

app.get('/balance', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/balance.html', { root: __dirname });
});

app.get('/navigation', (req, res) => {
    res.sendFile('./app/assets/html/navigation.html', { root: __dirname });
});

app.get('/js/language.js', (req, res) => {
    res.sendFile('./app/assets/js/language.js', { root: __dirname });
});

app.get('/config/language.js', (req, res) => {
    res.sendFile('./app/assets/config/language.js', { root: __dirname });
});

app.get('/login', (req, res) => {
    res.sendFile('./app/assets/html/login.html', { root: __dirname });
});

app.post('/login', (req, res) => {
    var credential = req.body;
    console.dir(credential)
    var username = credential.username;
    var password = credential.password;

    if (!username && !password) {
        res.status(200).send({ response_action: 'redirect', url: '/login', msg: "Login Failed!" });
    }
    else {
        var sql = `select username, isAdmin, language from Users where username = ? and password = ?;`;
        var values = [username, password];

        db.get(sql, values, (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            if (row) {
                res.cookie('sss-session', username + ":" + password, { maxAge: 900000, httpOnly: true });
                //res.status(200).send({ response_action: 'redirect', url: '/add-donation-parvathiamman', msg: "Login Successfull!" })
                res.redirect('/add-donation-parvathiamman?msg=Login Successfull!');
            } else {
                res.status(200).send({ response_action: 'redirect', url: '/login', msg: "Login Failed!" });
            }
        });
    }
});

app.get('/backup', (req, res) => {
    userLoggedIn(req, res)
    if (notLoggedIn) {
        res.redirect('/login');
    } else {
        res.sendFile('./app/assets/html/backup.html', { root: __dirname });
    }
});

app.get('/logout', (req, res) => {
    res.cookie('sss-session', "", { maxAge: Date.now(), httpOnly: true });
    res.redirect('/login?msg=Logged Out');
});

app.use('/static/images', express.static('./app/assets/images/'))

app.listen(port, ip, () => {
    console.log('Backend NodeJS live on ' + port);
    backup.schedule();
});


