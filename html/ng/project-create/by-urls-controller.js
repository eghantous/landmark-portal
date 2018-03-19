app.controller('byUrlsCtrl',
  ['$scope'
  ,'$http'
  ,'$location'
  ,byUrlsCtrl
  ]);

function byUrlsCtrl($scope
                    , $http
                    , $location
                    ) {
  $scope.error = null;
  $scope.stuburl = null;
  $scope.urls = [];

  
  // private vars
  var self = this;
  
  // private functions
  this.init = function() {
  }
  
  // scope functions
  
  $scope.urlEntered = function($event) {
    var url = $scope.stuburl;
    if( url && url != '' ) {
      $scope.urls.push(url);
      $scope.stuburl = '';
      $event.target.focus();
    }
  }

  $scope.urlChange = function($index, url) {
    if( !url || url == '' ) {
      if( $index < $scope.urls.length ) {
        $scope.urls.splice($index, 1);
      }
    }
  }
  
  $scope.buildProjectByUrl = function() {
    data = {
        name: $scope.projectName,
        email: $scope.email,
        urls: $scope.urls
    };
    console.log(data);
    
    var url = '/project/create_by_urls';
    $http.post(url, data)
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