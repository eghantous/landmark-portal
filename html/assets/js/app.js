var app = angular.module('Landmark',
            ['ngRoute'
            ,'ngSanitize'
            ,'ui.bootstrap'
//            ,'appServices'
            // ,'angucomplete-alt'
            ,'angularUtils.directives.dirPagination'
            ,'xeditable'
            ,'frapontillo.bootstrap-switch'
            ,'treeGrid'
            ,'ui.tree'
            ,'duScroll'
            ,'dirPageStruct'
            ]);

//var appServices = angular.module('appServices', []);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/project/select'
      })
      .when('/project/create', {
        templateUrl: '/ng/project-create/template.html'
//        , access: { requiredAuthentication: true }
      })
      .when('/project/select', {
        templateUrl: '/ng/project-select/template.html'
//        , access: { requiredAuthentication: true }
      })
      .when('/project/:projectid/harvest', {
        templateUrl: '/ng/project-harvest/template.html'
//        , access: { requiredAuthentication: true }
      })
      .when('/project/:projectid/cluster', {
        templateUrl: '/ng/project-cluster/template.html'
//        , access: { requiredAuthentication: true }
      })
      .when('/project/:projectid/cluster/:clusterid/skim', {
        templateUrl: '/ng/project-skim/template.html'
//        , access: { requiredAuthentication: true }
      })
      .when('/project/:projectid/cluster/:clusterid/verify', {
        templateUrl: '/ng/project-verify/template.html'
//        , access: { requiredAuthentication: true }
      })
      .when('/project/:projectid/cluster/:clusterid/fix', {
        template: '<div class="error"></div>',
        controller: "projectFixRedirectCtrl"
//        , access: { requiredAuthentication: true }
      })
      .when('/project/:projectid/cluster/:clusterid/fix/:pageid', {
        templateUrl: '/ng/project-fix/template.html'
//        , access: { requiredAuthentication: true }
      })
      .when('/project/:projectid/cluster/:clusterid/deliver', {
        templateUrl: '/ng/project-deliver/template.html'
//        , access: { requiredAuthentication: true }
      })
      .when('/project/:projectid/redirect/:route', {
        template: '<div class="error"></div>',
        controller: "projectRedirectCtrl"
//        , access: { requiredAuthentication: true }
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.directive('repeatDone', function() {
  return function(scope, element, attrs) {
    if (scope.$last) { // all are rendered
      scope.$eval(attrs.repeatDone);
    }
  }
});

app.filter('trustUrl', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
});

app.filter("emptyToEnd", function () {
    return function (array, key) {
        if(!angular.isArray(array)) return;
        var present = array.filter(function (item) {
            return item[key];
        });
        var empty = array.filter(function (item) {
            return !item[key]
        });
        return present.concat(empty);
    };
});

app.filter('startsWith', function() {
  return function(items, prefix, itemProperty) {
    if( items ) {
      if( prefix ) {
        return items.filter(function(item) {
          var findIn = itemProperty ? item[itemProperty] : item;
          return findIn.toString().indexOf(prefix) === 0;
        });
      } else {
        return items;
      }
    } else {
      return [];
    }
  };
})

/**
 * angular-scroll options
 */
app.value('duScrollDuration', 500)
   .value('duScrollOffset', 50);