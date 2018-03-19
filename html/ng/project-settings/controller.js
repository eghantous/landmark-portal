app.controller('projectSettingsCtrl',
  ['$scope'
  ,'$http'
  ,'$location'
  ,projectSettingsCtrl
  ]);

function projectSettingsCtrl($scope
                           , $http
                           , $location
                           ) {
  $scope.error = null;
  $scope.isAdmin = $location.search().isAdmin;

  // private vars
  var self = this;
  
  // private functions
  this.init = function() {

  }
  
  $scope.reset = function() {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/reset'
            ;
    $http.post(url)
      .then(function(resp) {
        $scope.error = null;
//        $location.path('/project/'+$scope.projectid+'/harvest');
        alert('Your project has been reset')
        $scope.show_projectsettings_panel = false;
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  $scope.learnSupervised = function() {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/train'
            ;
    $http.post(url)
      .then(function(resp) {
        $scope.error = null;
        $location.path('/project/'+$scope.projectid+'/harvest');
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  this.init();
}