app.controller('googleAuthCtrl',
  ['$scope'
  ,'$http'
  ,googleAuthCtrl
  ]);

function googleAuthCtrl($scope
                      , $http
                      ) {
  $scope.loginError = null;
  $scope.profile = null;
    
  // private vars
  var self = this;
  
  // private functions
  this.init = function() {

  }
  
  // scope functions
  $scope.logIn = function(googleUser) {
    $scope.loginError = null;
    
    var profile = googleUser.getBasicProfile();
    
    if( profile.getEmail() == 'sseguest@gmail.com'
    ||  profile.getEmail().endsWith('@inferlink.com') ) {
      $scope.$apply(function () {
        $scope.profile = {
          id: profile.getId(),
          name: profile.getName(),
          img: profile.getImageUrl(),
          email: profile.getEmail()
        }
      });
    } else {
      $scope.logOut();
      $scope.loginError = 'You must login with a valid gmail account';
    }
  }
  
  $scope.logOut = function() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      $scope.$apply(function () {
        $scope.profile = null;
      });
    });
  }

  this.init();
}