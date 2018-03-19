app.controller('projectRedirectCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,'$location'
  ,projectRedirectCtrl
  ]);

function projectRedirectCtrl($scope
                           , $http
                           , $routeParams
                           , $location
                           ) {
  $scope.error = null;
  

  // private vars
  var self = this;
  
  // private functions
  this.init = function() {

    var url = '/project'
            + '/' + $routeParams.projectid
            + '/status'
            ;
    $http.get(url)
      .then(function(resp) {
        $scope.error = null;

        var clusterid = resp.data.selected_cluster_id;
        var url = '/project/' + $routeParams.projectid
                + '/cluster/' + clusterid
                + '/' + $routeParams.route
                ;
        $location.path(url)
                 .replace(); // change url without adding to history
       
      })
      .catch(function(err) {
        $scope.error = err.data;
      });

  }
  


  
  this.init();
}