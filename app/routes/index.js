/*const getRoutes = require('./product-get-route');
const postRoutes = require('./product-post-route');
const putRoutes = require('./product-put-route');
const deleteRoutes = require('./product-delete-route');*/
const loadDatabase = require('../data/setup-database');

const members = require('./member');
const income_type = require('./income_type');
const donation = require('./donation');
const reports = require('./reports');



module.exports = function (app, db) {

  // create database in case it was not created yeat, 
  // or update in case of migrations
  loadDatabase(db);

  // start routes
  /*getRoutes(app, db);
  postRoutes(app, db);
  putRoutes(app, db);
  deleteRoutes(app, db);*/

  members(app, db);
  income_type(app, db);
  donation(app, db);
  reports(app, db);

};
