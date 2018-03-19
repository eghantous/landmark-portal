app.controller('byCrawlCtrl',
  ['$scope'
  ,'$http'
  ,'$location'
  ,byCrawlCtrl
  ]);

function byCrawlCtrl($scope
                    , $http
                    , $location
                    ) {
  $scope.error = null;
  
  $scope.crawlInfo = {
    name: '',
    depth: 3,
    prefer_pagination: false,
    concurrent_requests: 16,
    concurrent_requests_per_domain: 16,
    duration: 3,
    error_page_percentage: 50,
    error_page_percentage_period: 30
  };
  
  // private vars
  var self = this;
  
  // private functions
  this.init = function() {
//    $scope.$watch('profile', function(newProfile) {
//      if( newProfile ) {
//        $scope.email = newProfile.email;
//      }
//    })
  }
  
  // scope functions
  
  $scope.harvest = function() {
    $scope.crawlInfo.name = $scope.projectName;
    $scope.crawlInfo.email = $scope.email;
    var url = '/project/create_harvest';
    $http.post(url, $scope.crawlInfo)
      .then(function(resp) {
        $scope.error = null;
        console.log(resp.data);
        $location.path('/project/'+resp.data.project_id+'/harvest');
        
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }  
  
 
  this.init();
}