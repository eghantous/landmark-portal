var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression')
// var auth = require('./shared/auth');
var project = require('./routes/project');

var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); // to support URL-encoded bodies

// app.use(auth.passport.initialize());
// app.use(auth.passport.session());
// the following line requires auth for OPTION which is bad for CORS
// app.use(auth.passport.authenticate('basic')); // protects pages themselves

/*********************************
 * Serve all other content under /html
 *********************************/
app.use(compression());
app.use(express.static(__dirname+'/html'));



/*************************
 * Route REST calls
 ************************/
// app.get('*', auth.passport.authenticate('basic', { session: false }))

// Project
app.get('/project/all',
        project.getProjects);
app.put('/project/:projectid',
        project.createProject);
app.post('/project/:projectid/copy/:newprojectname',
        project.copyProject);
app.post('/project/:projectid/copy_noname',
        project.copyProjectWithoutName);
app.post('/project/:projectid/delete',
        project.deleteProject);
app.post('/project/create_harvest',
        project.createHarvest);
app.post('/project/create_by_urls',
        project.createByUrls);
app.get('/project/:projectid/status',
        project.getStatus);
app.get('/project/:projectid/crawlid',
        project.getCrawlId);
app.get('/project/:projectid/harvest/status',
        project.getHarvestStatus);

// Cluster
app.get('/project/:projectid/clusters',
        project.getClusters);
app.put('/project/:projectid/cluster/:clusterid/choose',
        project.selectCluster);
app.post('/project/:projectid/cluster/:clusterid/pages/move/:pagetype',
        project.movePages);
app.post('/project/:projectid/cluster/:toclusterid/merge/:fromclusterid',
        project.mergeCluster);

// Skim page
app.get('/project/:projectid/cluster/:clusterid/data/grid',
        project.getGridData);

// Fix page support
app.get('/project/:projectid/cluster/:clusterid/pages',
        project.getPages);

// Schema-Edit
app.get('/project/:projectid/cluster/:clusterid/schema',
        project.getSchema);
app.put('/project/:projectid/cluster/:clusterid/field/add',
        project.addField);
app.get('/project/:projectid/field_names',
        project.getDefaultFields);
app.put('/project/:projectid/cluster/:clusterid/field/:fieldid/rename/:fieldname',
        project.renameField);
app.delete('/project/:projectid/cluster/:clusterid/field/:fieldid',
           project.delField);
app.put('/project/:projectid/cluster/:clusterid/field/validation',
        project.addFieldValidation);
app.get('/project/:projectid/cluster/:clusterid/schema/validation',
        project.getValidationRules);
app.put('/project/:projectid/cluster/:clusterid/field/validation/delete',
        project.delValidationRule);
app.put('/project/:projectid/cluster/:clusterid/field/extraction/validation',
        project.evalValidationRule);

// Markup-Edit
app.get('/project/:projectid/cluster/:clusterid/page/:pageid',
        project.getPageData);
app.put('/project/:projectid/cluster/:clusterid/page/:pageid/markup',
        project.setPageData);
app.get('/project/:projectid/cluster/:clusterid/page/:pageid',
        project.getPageData);

// Verify page
//app.get('/project/:projectid/cluster/:clusterid/data/verify/in',
//        project.getVerifyDataWithinCluster);
//app.get('/project/:projectid/cluster/:clusterid/data/verify/out',
//        project.getVerifyDataWithoutCluster);
app.get('/project/:projectid/cluster/:clusterid/data/verify/mapped',
        project.getVerifyData);
app.put('/project/:projectid/cluster/:clusterid/classifier/default',
        project.setDefaultClassifier)
app.put('/project/:projectid/cluster/:clusterid/classifier/rule',
        project.setRuleClassifier)
app.get('/project/:projectid/cluster/:clusterid/get_classifier',
        project.getClassifier)

// Deliver
app.get('/project/:projectid/cluster/:clusterid/data/:format',
        project.deliverData);
app.post('/project/:projectid/cluster/:clusterid/data/publish',
        project.publishData);

// Misc
app.post('/project/:projectid/cluster/:clusterid/reset',
        project.reset);
app.post('/project/:projectid/cluster/:clusterid/train',
        project.learnSupervised);

app.put('/project/:projectid/cluster/:clusterid/page/:pageid/rename/:pagename',
        project.renamePage);

app.get('/project/:projectid/cluster/:clusterid/page/:pageid/html/source',
        project.getPageSource);
app.get('/project/:projectid/cluster/:clusterid/page/:pageid/html/cached',
        project.getCachedPage);
app.get('/project/:projectid/cluster/:clusterid/page/:pageid/html/debug',
        project.getDebugPage);

app.post('/proxy/page',
        project.proxyPage);

/*************************
 * Start Server
 ************************/


var httpPort = 3333;

app.listen(httpPort);

console.log('Listening on port '+httpPort);

