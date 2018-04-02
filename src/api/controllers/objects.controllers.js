var mongoose = require('mongoose');
var Objects = mongoose.model('objects');

module.exports.objectsGetAll = function(req, res) {

  console.log('GET the objects');
  console.log(req.query);

  var offset = 0;
  var count = 5;
  var maxCount = 50;

  if (req.query && req.query.offset) {
      offset = parseInt(req.query.offset, 10)
  }

  if (req.query && req.query.count) {
      count = parseInt(req.query.count, 10);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, count and offset must both be numbers"
      });
    return;
  }

  if (count > maxCount) {
    res
      .status(400)
      .json({
        "message" : "Count limit of " + maxCount + " exceeded"
      });
    return;
  }

  Objects
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, objects) {
      console.log(err);
      console.log(objects);
      if (err) {
        console.log("Error finding objects");
        res
          .status(500)
          .json(err);
      } else {
        console.log("Found objects", objects.length);
        res
          .json(objects);
      }
    });

};

//This is the spec from dos-schema
module.exports.objectsListAll = function(req, res) {

    console.log("POST to GET a list of objects");
    console.log(req.body)

    var offset = 0;
    var count = 5;
    var maxCount = 50;

    var alias = null;
    var url = null;
    var checkSum = null;

    var query = {};

    if (req.body && req.body.page_token) {
        offset = parseInt(req.body.page_token, 10);
    }

    console.log(offset);

    if (req.body && req.body.page_size) {
        count = req.body.page_size;
    }

    if (req.body && req.body.alias) {
        alias = req.body.alias;
    }
    console.log(alias);
    if(alias){
        query["aliases"] = alias;
    }

    if (req.body && req.body.url) {
        url = req.body.url;
    }
    if(url){
        query.urls = {url: url};
    }

    if (req.body && req.body.checkSum) {
        checkSum = req.body.checkSum;
    }
    if(checkSum){
        query.checkSums = {checkSum: checkSum};
    }

    if (isNaN(offset) || isNaN(count)) {
        res
            .status(400)
            .json({
                "message" : "If supplied in body, page_token and page_size must both be numbers"
            });
        return;
    }

    if (count > maxCount) {
        res
            .status(400)
            .json({
                "message" : "Count limit of " + maxCount + " exceeded"
            });
        return;
    }

    query = Object.keys(query).length === 0 ? null : query;

    Objects
        .find(query)
        .skip(offset)
        .limit(count)
        .exec(function(err, objects) {
            console.log(err);
            console.log(objects);
            if (err) {
                console.log("Error finding objects");
                res
                    .status(500)
                    .json(err);
            } else {
                console.log("Found objects", objects.length);
                var next_page_token = objects.length < count ? null : (count-1+offset).toString();
                res
                    .json({data_objects: objects, next_page_token: next_page_token});
            }
        });

};

module.exports.objectsGetOne = function(req, res) {
  var id = req.params.objectId;

  console.log('GET objectId', id);

  Objects
    .findById(id)
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding object");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("objectId not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "object ID not found " + id
        };
      }
      res
        .status(response.status)
        .json(response.message);
    });

};

var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};

module.exports.objectsAddOne = function(req, res) {
  console.log("POST new object");

  Objects
    .create({
        //TODO: form the object
    }, function(err, object) {
      if (err) {
        console.log("Error creating object");
        res
          .status(400)
          .json(err);
      } else {
        console.log("object created!", object);
        res
          .status(201)
          .json(object);
      }
    });

};


module.exports.objectsUpdateOne = function(req, res) {
  var objectId = req.params.objectId;

  console.log('GET objectId', objectId);

  Objects
    .findById(objectId)
    .select('-checksums -urls')
    .exec(function(err, object) {
      if (err) {
        console.log("Error finding object");
        res
          .status(500)
          .json(err);
          return;
      } else if(!object) {
        console.log("objectId not found in database", objectId);
        res
          .status(404)
          .lson({
            "message" : "object ID not found " + objectId
          });
          return;
      }

      //TODO: form the object

      object
        .save(function(err, objectUpdated) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });


    });

};


module.exports.objectsDeleteOne = function(req, res) {
  var objectId = req.params.objectId;

  Objects
    .findByIdAndRemove(objectId)
    .exec(function(err, location) {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log("object deleted, id:", objectId);
        res
          .status(204)
          .json();        
      }
    });
};
