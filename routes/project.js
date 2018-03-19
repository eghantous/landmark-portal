//var dbp = require('../shared/db-promise.js');
var request = require('request');
var landmarkapi = require('../shared/landmarkapi.js').server+'/project';
var path = require('path');


/*******************
 * REST API
 *******************/

exports.getProjects = function(req, res) {
  var url = landmarkapi+'/list';
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.createProject = function(req, res) {
  var projectid = req.params.projectid;
  
  var url = landmarkapi+'/create/'+projectid;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.copyProject = function(req, res) {
  var projectid = req.params.projectid;
  var newprojectname = req.params.newprojectname;
  
  var url = landmarkapi
          +'/'+projectid
          +'/copy/'+newprojectname
          ;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.copyProjectWithoutName = function(req, res) {
  var projectid = req.params.projectid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/copy_noname'
          ;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.deleteProject = function(req, res) {
  var projectid = req.params.projectid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/delete'
          ;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.createHarvest = function(req, res) {
  var url = landmarkapi+'/create_harvest';
  var crawlInfo = req.body;
  
  var options = {
    uri: url,
    method: 'POST',
    json: true,
    headers: {
        "content-type": "application/json",
        },
    body: crawlInfo
  };
  
  request(options
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.createByUrls = function(req, res) {
  var url = landmarkapi+'/create_by_urls';
  var crawlInfo = req.body;
  
  var options = {
    uri: url,
    method: 'POST',
    json: true,
    headers: {
        "content-type": "application/json",
        },
    body: crawlInfo
  };
  
  request(options
          , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.getStatus = function(req, res) {
  var projectid = req.params.projectid;
  
  var url = landmarkapi
          + '/' + projectid
          + '/status'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.getCrawlId = function(req, res) {
  var projectid = req.params.projectid;
  
  var url = landmarkapi
          + '/' + projectid
          + '/harvests';
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      try {
        var json = JSON.parse(body);
        if( json && json.length > 0 ) {
    //      console.log('crawlid: ' + json[0].crawl_id);
          res.send(''+json[0].crawl_id);
        } else {
          res.writeHead(500, {'Content-Type':'text/plain'});
          res.end('Something is wrong with the backend API');
        }
      } catch(err) {
        console.error(err);
        res.writeHead(500, {'Content-Type':'text/plain'});
        res.end('Something is wrong with the backend API');
      }
    }
  })
}

exports.getHarvestStatus = function(req, res) {
  var projectid = req.params.projectid;
//  var crawlid = req.params.crawlid;
  
  var url = landmarkapi+'/'+projectid+'/harvest';
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}


exports.getClusters = function(req, res) {
  var projectid = req.params.projectid;
  
  var url = landmarkapi+'/'+projectid+'/clusters';
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.selectCluster = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi+'/'+projectid+'/cluster/'+clusterid+'/choose';
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.movePages = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var pagetype = req.params.pagetype;
  var pages = req.body;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/pages/move/'+pagetype
          ;
  
  var options = {
    uri: url,
    method: 'POST',
    json: true,
    headers: {
        "content-type": "application/json",
        },
    body: pages
  };
  
  request(options
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.mergeCluster = function(req, res) {
  var projectid = req.params.projectid;
  var toclusterid = req.params.toclusterid;
  var fromclusterid = req.params.fromclusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+toclusterid
          +'/merge/'+fromclusterid
          ;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.getGridData = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/data/grid'
          +'/validation'
          +'?limit=50'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.getPages = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi+'/'+projectid+'/cluster/'+clusterid+'/pages';
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.getSchema = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/validation'
          +'/schema'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.addField = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var newfieldjson = req.body;
    
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/field/add'
          ;
  var options = {
    uri: url,
    method: 'PUT',
    json: true,
    headers: {
        "content-type": "application/json",
        },
    body: newfieldjson
  };
  
  request(options
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.getDefaultFields = function(req, res) {
  var projectid = req.params.projectid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/field_names'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
  
}

exports.renameField = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var fieldid = req.params.fieldid;
  var fieldname = req.params.fieldname;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/field/'+fieldid
          +'/rename/'+fieldname
          ;
  request.put(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.delField = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var fieldid = req.params.fieldid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/field/'+fieldid
          +'/delete'
          ;
  request.delete(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.addFieldValidation = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var newvalidationjson = req.body;
    
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/field/validation/add'
          ;
  var options = {
    uri: url,
    method: 'PUT',
    json: true,
    headers: {
        "content-type": "application/json",
        },
    body: newvalidationjson
  };
  
  request(options
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.getValidationRules = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/schema/validation'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.delValidationRule = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var json = req.body;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/field/validation/delete'
          ;
  var options = {
    uri: url,
    method: 'PUT',
    json: true,
    headers: {
        "content-type": "application/json",
        },
    body: json
  };
  request(options
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.evalValidationRule = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var json = req.body;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/field/extraction/validation'
          ;
  var options = {
    uri: url,
    method: 'PUT',
    json: true,
    headers: {
        "content-type": "application/json",
        },
    body: json
  };
  request(options
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.getPageData = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var pageid = req.params.pageid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/page/'+pageid
          +'/validation'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

//exports.getVerifyDataWithinCluster = function(req, res) {
//  var projectid = req.params.projectid;
//  var clusterid = req.params.clusterid;
//  
//  var url = landmarkapi
//          +'/'+projectid
//          +'/cluster/'+clusterid
//          +'/data/verify/in'
//          ;
//  request.get(url
//            , function (error, response, body) {
//    if( isError(error, response)) {
//      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
//      res.end(body);
//    } else {
//      res.setHeader('Content-Type', 'application/json');
//      res.send(body);
//    }
//  })
//}
//
//exports.getVerifyDataWithoutCluster = function(req, res) {
//  var projectid = req.params.projectid;
//  var clusterid = req.params.clusterid;
//  
//  var url = landmarkapi
//          +'/'+projectid
//          +'/cluster/'+clusterid
//          +'/data/verify/out'
//          ;
//  request.get(url
//            , function (error, response, body) {
//    if( isError(error, response)) {
//      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
//      res.end(body);
//    } else {
//      res.setHeader('Content-Type', 'application/json');
//      res.send(body);
//    }
//  })
//}

exports.getVerifyData = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/data/verify/mapped'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.setDefaultClassifier = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/default_classifier'
          ;
  request.put(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.setRuleClassifier = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/rule_classifier'
          ;
  request.put(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.getClassifier = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/get_classifier'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.deliverData = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var format = req.params.format;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/data/'+format
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      if( format == 'csv' ) {
        res.setHeader('Content-Type', 'text/csv');
      } else
      if( format == 'json' ) {
        res.setHeader('Content-Type', 'application/json');
      } else
      if( format == 'rules' ) {
        res.setHeader('Content-Type', 'application/json');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }
      res.send(body);
    }
  })
}

exports.publishData = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/data/publish'
          ;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {

      res.send(body);
    }
  })
}

exports.reset = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/validation'
          +'/reset'
          ;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.learnSupervised = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/train'
          ;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.setPageData = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var pageid = req.params.pageid;
  
  var markup = req.body;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/page/'+pageid
          +'/markup'
          ;
  var options = {
    uri: url,
    method: 'PUT',
    json: true,
    headers: {
        "content-type": "application/json",
        },
    body: markup
  };
  
  request(options
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.renamePage = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var pageid = req.params.pageid;
  var pagename = req.params.pagename;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/page/'+pageid
          +'/rename/'+pagename
          ;
  request.post(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  })
}

exports.getPageSource = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var pageid = req.params.pageid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/page/'+pageid
          +'/html/cached'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
    }
  })
}

exports.getCachedPage = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var pageid = req.params.pageid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/page/'+pageid
          +'/html/cached'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(body);
    }
  })
}

exports.getDebugPage = function(req, res) {
  var projectid = req.params.projectid;
  var clusterid = req.params.clusterid;
  var pageid = req.params.pageid;
  
  var url = landmarkapi
          +'/'+projectid
          +'/cluster/'+clusterid
          +'/page/'+pageid
          +'/html/debug'
          ;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(body);
    }
  })
}

exports.proxyPage = function(req, res) {
  var data = req.body;
  
//  var url = 'http://www.camplejeuneosc.org/Sys/PublicProfile/32333581';
  var url = data.page;
  request.get(url
            , function (error, response, body) {
    if( isError(error, response)) {
      res.writeHead(response ? response.statusCode : 500, {'Content-Type':'text/plain'});
      res.end(body);
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(body);
    }
  })
}

function isError(error, response) {
  if( !response ) {
    return true;
  } else
  if( !response.statusCode ) {
    response.statusCode = 500;
    return true;
  } else
  if( error ) {
    return true;
  } else
  if( response.statusCode < 200 || response.statusCode > 299 ) {
    return true;
  } else {
    return false;
  }
      
}

