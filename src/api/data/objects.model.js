var mongoose = require('mongoose');

var checksumSchema = new mongoose.Schema({

  checksum : {
    type : String,
    required : true
  },
  type : {
    type : String,
    required : false
  }
});
//TODO: need a better way to model those <Stirng, Object> metadata into mongoose
var urlSchema = new mongoose.Schema({
  url : String,
  //system_metadata : [mongoose.Schema.Types.Mixed],
  //user_metadata : [mongoose.Schema.Types.Mixed]
});

var objectsSchema = new mongoose.Schema({
  id : {
      type : String,
      required : true
  },
  name : {
    type : String,
    required : true
  },
  size : {
    type : Number,
    default : 16
  },
  created : {
      type : Date,
      "default" : Date.now
  },
  updated : {
      type : Date,
      "default" : Date.now
  },
  version : {
      type : String,
      required : false
  },
  mime_type : String,
  checksums: [checksumSchema],
  urls: [urlSchema],
  description : String,
  aliases : [String]
});

mongoose.model('objects', objectsSchema);