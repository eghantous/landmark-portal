app.controller('projectDeliverCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,projectDeliverCtrl
  ]);

function projectDeliverCtrl($scope
                          , $http
                          , $routeParams
                          ) {
  $scope.error = null;
  $scope.projectid = $routeParams.projectid;
  $scope.clusterid = $routeParams.clusterid;

  // private vars
  var self = this;
  
  // private functions
  this.init = function() {
  }
  
  // scope functions
  
  $scope.publish = function() {
    $scope.success = null;
    $scope.error = null;
    
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/data/publish'
            ;
    $http.post(url)
      .then(function(resp) {
        $scope.success = 'Publish Successful';
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
	$scope.deleteProject = function(project_folder) {
      if (confirm('Are you sure you want to delete ' + project_folder + '?')) {
        var postdata = {
            project_folder: project_folder
        };

        $http({
          method: 'POST',
          data: postdata,
          url: '/project_folder/delete'
        })
        .then(function successCallback(response) {
          $http({
                method: 'GET',
                url: '/project_folders'
              }).then(function successCallback(response) {
                  $scope.project_folders = response.data.project_folders;

                  $http({method:"GET", url:"/project_folders"}).then(function(response){
                      $rootScope.project_folders = response.data.project_folders;


                      $rootScope.filtered_project_folders = ["-- Select Project --"];
                      $rootScope.selected_project_folder = "-- Select Project --";

                      for (var i in $rootScope.project_folders) {
                          if($rootScope.project_folders[i].indexOf($rootScope.project_filter) > -1) {
                              $rootScope.filtered_project_folders.push($rootScope.project_folders[i]);
                          }
                      }
                      $rootScope.filtered_project_folders.push("+ Add New Project");

                      // $rootScope.project_folders.push("+ Add New Project");
                      // $rootScope.project_folders.unshift("-- Select Project --");
                  });
                }, function errorCallback(response) {
                      console.log(response);
                });
        }, function errorCallback(response) {
          console.log(response);
        });
      }
	};
  
  this.init();
}