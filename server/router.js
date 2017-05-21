var stopoverController = require('./controllers/stopoverController');

// Routes
module.exports = function(app){
  app.get('/stopover/list', stopoverController.list);
  app.post('/admin/stopover/new', stopoverController.new);
  app.post('/admin/stopover/update', stopoverController.update);
  app.post('/admin/stopover/updateSorting', stopoverController.updateSorting);
  app.post('/admin/stopover/delete', stopoverController.delete);
};
