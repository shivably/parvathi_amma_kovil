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

app.get('/', (req, res) => {
    res.redirect('/add-donation-parvathiamman');
});

app.get('/members', (req, res) => {
    res.sendFile('./app/assets/html/members.html', { root: __dirname });
});

app.get('/add-member', (req, res) => {
    res.sendFile('./app/assets/html/add-member.html', { root: __dirname });
});

app.get('/kovil', (req, res) => {
    res.sendFile('./app/assets/html/kovil.html', { root: __dirname });
});

app.get('/add_kovil', (req, res) => {
    res.sendFile('./app/assets/html/add_kovil.html', { root: __dirname });
});

app.get('/income_type', (req, res) => {
    res.sendFile('./app/assets/html/income_type.html', { root: __dirname });
});
app.get('/add_income_type', (req, res) => {
    res.sendFile('./app/assets/html/add_income_type.html', { root: __dirname });
});

app.get('/add-donation-ayyan', (req, res) => {
    res.sendFile('./app/assets/html/add-donation-ayyan.html', { root: __dirname });
});

app.get('/add-donation-parvathiamman', (req, res) => {
    res.sendFile('./app/assets/html/add-donation-parvathiamman.html', { root: __dirname });
});

app.get('/add-donation', (req, res) => {
    res.sendFile('./app/assets/html/add-donation.html', { root: __dirname });
});

app.get('/expenses', (req, res) => {
    res.sendFile('./app/assets/html/expenses.html', { root: __dirname });
});

app.get('/add_expense_type', (req, res) => {
    res.sendFile('./app/assets/html/add_expense_type.html', { root: __dirname });
});

app.get('/add_expense', (req, res) => {
    res.sendFile('./app/assets/html/add_expense.html', { root: __dirname });
});

app.get('/reports', (req, res) => {
    res.sendFile('./app/assets/html/reports.html', { root: __dirname });
});

app.get('/receipt', (req, res) => {
    res.sendFile('./app/assets/html/receipt.html', { root: __dirname });
});
app.get('/edit-member', (req, res) => {
    res.sendFile('./app/assets/html/edit-member.html', { root: __dirname });
});

app.listen(port, ip, () => {
    console.log('Backend NodeJS live on ' + port);
});

