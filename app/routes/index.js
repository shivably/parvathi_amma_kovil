const loadDatabase = require('../data/setup-database');
const members = require('./member');
const income_type = require('./income_type');
const donation = require('./donations');
const reports = require('./reports');
const expense_type = require('./expense');
const kovil = require('./kovil');

module.exports = function (app, db) {
  // create database in case it was not created yeat, 
  // or update in case of migrations
  loadDatabase(db);
  members(app, db);
  income_type(app, db);
  donation(app, db);
  reports(app, db);
  expense_type(app, db);
  kovil(app, db);

};
