const express = require('express');
const app = express();
const port = 80;
const ip = '0.0.0.0'

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('app/data/sqlitedb');
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app, db);

var notLoggedIn = 0;

app.get('/', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }else{
        res.sendFile('./app/assets/html/add-donation-parvathiamman.html', { root: __dirname });
    }
});

app.get('/members', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }else{
        res.sendFile('./app/assets/html/members.html', { root: __dirname });
    }
});

app.get('/add-member', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add-member.html', { root: __dirname });
});

app.get('/kovil', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/kovil.html', { root: __dirname });
});

app.get('/add_kovil', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add_kovil.html', { root: __dirname });
});

app.get('/income_type', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/income_type.html', { root: __dirname });
});
app.get('/add_income_type', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add_income_type.html', { root: __dirname });
});

app.get('/add-donation-ayyan', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add-donation-ayyan.html', { root: __dirname });
});

app.get('/add-donation-parvathiamman', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add-donation-parvathiamman.html', { root: __dirname });
});

app.get('/add-donation', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add-donation.html', { root: __dirname });
});

app.get('/expenses', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/expenses.html', { root: __dirname });
});

app.get('/add_expense_type', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add_expense_type.html', { root: __dirname });
});

app.get('/add_expense', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/add_expense.html', { root: __dirname });
});

app.get('/reports', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/reports.html', { root: __dirname });
});

app.get('/receipt', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/receipt.html', { root: __dirname });
});
app.get('/edit-member', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/edit-member.html', { root: __dirname });
});

app.get('/edit_expense', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/edit_expense.html', { root: __dirname });
});

app.get('/expense_report', (req, res) => {
    if(notLoggedIn) {
        res.redirect('/login');
    }
    res.sendFile('./app/assets/html/expense_report.html', { root: __dirname });
});

app.get('/balance', (req, res) => {
    if(notLoggedIn) {
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

app.listen(port, ip, () => {
    console.log('Backend NodeJS live on ' + port);
});

