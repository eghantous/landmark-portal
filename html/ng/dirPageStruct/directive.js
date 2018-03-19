angular.module('dirPageStruct', [])
  .directive('pageStruct', function() {
    return {
      restrict: 'E',
      templateUrl: 'ng/dirPageStruct/template.html',
      scope: {projectid: '=',clusterid: '=', page: '='},
      controller: function($scope) {
        this.init = function() {
          if( !$scope.page.thumbnail_url ) {
            if( $scope.page.type=='test') {
              $scope.page.thumbnail_url = '/assets/img/no_thumbnail.jpg';
            } else {
//              var screenshot_srv = 'http://52.23.232.73:8050/render.png?width=400&height=400&url=';
//              var pageurl = 'http://sse.inferlink.com:3333'
//                          + '/project/'+$scope.projectid
//                          + '/cluster/'+$scope.clusterid
//                          + '/page/'+$scope.page.page_id
//                          + '/html/cached'
//                          ;
//              $scope.page.thumbnail_url = screenshot_srv + pageurl;
              $scope.page.thumbnail_url = '/assets/img/no_thumbnail.jpg';
            }
          }
        };
        
        this.init();
      }
    };
  });