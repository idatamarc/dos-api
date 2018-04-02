var express = require('express');
var router = express.Router();

var ctrlObjects = require('../controllers/objects.controllers.js');

// objects routes
router
  .route('/objects')
  .get(ctrlObjects.objectsGetAll)
  .post(ctrlObjects.objectsAddOne);

router
    .route('/dataobjects/list')
    .post(ctrlObjects.objectsListAll);

router
    .route('/objects/:objectId')
    .get(ctrlObjects.objectsGetOne)
    .put(ctrlObjects.objectsUpdateOne)
    .delete(ctrlObjects.objectsDeleteOne);


module.exports = router;