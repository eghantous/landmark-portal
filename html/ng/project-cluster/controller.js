app.controller('projectClusterCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,projectClusterCtrl
  ]);

function projectClusterCtrl($scope
                          , $http
                          , $routeParams
                           ) {
  $scope.INITIAL_PAGE_LIMIT = 5;
  $scope.projectid = $routeParams.projectid;
  $scope.clusterid = null;
  $scope.clusters = null;
  $scope.clusterId2ClusterMap = {};
  $scope.addPagesInfo = null;
  $scope.selected = [];
  $scope.pageset = null;
  $scope.prevtargetClusterIdx = -1;
  $scope.targetClusterIdx = -1;

  // private vars
  var self = this;
  
  // private functions
  this.init = function() {
    console.log('cluster config for ' + $routeParams.projectid);
    var url = '/project/'+$routeParams.projectid+'/clusters';
//    var url = '/ng/project-cluster/sample-get_clusters.json';
    $http.get(url)
      .then(function(resp) {
        $scope.clusters = resp.data;
        for(var i=0; i<$scope.clusters.length; i++) {
          var cluster = $scope.clusters[i];
          cluster.train_limit = $scope.INITIAL_PAGE_LIMIT;
          cluster.test_limit = $scope.INITIAL_PAGE_LIMIT;
          cluster.other_limit = $scope.INITIAL_PAGE_LIMIT;
          $scope.clusterId2ClusterMap[cluster.id] = cluster;
          if( cluster.selected ) {
            $scope.targetClusterIdx = i;
            $scope.prevtargetClusterIdx = i;
            $scope.clusterid = cluster.id;
          }
          self.decoratePages(cluster.train, 'train', cluster.id);
          self.decoratePages(cluster.test, 'test', cluster.id);
          self.decoratePages(cluster.other, 'other', cluster.id);
        }
      });
  }
  
  this.decoratePages = function(pages, pageType, clusterId) {
    for(var i=0; i<pages.length; i++) {
      pages[i].type = pageType;
      pages[i].clusterId = clusterId;
    }
  }
  
  // scope functions
  
  
  $scope.selectCluster = function(clusterIdx, cluster) {
    console.log('select cluster[' + clusterIdx + '].id = ' + cluster.id);
    console.log('targetClusterIdx: ' + $scope.prevtargetClusterIdx + ' to ' + $scope.targetClusterIdx);

//    /project/:projectid/cluster/:clusterid/choose
    var url = '/project'
            + '/' + $routeParams.projectid
            + '/cluster'
            + '/' + cluster.id
            + '/choose'
            ;
    $http.put(url)
      .then(function(resp) {
        // remove old target cluster
        var oldTargetcluster = $scope.clusters[$scope.prevtargetClusterIdx];
        if( oldTargetcluster ) {
          oldTargetcluster.selected = false;
        }
        $scope.prevtargetClusterIdx = clusterIdx;

        // add new target cluster
        cluster.selected = true;

        $scope.clusterid = cluster.id;
      })
  }

  $scope.renamePage = function(page, pagename) {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/page/' + page.page_id
            + '/rename/' + pagename
            ;
    $http.put(url)
      .then(function(resp) {
        $scope.error = null;
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
//  $scope.getPages = function(cluster, pageType) {
//    var url = '/pages'
//            + '/' + $routeParams.projectid
//            + '/' + cluster.id
//            + '/' + pageType
//            ;
//    $http.get(url)
//      .then(function(resp) {
//        cluster[pageType] = resp.data;
//      })
//  }

  $scope.mergeCluster = function(clusterIdx, cluster) {
    console.log('merge cluster[' + clusterIdx + '].clusterId = ' + cluster.id);

    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusters[$scope.targetClusterIdx].id
            + '/merge/' + cluster.id
            ;
    $http.post(url)
      .then(function(resp) {

        var targetCluster = $scope.clusters[$scope.targetClusterIdx];
        targetCluster.train_pages += cluster.train_pages;
        Array.prototype.push.apply(targetCluster.train, cluster.train);
        targetCluster.test_pages += cluster.test_pages;
        Array.prototype.push.apply(targetCluster.test, cluster.test);
        targetCluster.other_pages += cluster.other_pages;
        Array.prototype.push.apply(targetCluster.other, cluster.other);

        $scope.clusters.splice(clusterIdx, 1);
      });
  }

  $scope.beginAddPages = function(cluster, pageType) {
    $scope.addPagesInfo = {clusterId: cluster.id
                         , pageType: pageType};
    $scope.pageset = cluster[pageType];
  }

  $scope.cancelAddPages = function() {
    $scope.addPagesInfo = null;
    $scope.pageset = null;
    $scope.unselectAll();
  }

  $scope.movePages = function() {
    if( $scope.addPagesInfo ) {
      var url = '/project'
              + '/' + $routeParams.projectid
              + '/cluster'
              + '/' + $scope.addPagesInfo.clusterId
              + '/pages/move/' + $scope.addPagesInfo.pageType
              ;
//      $scope.addPagesInfo['pages'] = $scope.selected;
      var page_ids = [];
      for(var i=0; i<$scope.selected.length; i++) {
        page_ids.push($scope.selected[i].page_id);
      }
      $http.post(url, {page_ids:page_ids})
        .then(function(resp) {
          
          $scope.selected.forEach(function(page) {
            // remove from original cluster
            if( page.clusterId && page.type ) {
              var cluster = $scope.clusterId2ClusterMap[page.clusterId];
              if( cluster ) {
                var pageset = cluster[page.type];
                var index = indexOf(pageset, page);
                if( index > -1 ) {
                  pageset.splice(index, 1);
                  // decrement num of pages
                  if( page.type == 'train' ) {
                    cluster.train_pages--;
                  } else
                  if( page.type == 'test' ) {
                    cluster.test_pages--;
                  } else
                  if( page.type == 'other' ) {
                    cluster.other_pages--;
                  }

                }
              }
            }
            
            // change page.type
            page.type = $scope.addPagesInfo.pageType;

          })
          // copy selected pages into dest pageset
          Array.prototype.push.apply($scope.pageset, $scope.selected);
          var cluster = $scope.clusterId2ClusterMap[$scope.addPagesInfo.clusterId];
          if( $scope.addPagesInfo.pageType == 'train' ) {
            cluster.train_pages += $scope.selected.length;
          } else
          if( $scope.addPagesInfo.pageType == 'test' ) {
            cluster.test_pages += $scope.selected.length;
          } else
          if( $scope.addPagesInfo.pageType == 'other' ) {
            cluster.other_pages += $scope.selected.length;
          }
          $scope.cancelAddPages();
        })
    }
  }

  /*
  function getPageset(page) {
    if( page.clusterId && page.pageType ) {
      var cluster = $scope.clusterId2ClusterMap[page.clusterId];
      if( cluster ) {
        return cluster[page.pageType];
      }
    }
    return null;
  }
  */

  function indexOf(pages, page) {
    var index = -1;
    for(var i=0; i<pages.length; i++) {
      if( pages[i].file == page.file ) {
        index = i;
        break;
      }
    }
    return index;
  }

  $scope.toggleSelect = function(cluster, pageType, page) {
    if( page.isSelected ) {
      var pageset = cluster[pageType];
      if( $scope.pageset != null && $scope.pageset!=pageset) {
//        page.isSelected = true;
        page.clusterId = cluster.id;
        page.type = pageType;
//          page.pageset = pageset;
        $scope.selected.push(page);
      }
    } else {
//      page.isSelected = false;
      $scope.selected = $scope.selected.filter(function(p) {
        return p.file !== page.file;
      })
    }
  }

  $scope.unselectAll = function() {
    $scope.selected.forEach(function(page) {
      page.isSelected = false;
    });
    $scope.selected = [];
  }

  /****************************
   * General
   ****************************/
  
  $scope.togglePanel = function(panelId) {
    if( panelId == 'page-select' ) {
      $scope.show_pageselect_panel = !$scope.show_pageselect_panel;
      $scope.show_schemaedit_panel = false;
      $scope.show_projectsettings_panel = false;
    } else
    if( panelId == 'schema-edit' ) {
      $scope.show_pageselect_panel = false
      $scope.show_schemaedit_panel = !$scope.show_schemaedit_panel;
      $scope.show_projectsettings_panel = false;
    } else
    if( panelId == 'project-settings' ) {
      $scope.show_pageselect_panel = false;
      $scope.show_schemaedit_panel = false;
      $scope.show_projectsettings_panel = !$scope.show_projectsettings_panel;
    }
  }
  
  this.init();
}