app.controller('projectSelectCtrl',
  ['$scope'
  ,'$window'
  ,'$http'
  ,'$location'
  ,'$interval'
  ,'$timeout'
  ,'paginationService'
  ,projectSelectCtrl
  ]);

function projectSelectCtrl($scope
                         , $window
                         , $http
                         , $location
                         , $interval
                         , $timeout
                         , paginationService
                          ) {
  $scope.error = null;
  
  $scope.sortKey = 'id';
  $scope.reverse = true;
  $scope.sort = function(sortBy) {
    if( sortBy != $scope.sortKey ) {
      $scope.sortKey = sortBy;
    } else {
      $scope.reverse = !$scope.reverse;
    }
  }
  
  $scope.gotoPage = function(page) {
    paginationService.setCurrentPage('__default', page);
  }
  
  // private vars
  var self = this;
  var projectListTimer;
  
  /*****************************
   * private functions
   ****************************/
  
  this.init = function() {
    self.getProjects();
    var prefix = $location.search().prefix;
    if(prefix) {
      $window.sessionStorage.setItem('prefix', prefix);
    }
    if ($window.sessionStorage.prefix) {
      $scope.prefixFilter = $window.sessionStorage.prefix;
    }
    // console.log($scope.prefixFilter);
  }
  
  this.getProjects = function() {
    // reset results
    // $scope.projects = [];    
    
    var url = '/project/all';
//    var url = '/ng/project-select/sample-project_list.json';
    
    $http.get(url)
      .then(function(resp) {
        $scope.error = null;
//          console.log(resp);
        $scope.projects = resp.data.projects;
        for(var i=0; i<$scope.projects.length; i++) {
          var project = $scope.projects[i];
          project.cloneProjectName = project.name+'-copy';
        }
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
    
  }
  
//  this.startProjectListRefresh = function() {
//    projectListTimer = $interval(function() {
//      console.log('refreshing project list');
//      self.getProjects()
//    }, 3*1000); // check every 15 seconds
//    
//    $scope.$on('$destroy', function() {
//      console.log('stop refreshing project list: leaving page');
//      if( projectListTimer ) $interval.cancel(projectListTimer);
//    })
//  }  
  
  $scope.refreshStatus = '';
  var startCountDown = 30;
  var refreshSec = startCountDown;
  this.startProjectListRefresh = function() {
    refreshSec--;
    if( refreshSec < 0 ) {
      self.getProjects();
      refreshSec = startCountDown;
    }
    $scope.refreshStatus = refreshSec+'s until Refresh';
    $timeout(self.startProjectListRefresh, 1000);
    
  }    
  
  this.init();
  
  /*****************************
   * scope functions
   ****************************/
  
  $scope.clone = function(project) {
    var url = '/project/'+project.id
            + '/copy_noname'
            ;
    $http.post(url)
      .then(function(resp) {
        $scope.error = null;
//        console.log(resp.data);
      $scope.projects.push(resp.data);
    })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  $scope.reset = function(project) {
    var r = confirm("Are you sure you want to reset this Task? All changes will be lost.");
    if (r == true) {
      var url = '/project/' + project.id
              + '/cluster/' + project.selected_cluster_id
              + '/reset'
              ;
      $http.post(url)
        .then(function(resp) {
          $scope.error = null;
          $location.path('/project/'+project.id+'/cluster');
        })
        .catch(function(err) {
          $scope.error = err.data;
        });
    } else {

    }
  }

  $scope.delete = function(project) {
    var index = $scope.projects.indexOf(project);
    var r = confirm("Are you sure you want to delete this Task?");
    if (r == true) {
      var url = '/project/' + project.id
              + '/delete'
              ;
      $http.post(url)
        .then(function(resp) {
          $scope.error = null;
          $scope.projects.splice(index, 1);
        })
        .catch(function(err) {
          $scope.error = err.data;
        });
    } else {
      
    }
  }

}
