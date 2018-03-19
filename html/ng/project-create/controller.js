app.controller('projectCreateCtrl',
  ['$scope'
  ,'$http'
  ,'$location'
  ,projectCreateCtrl
  ]);

function projectCreateCtrl($scope
                        , $http
                        , $location
                        ) {
  $scope.error = null;
  $scope.projectName = '';
  $scope.email;
  
  // private vars
  var self = this;
  
  // private functions
  this.init = function() {
    $scope.$watch('profile', function(newProfile) {
      if( newProfile ) {
        $scope.email = newProfile.email;
      }
    })
  }
  
  // scope functions
  

  this.init();
}