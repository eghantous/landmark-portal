app.controller('projectHarvestCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,'$interval'
  ,projectHarvestCtrl
  ]);

function projectHarvestCtrl($scope
                          , $http
                          , $routeParams
                          , $interval
                          ) {
  $scope.error = null;
  $scope.projectid = $routeParams.projectid;
  
  $scope.projectStatus;
  $scope.crawlStatus;
    
  // private vars
  var self = this;
  var projectStatusTimer;
  var harvestStatusTimer;
  
  // private functions
  this.init = function() {
    $scope.getHarvestStatus()
      .then(function() {
        if( self.isHarvestProcessing($scope.crawlStatus.status) ) {
          self.startHarvestStatusRefresh();
        }
      });
    
    $scope.getProjectStatus()
      .then(function() {
        if( self.isProjectProcessing($scope.projectStatus.status) ) {
          self.startProjectStatusRefresh();
        }
      });
  }
  
  this.isHarvestProcessing = function(status) {
    return status == 'RUNNING';
  }
  
  this.isProjectProcessing = function(status) {
    return $scope.projectStatus.status != 'READY'
        && $scope.projectStatus.status != 'ERROR';
  }  
  
  this.startHarvestStatusRefresh = function() {
    harvestStatusTimer = $interval(function() {
      console.log('checking harvest status');
      $scope.getHarvestStatus()
        .then(function() {
          if( !self.isHarvestProcessing($scope.crawlStatus.status) ) {
            console.log('/harvest/status done');
            if( harvestStatusTimer ) {
              console.log('stop refreshing: project processing complete');
              $interval.cancel(harvestStatusTimer);
              harvestStatusTimer = null;
            }
          }
        })
    }, 15*1000); // check every 15 seconds
    
    $scope.$on('$destroy', function() {
      console.log('stop refreshing: leaving page');
      if( harvestStatusTimer ) $interval.cancel(harvestStatusTimer);
    })
  }
  
  this.startProjectStatusRefresh = function() {
    projectStatusTimer = $interval(function() {
      console.log('checking project status');
      $scope.getProjectStatus()
        .then(function() {
          if( !self.isProjectProcessing($scope.projectStatus.status) ) {
            console.log('/project/status done');
            if( projectStatusTimer ) {
              console.log('stop refreshing: crawl complete');
              $interval.cancel(projectStatusTimer);
              projectStatusTimer = null;
            }
          }
        })
    }, 15*1000); // check every 15 seconds
    
    $scope.$on('$destroy', function() {
      console.log('stop refreshing: leaving page');
      if( projectStatusTimer ) $interval.cancel(projectStatusTimer);
    })
  }
  
  // scope functions
  $scope.getHarvestStatus = function() {
    // reset results
    $scope.crawlStatus = [];
    
    var urlCrawlId = '/project'
            + '/' + $routeParams.projectid
            + '/crawlid'
            ;
    return $http.get(urlCrawlId)
      .then(function(resp) {
        var crawlid = resp.data;
      
        var url = '/project'
                + '/' + $routeParams.projectid
                + '/harvest'
//                + '/' + crawlid
                + '/status'
                ;
    //    var url = '/ng/project-select/sample-project_list.json';
        return $http.get(url);
      })
      .then(function(resp) {
        $scope.error = null;
//          console.log(resp);
        $scope.crawlStatus = resp.data;
      })
      .catch(function(err) {
        $scope.error = err.statusText;
      });
  }
  
  $scope.getProjectStatus = function() {
    var url = '/project/' + $scope.projectid
            + '/status'
            ;
    return $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.projectStatus = resp.data;
      })
      .catch(function(err) {
        $scope.error = err.statusText;
      });
  }
  
  
  this.init();
}