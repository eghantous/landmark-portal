app.controller('projectFixCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,'$sce'
  ,'$document'
  ,projectFixCtrl
  ]);

function projectFixCtrl($scope
                      , $http
                      , $routeParams
                      , $sce
                      , $document
                      ) {
  $scope.error = null;
  $scope.schema = [];
  $scope.pages = [];
  $scope.projectid = $routeParams.projectid;
  $scope.clusterid = $routeParams.clusterid;
  $scope.pagename = null;
  $scope.pageid = $routeParams.pageid;
  $scope.activepage = null;
  $scope.cachedPageSource = null;
//  $scope.livePageSource = null;
    
  // tree-grid-directive
  $scope.expanding_property = {
      field: 'Name',
      displayName: 'Name'
  };
  $scope.col_defs = [
      {field:'Markup'}
    , {field:'Extraction'}
  ];
  $scope.page_data = [];
  $scope.tree_control = {};
  $scope.page_state = {
    isPageExpanded: true,
    isRowValuesExpanded: false
  }
//  $scope.isPageExpanded = true;
//  $scope.isRowValuesExpanded = false;
  $scope.tree_control.page_state = $scope.page_state;
  
  // private vars
  var self = this;
  
  // private functions
  this.init = function() {
    $scope.getSchema();
    $scope.getPages();
//    $scope.getPage('sample-page5.json');
    $scope.getPage($scope.pageid);
  }
  
  // scope functions

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
  
  /****************************
   * Page-Select
   ****************************/

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
  
  /****************************
   * Schema-Edit
   ****************************/
  
  $scope.schema_state = {};
  
  $scope.renameSchemaNode = function(node, newName) {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/field/' + node.schemaid
            + '/rename/' + newName
            ;
    $http.put(url)
      .then(function(resp) {
        $scope.error = null;
        renameMarkupNodes(node.schemaid, newName);
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  function addMarkupNodeToPage(parentSchemaNode, newDataNode) {
    if( !parentSchemaNode.schemaid || parentSchemaNode.schemaid == '0' ) {
      $scope.page_data.unshift(newDataNode);
    } else {
      for(var i=0; i<$scope.page_data.length; i++) {
        var currNode = $scope.page_data[i];
        if( currNode.children ) {
          if( currNode.schemaid == parentSchemaNode.schemaid ) {
            for(var j=0; j<currNode.children.length; j++) {
              var row = currNode.children[j];
              row.children.unshift(jQuery.extend({}, newDataNode)); // shallow-clone node
            }
          }

          addMarkupNodeToPageRecursively(currNode, parentSchemaNode, newDataNode)
        }
      }
    }
//    saveMarkup();
  }
  
  function addMarkupNodeToPageRecursively(currNode, parentSchemaNode, newDataNode) {
    for(var i=0; i<currNode.children.length; i++) {
      var nextNode = currNode.children[i];
      if( nextNode.children ) {
        if( nextNode.schemaid == parentSchemaNode.schemaid ) {
          for(var j=0; j<nextNode.children.length; j++) {
            var row = nextNode.children[j];
            row.children.unshift(jQuery.extend({}, newDataNode)); // shallow-clone node
          }
        }
        
        addMarkupNodeToPageRecursively(nextNode, parentSchemaNode, newDataNode)
      }
    }
  }
  
  function doesNodeExists(parentNode, newNodeName) {
    var doesNodeExists = false;
    for(var i=0; i<parentNode.list.length; i++) {
      var childNode = parentNode.list[i];
      if( childNode.field.toUpperCase() === newNodeName.toUpperCase() ) {
        doesNodeExists = true;
        break;
      }
    }
    return doesNodeExists;
  }
  
  $scope.addValidation = function(node) {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/field/validation'
            ;
    var rule = {type: node.validType, param: node.validParam};
    var data = {
      fieldid: node.schemaid,
      validation: [rule]
    };
//    console.log(data);
    $http.put(url, data)
      .then(function(resp) {
        $scope.error = null;
        if( !node.validation ) {
          node.validation = [];
        }
        node.validation.push(rule);
//        $scope.cancelAddValidation(node);
        self.syncValidationInMarkup($scope.page_data, node.schemaid)
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  this.syncValidationInMarkup = function(nodes, schemaid) {
    for(var i=0; i<nodes.length; i++) {
      var node = nodes[i];
      if( node.schemaid == schemaid ) {
        self.updateValidationInMarkup(node);
      }
      this.syncValidationInMarkup(node.children, schemaid);
    }
  }
  
  this.updateValidationInMarkup = function(node) {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/field/extraction/validation'
            ;
    var data = {
      fieldid: node.schemaid,
      extract: node.Extraction
    };
    if( node.type == 'list' ) {
      var numChild = (node.children) ? node.children.length : 0;
      data.sequence = Array(numChild);
    }
//    console.log(data);
    $http.put(url, data)
      .then(function(resp) {
        $scope.error = null;
        if( resp.data ) {
          node.valid = resp.data.valid;
          node.validation = resp.data.validation;
        }
      })
      .catch(function(err) {
        $scope.error = err.data;
      });  }
  
  $scope.cancelAddValidation = function(node) {
    node.editValidation = false;
    node.validType = null;
    node.validParam = null;
  }
  
  $scope.delValidation = function(node, rule, idx) {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/field/validation/delete'
            ;
    var data = {
      fieldid: node.schemaid,
      validation: [rule]
    };
//    console.log(data);
    $http.put(url, data)
      .then(function(resp) {
        $scope.error = null;
        node.validation.splice(idx, 1);
//        $scope.cancelAddValidation(node);
        self.syncValidationInMarkup($scope.page_data, node.schemaid)
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  $scope.addItem = function(parentNode, nodeName) {
    
    if( !doesNodeExists(parentNode, nodeName) ) {
      var url = '/project/' + $scope.projectid
              + '/cluster/' + $scope.clusterid
              + '/field/add'
              ;
      var data = {
          name: nodeName
        , parent_id: parentNode.schemaid
        , type: 'item'
      };
      $http.put(url, data)
        .then(function(resp) {
          $scope.error = null;
          var newSchemaId = resp.data;
          var newSchemaNode = {
            schemaid: newSchemaId,
            field: nodeName
          };
          parentNode.list.unshift(newSchemaNode);

          // reset node UI
          parentNode.newItemName = null;
          parentNode.addItem = false;

          var newMarkupNode = {
                    schemaid: newSchemaNode.schemaid,
                    Name: newSchemaNode.field,
                    Markup: '',
                    type: 'item'
                  }
          addMarkupNodeToPage(parentNode, newMarkupNode);
        })
        .catch(function(err) {
          $scope.error = err.data;
        });
    }
  }

  $scope.addList = function(parentNode, nodeName) {
    
    if( !doesNodeExists(parentNode, nodeName) ) {
      var url = '/project/' + $scope.projectid
              + '/cluster/' + $scope.clusterid
              + '/field/add'
              ;
      var data = {
          name: nodeName
        , parent_id: parentNode.schemaid
        , type: 'list'
      };
      $http.put(url, data)
        .then(function(resp) {
          $scope.error = null;
          var newSchemaId = resp.data;
          var newSchemaNode = {
            schemaid: newSchemaId,
            field: nodeName,
            list: []
          }
          parentNode.list.unshift(newSchemaNode);

          // reset node UI
          parentNode.newListName = null;
          parentNode.addList = false;

          var newMarkupNode = {
                    schemaid: newSchemaNode.schemaid,
                    Name: newSchemaNode.field,
                    Markup: '',
                    type: 'list',
                    children: []
                  }
          addMarkupNodeToPage(parentNode, newMarkupNode);
        })
        .catch(function(err) {
          $scope.error = err.data;
        });
    }
  }
  
  $scope.removeSchemaNode = function(node, callBackFn, callBackArg) {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/field/' + node.schemaid
            ;
    console.log(url);
    
    $http.delete(url)
      .then(function(resp) {
        $scope.error = null;
        console.log('resp:' + resp);
        removeNodeFromPage('schemaid', node.schemaid);
        callBackFn(callBackArg);
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  function removeNodeFromPage(idType, idVal) {
    var newPage = [];
    for(var i=0; i<$scope.page_data.length; i++) {
      var currNode = $scope.page_data[i];
      if( currNode[idType] == idVal ) {
        // do nothing to delete it
      } else {
        newPage.push(currNode);
        recursiveRemoveNode(currNode, idType, idVal);
      }
    }
    $scope.page_data = newPage;
  }
  
  function recursiveRemoveNode(currNode, idType, idVal) {
    if( currNode.children ) {
      var newChildren = [];
      for(var i=0; i<currNode.children.length; i++) {
        var nextNode = currNode.children[i];
        if( nextNode[idType] == idVal ) {
          // do nothing to delete it
        } else {
          newChildren.push(nextNode);
          recursiveRemoveNode(nextNode, idType, idVal);
        }
      }
      currNode.children = newChildren;
    }
  }
  
  function getSchemaNode(nodes, schemaid) {
    for(var i=0; i<nodes.length; i++) {
      var node = nodes[i];
      var targetNode = null;
      if( node.schemaid == schemaid ) {
        targetNode = node;
      } else
      if( node.list ) {
        targetNode = getSchemaNode(node.list, schemaid);
      }
      
      if( targetNode ) {
        return targetNode;
      }
    }
    
    return null;
  }
  
  $scope.lastScrollToId = null;
  var scrollToIndex = 0;
  var selectedNode = null;
  
  function scroll(id, scrollToIndex) {
    if( selectedNode ) { // reset last selectedNode
      selectedNode.isPinpointed = false;
    }
    
    var collected = [];
    getNodesBySchemaId($scope.lastScrollToId, collected, $scope.page_data);
    if( collected.length > 0 ) {
    
      if( scrollToIndex < 0 ) {
        scrollToIndex = collected.length + scrollToIndex % collected.length;
      }
      selectedNode = collected[scrollToIndex % collected.length];
      selectedNode.isPinpointed = true;

      var scrollId = 'row-'+selectedNode.markupid;
      var someElement = angular.element(document.getElementById(scrollId));
      $document.scrollToElementAnimated(someElement);

      $scope.show_schemaedit_panel = false;
    }
  }
  
  $scope.scrollToId = function(id) {
    if( id == $scope.lastScrollToId ) {
      scrollToIndex++;
    } else {
      $scope.lastScrollToId = id;
      scrollToIndex = 0;
    }
    
    scroll($scope.lastScrollToId, scrollToIndex);
  }
  
  $scope.scrollToNext = function() {
    scrollToIndex++;
    
    scroll($scope.lastScrollToId, scrollToIndex);
  }

  $scope.scrollToPrev = function() {
    scrollToIndex--;
    
    scroll($scope.lastScrollToId, scrollToIndex);
  }
  
  $scope.clearSearch = function() {
    $scope.lastScrollToId = null;
    scrollToIndex = 0;
    if( selectedNode ) {
      selectedNode.isPinpointed = false;
      selectedNode = null;
    }
  }
  
  /****************************
   * Markup-Edit
   ****************************/
  
  function renameMarkupNodes(schemaid, newName) {
    var collected = [];
    getNodesBySchemaId(schemaid, collected, $scope.page_data);
    if( collected.length > 0 ) {
      for(var i=0; i<collected.length; i++) {
        collected[i].Name = newName;
      }
//      saveMarkup();
    }
  }
    
  /**
   * depth-first search of page_data nodes to collect
   * all which have the given id
   **/
  function getNodesBySchemaId(schemaid, collected, nodes) {
    for(var i=0; i<nodes.length; i++) {
      if( nodes[i].schemaid == schemaid ) {
        collected.push(nodes[i]);
      }
      if( nodes[i].children ) {
        getNodesBySchemaId(schemaid, collected, nodes[i].children);
      }
    }
  }
  
  $scope.tree_control.delRow = function(row) {
    $scope.removeNodeFromPage('markupid', row.branch.markupid);
  }
  
  $scope.tree_control.addRow = function(listRow, rowNum) {
    var parentNode = {markupid: listRow.branch.markupid}
    var schemaNode = getSchemaNode($scope.schema, listRow.branch.schemaid);
    var newDataNode = {
//              schemaid: schemaNode.schemaid,
              markupid: guid(),
              Name: rowNum,
              Markup: '',
              type: 'row',
              children: []
            }
//    console.log('schema:'); console.log($scope.schema);
    buildMarkupRowNode(schemaNode.list, newDataNode.children);
//    console.log(newDataNode);
    addMarkupRow($scope.page_data, parentNode, newDataNode);
//    console.log('page_data:'); console.log($scope.page_data)
    saveMarkup();
    
    listRow.branch.addRow = false;
    listRow.branch.addRowVal = '';
  }
  
  function buildMarkupRowNode(schemaNodeList, newNodeChildren) {
    for(var i=0; i<schemaNodeList.length; i++) {
      var schemaNode = schemaNodeList[i];
      if( schemaNode.list ) {
        // then it's a list
        var newRow = {
            markupid: guid(),
            Name: "1",
            Markup: '',
            type: 'row',
            children: []
        };
        newNodeChildren.push({
            schemaid: schemaNode.schemaid,
            markupid: guid(),
            Name: schemaNode.field,
            Markup: '',
            type: 'list',
            children: [newRow]
        });
        buildRowNode(schemaNode.list, newRow.children);
      } else {
        // then it's an item
        newNodeChildren.push({
            schemaid: schemaNode.schemaid,
            markupid: guid(),
            Name: schemaNode.field,
            Markup: '',
            type: 'item'
        });
      }
    }
  }
  

  function addMarkupRow(nodes, parentSchemaNode, newDataNode) {
    for(var i=0; i<nodes.length; i++) {
      var nextNode = nodes[i];
      if( nextNode.children ) {
        if( nextNode.markupid == parentSchemaNode.markupid ) {
          insertRowInOrder(nextNode.children, newDataNode);
          break;
        }
        
        addMarkupRow(nextNode.children, parentSchemaNode, newDataNode);
      }
    }
  }
  
  /**
   * Insert the row in order.
   * If row index already exists, then this is a noop.
   */
  function insertRowInOrder(rows, newDataNode) {
    var thatIdx = parseInt(newDataNode.Name)
    var i = 0;
    for(; i<rows.length; i++) {
      var thisIdx = parseInt(rows[i].Name);
      if( thisIdx == thatIdx ) {
        return; // duplicate row insertion detected
      } else
      if( thisIdx > thatIdx ) {
        break;
      }
    }
    rows.splice(i, 0, newDataNode);
  }
  
  
  $scope.tree_control.togglePageExpand = function(isPageExpanded) {
    if( !isEmpty($scope.tree_control) ) {
      if( isPageExpanded ) {
        $scope.tree_control.expand_all();
      } else {
        $scope.tree_control.collapse_all();
      }
    }
  }

  function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
  }
  
  $scope.tree_control.applyHighlight = function(map, key) {
    if( $scope.highlightedText ) {
      map[key] = $scope.highlightedText;
      $scope.highlightedText = null;
    }
  }
  
  $scope.tree_control.splitMarkup = function(row) {
    var delimIdx = row.branch.Markup.indexOf(MARKUP_DELIM);
    if( delimIdx > -1 ) {
      row.branch.markupBeg = row.branch.Markup.substr(0, delimIdx);
      row.branch.markupEnd = row.branch.Markup.substr(delimIdx+MARKUP_DELIM.length);
    } else {
      row.branch.markupBeg = '';
      row.branch.markupEnd = '';
    }
    saveMarkup();
  }
  
  $scope.tree_control.combineMarkup = function(row) {
    row.branch.Markup = row.branch.markupBeg + MARKUP_DELIM + row.branch.markupEnd;
    saveMarkup();
  }
  
  function saveMarkup() {
    console.log($scope.page_data);
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/page/' + $scope.pageid
            + '/markup'
            ;
    var data = {markup: $scope.page_data};
    $http.put(url, data)
      .then(function(resp) {
        $scope.error = null;
//        $scope.schema = resp.data;
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
    
  }
  
  /****************************
   * Page-Preview
   ****************************/
  
  $scope.highlightedText = null;
  $scope.highlightText = function() {
    console.log('highlight');
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    $scope.highlightedText = text;
  }
  
  $scope.clearHighlight = function() {
    $scope.highlightedText = null;
  }
  
  /****************************
   * Init Data Fetches
   ****************************/
  
  $scope.getSchema = function() {
    $scope.schema = [];
    
    var url = '/project'
            + '/' + $scope.projectid
            + '/cluster'
            + '/' + $scope.clusterid
            + '/schema'
            ;
    $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.schema = resp.data;
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
    
  
  $scope.getPages = function() {
    // reset results
    $scope.pages = [];
    
//    var url = '/ng/project-fix/sample-get_pages.json';
    var url = '/project'
            + '/' + $scope.projectid
            + '/cluster'
            + '/' + $scope.clusterid
            + '/pages'
            ;
    $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.pages = resp.data;
        for(var i=0; i<$scope.pages.length; i++) {
          if( $scope.pages[i].page_id == $scope.pageid ) {
            $scope.activepage = $scope.pages[i];
            $scope.pagename = $scope.activepage.file;
            break;
          }
        }
        
        var url = '/project/' + $scope.projectid
                + '/cluster/' + $scope.clusterid
                + '/page/' + $scope.activepage.page_id
                + '/html/cached';
        return $http.get(url);
      })
      .then(function(resp) {
        $scope.cachedPageSource = resp.data;
      
        var shadow = angular.element('#cachedPageView')[0].attachShadow({mode:'open'});
        shadow.innerHTML=$scope.cachedPageSource;

//        var url = '/proxy/page';
//        var data = {page:$scope.activepage.live_url}
//        return $http.post(url, data);
      })
//      .then(function(resp) {
//        $scope.livePageSource = resp.data;
//      
//        var shadow = angular.element('#livePageView')[0].attachShadow({mode:'open'});
//        shadow.innerHTML=$scope.livePageSource;
//      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  $scope.getPage = function(page) {
    $scope.page_data = [];
    
//    var url = '/ng/project-fix/'+page;
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/page/' + page
            ;
    $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.page_data = resp.data;
      
//        genSchemaIdInMarkupTree($scope.page_data, '');
//        console.log($scope.page_data);
        genMarkupId($scope.page_data, '');
        processMarkupTree($scope.page_data);
      
        setTimeout(function() {
          $scope.$apply($scope.tree_control.expand_all);
        }, 100);
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
//  function genSchemaIdInMarkupTree(nodes, prefix) {
//    if( nodes ) {
//      for(var i=0; i<nodes.length; i++) {
//        if( nodes[i].type != 'row' ) {
//          var id = prefix+'/'+nodes[i].Name;
//          nodes[i].schemaid = id;
//          genSchemaIdInMarkupTree(nodes[i].children, id);
//        } else { // type:'row'
//          genSchemaIdInMarkupTree(nodes[i].children, prefix);
//        }
//      }
//    }
//  }
  
  /**
   * This id is used primarily to identify the row that 
   * we want to remove in delRow()
   */
  function genMarkupId(nodes, prefix) {
    if( nodes ) {
      for(var i=0; i<nodes.length; i++) {
        nodes[i].markupid = guid();
        genMarkupId(nodes[i].children);
      }
    }
  }

  var MARKUP_DELIM = '##DONTCARE##';
  function processMarkupTree(nodes) {
    if( nodes ) {
      for(var i=0; i<nodes.length; i++) {
        if( nodes[i].Markup ) {
          var delimIdx = nodes[i].Markup.indexOf(MARKUP_DELIM);
          if( delimIdx > -1 ) {
            nodes[i].splitMarkup = true;
            nodes[i].markupBeg = nodes[i].Markup.substr(0, delimIdx);
            nodes[i].markupEnd = nodes[i].Markup.substr(delimIdx+MARKUP_DELIM.length);
          } else {
            nodes[i].splitMarkup = false;
            nodes[i].markupBeg = '';
            nodes[i].markupEnd = '';
          }
        } else {
//          nodes[i].Markup = '';
        }
        processMarkupTree(nodes[i].children);
      }
    }
  }
  
  /**
   * Source from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   */
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
    
  this.init();
}