var express = require('express');
var router = express.Router();

var ctrlObjects = require('../controllers/objects.controllers.js');

// Hotel routes
router
  .route('/objects')
  .get(ctrlObjects.objectsGetAll)
  .post(ctrlObjects.objectsAddOne);

router
  .route('/objects/:objectId')
  .get(ctrlObjects.objectsGetOne)
  .put(ctrlObjects.objectsUpdateOne)
  .delete(ctrlObjects.objectsDeleteOne);


module.exports = router;