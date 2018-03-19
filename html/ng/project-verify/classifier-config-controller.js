app.controller('classifierConfigCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,'$location'
  ,classifierConfigCtrl
  ]);

function classifierConfigCtrl($scope
                           , $http
                           , $routeParams
                           , $location
                          ) {

  $scope.classifier = {}

  // private vars
  var self = this;
  
  /*******************
   * private functions
   *******************/
  
  this.init = function() {
    $scope.getClassifier()
  }
  
  
  /*****************
   * scope functions
   *****************/

   $scope.getClassifier = function() {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/get_classifier'
            ;
    return $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.classifier = resp.data;
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  $scope.updateClassifier = function(classifier) {
    console.log(classifier);
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/classifier/' + classifier
            ;
    $http.put(url)
      .then(function(resp) {
        $scope.error = null;
      })
      .then(function(resp){
        $scope.getVerifyData();
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }

  this.init();
}