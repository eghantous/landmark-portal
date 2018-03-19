app.controller('projectFixRedirectCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,'$location'
  ,projectFixRedirectCtrl
  ]);

function projectFixRedirectCtrl($scope
                              , $http
                              , $routeParams
                              , $location
                              ) {
  $scope.error = null;
  

  // private vars
  var self = this;
  
  // private functions
  this.init = function() {

//    var url = '/ng/project-fix/sample-get_pages.json';
    var url = '/project'
            + '/' + $routeParams.projectid
            + '/cluster'
            + '/' + $routeParams.clusterid
            + '/pages'
            ;
    $http.get(url)
      .then(function(resp) {
        $scope.error = null;

        var page = resp.data[0].page_id;
        var url = '/project'
                + '/' + $routeParams.projectid
                + '/cluster'
                + '/' + $routeParams.clusterid
                + '/fix'
                + '/' + page;
        $location.path(url)
                 .replace(); // change url without adding to history
       
      })
      .catch(function(err) {
        $scope.error = err.data;
      });

  }
  


  
  this.init();
}