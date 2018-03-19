app.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    }

    return auth;
});

app.factory('TokenInterceptor', function ($q, $window, $location, $rootScope, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.localStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.localStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.localStorage.token;
                AuthenticationService.isAuthenticated = false;
                AuthenticationService.isAdmin = null;

                $rootScope.nextPath = rejection.config.url;
                $location.path("/login");
            }

            return $q.reject(rejection);
        }
    };
});

app.factory('UserService', function ($http) {
    return {
        signIn: function(username, password) {
            return $http.post('/user/signin', {username: username, password: password});
        },

        logOut: function() {
            return $http.get('/user/logout');
        },
      
        changePassword: function(username, password, newpassword) {
            return $http.post('/user/password',
                              { username: username
                              , password: password
                              , newpassword: newpassword});
        },

        resetPassword: function(username, resetToken, newpassword) {
            return $http.post('/user/password/reset',
                              { username: username
                              , resetToken: resetToken
                              , newpassword: newpassword});
        }
      
    }
});
