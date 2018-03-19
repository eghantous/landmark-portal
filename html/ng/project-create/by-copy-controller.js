app.controller('byCopyCtrl',
  ['$scope'
  ,'$http'
  ,'$location'
  ,byCopyCtrl
  ]);

function byCopyCtrl($scope
                    , $http
                    , $location
                    ) {
  $scope.error = null;
  $scope.selectedProject = {};
  
  // private vars
  var self = this;
  
  // private functions
  this.init = function() {
    this.getProjects();
  }
  
  this.getProjects = function() {
    // reset results
    $scope.projects = [];    
    
    var url = '/project/all';
    $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.projects = resp.data.projects;
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
    
  }
  
  // scope functions
  
  $scope.copyProject = function() {
    var url = '/project/'+$scope.selectedProject.id
            + '/copy/'+$scope.projectName
            ;
    $http.post(url)
      .then(function(resp) {
        $scope.error = null;
//        console.log(resp.data);
        $location.path('/project/'+resp.data.id+'/harvest');
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }

 
  this.init();
}