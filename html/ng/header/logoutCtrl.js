app.controller('logoutCtrl', ['$scope', '$rootScope','$location', '$window', 'UserService', 'AuthenticationService', logoutCtrl]);

function logoutCtrl($scope, $rootScope, $location, $window, UserService, AuthenticationService) {

    var self = this;

    this.init = function() {
        $rootScope.isAdmin = null;
        if($window.localStorage.token) {
          var decoded = jwt_decode($window.localStorage.token);
          $rootScope.userlogin = decoded.user.email;
          AuthenticationService.isAdmin = Boolean(decoded.user.isAdmin);
          $rootScope.isAdmin = AuthenticationService.isAdmin;
        }
    }

    $scope.logOut = function logOut() {
      console.log('logging out')
      $rootScope.isAdmin = null;
      $rootScope.userlogin = null;
        if (AuthenticationService.isAuthenticated) {
            UserService.logOut().success(function(data) {
                AuthenticationService.isAuthenticated = false;
                AuthenticationService.isAdmin = null;
                delete $window.localStorage.token;
                $location.path("/login");
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        }
        else {
            $location.path("/login");
        }
    }

    this.init();
}