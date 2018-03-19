app.controller('projectStatusHeaderCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,'$location'
  ,projectStatusHeaderCtrl
  ]);

function projectStatusHeaderCtrl($scope
                               , $http
                               , $routeParams
                               , $location
                               ) {
  $scope.error = null;
  $scope.projectid = $routeParams.projectid;
//  $scope.clusterid = $routeParams.clusterid;
  $scope.pageid = $routeParams.pageid;
  $scope.projectStatus = {};
    
  // private vars
  var self = this;
  
  // private functions
  this.init = function() {
    var pathParts = $location.path().split('/');
    $scope.step = pathParts[pathParts.length-1];
    if( self.isInt($scope.step) ) {
      $scope.step = pathParts[pathParts.length-2];
    }
    
    self.getProjectStatus();
  }
  
  this.isInt = function(value) {
    if (isNaN(value)) {
      return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
  }
  
  this.getProjectStatus = function() {
    var url = '/project/' + $scope.projectid
            + '/status'
            ;
    $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.projectStatus = resp.data;
      })
      .catch(function(err) {
        $scope.error = err.statusText;
      });
  }
  
  // scope functions
  
  
  this.init();
}