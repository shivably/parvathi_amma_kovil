const getRoutes = require('./product-get-route');
const postRoutes = require('./product-post-route');
const loadDatabase = require('../data/setup-database');

module.exports = function (app, db) {

  // create database in case it was not created yeat, 
  // or update in case of migrations
  loadDatabase(db);

  // start routes
  getRoutes(app, db);
  postRoutes(app, db);

};
