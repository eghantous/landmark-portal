app.controller('projectSkimCtrl',
  ['$scope'
  ,'$http'
  ,'$routeParams'
  ,'$location'
  ,projectSkimCtrl
  ]);

function projectSkimCtrl($scope
                       , $http
                       , $routeParams
                       , $location
                        ) {
  $scope.error = null;
  $scope.onHover = {};
  $scope.projectid = $routeParams.projectid;
  $scope.clusterid = $routeParams.clusterid;
  $scope.invalidcells = {};
  $scope.defaultFields = [];
  
  // private vars
  var MAX_FIELDNAME_SIZE = 30;
  var self = this;
  
  /*******************
   * private functions
   *******************/
  
  this.init = function() {
    this.getGridData()
      .then(function() {
        $scope.updateFields();
      })
  }
  
  this.getGridData = function() {
    // reset results
    $scope.grid = {};    
    
//    var url = '/ng/project-verify/sample-get_griddata2.json';
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/data/grid'
            ;
    // get Stuff
    return $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.grid = resp.data;
        for(var i=0; i<$scope.grid.pages.length; i++) {
          $scope.grid.pages[i].isExpanded = false;
          self.checkForValidationErrors($scope.grid.fields, $scope.grid.pages[i]);
        }
        
      })
      .catch(function(err) {
        $scope.error = err.statusText;
      });
  }
  
  this.getDefaultFields = function() {
    // reset results
    $scope.defaultFields = [];  
    
    var url = '/project/' + $scope.projectid
            + '/field_names'
            ;
    // get Stuff
    return $http.get(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.defaultFields = resp.data.sort();
        for(var i=0; i<$scope.defaultFields.length; i++) {
          for(var j=0; j<$scope.grid.fields.length; j++) {
            var field = $scope.grid.fields[j];
            if( $scope.defaultFields[i] == field.name ) {
              self.updateDefaultFields(field.name);
              break;
            }
          }
        }
      })
      .catch(function(err) {
        $scope.error = err.statusText;
      });
  }
  
  this.updateDefaultFields = function(takenField) {
    var isUpdated = false;
    for(var i=0; i<$scope.defaultFields.length; i++) {
      if( $scope.defaultFields[i] == takenField ) {
        var name;
        var id;
        var delimIdx = takenField.lastIndexOf('-');
        if( delimIdx > -1 ) {
          name = takenField.substring(0,delimIdx);
          id = parseInt(takenField.substring(delimIdx+1));
          if( !isNaN(id) ) {
            id++;
          } else {
            name = takenField;
            id = 2;
          }
        } else {
          name = takenField;
          id = 2;
        }
        var newField = name+'-'+id;
        $scope.defaultFields[i] = newField;
        isUpdated = true;
        break;
      }
    }
    
    if( isUpdated ) {
      this.createFieldOptions();
    }
  }
  
  this.createFieldOptions = function() {
    for(var i=0; i<$scope.grid.fields.length; i++) {
      var field = $scope.grid.fields[i];
      field.nameOptions = $scope.defaultFields.slice();
      if( field.nameOptions.indexOf(field.name) == -1 ) {
        field.nameOptions.push(field.name);
      }
      self.formatLabels(field.nameOptions);
      self.selectFieldName(field);
    }
  }
  
  /**
   * Need to shorten field names. Since shortened fieldnames
   * will differ from actual field name, we need to create
   * an object to store the original fieldname val and the shortened
   * fieldname label to display
   **/
  this.formatLabels = function(nameOptions) {
    for(var i=0; i<nameOptions.length; i++) {
      var origName = nameOptions[i];
      var formattedName = origName;
      if( origName.length > MAX_FIELDNAME_SIZE ) {
        formattedName = origName.substr(0, MAX_FIELDNAME_SIZE/2-2)
                      + '...'
                      + origName.substr(origName.length-(MAX_FIELDNAME_SIZE/2)+2)
                      ;
      }
      nameOptions[i] = {origName: origName, displayName: formattedName};
    }
  }
  
  this.selectFieldName = function(field) {
    for(var i=0; i<field.nameOptions.length; i++) {
      if( field.name == field.nameOptions[i].origName ) {
        field.fnameOption = field.nameOptions[i];
        break;
      }
    }
  }
  
  this.checkForValidationErrors = function(headerfields, page) {
    for(var i=0; i<headerfields.length; i++) {
      var fieldvalues = page.fields[headerfields[i].schemaid];
      for(var j=0; j<fieldvalues.length; j++) {
        if( fieldvalues[j].valid == false ) {
          page.valid = false;
          headerfields[i].valid = false;
          
          var pagecells = $scope.invalidcells[page.page_id];
          if( !pagecells ) {
            pagecells = {};
            $scope.invalidcells[page.page_id] = pagecells;
          }
          pagecells[headerfields[i].schemaid] = true;
        }
      }
    }
  }
  
  /*****************
   * scope functions
   *****************/
  

  
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
  
  
  
  $scope.renameSchemaNode = function(fieldNode) {
    fieldNode.name = fieldNode.fnameOption.origName;
    self.updateDefaultFields(fieldNode.name);
    fieldNode.mapped = true;
    
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/field/' + fieldNode.schemaid
            + '/rename/' + fieldNode.name
            ;
    $http.put(url)
      .then(function(resp) {
        $scope.error = null;
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
  }
  
  $scope.updateFields = function() {
    self.getDefaultFields()
      .then(function() {
        self.createFieldOptions();
      });
  }
  
  $scope.delField = function(field, index) {
    var url = '/project/' + $scope.projectid
            + '/cluster/' + $scope.clusterid
            + '/field/' + field.schemaid
            ;
    $http.delete(url)
      .then(function(resp) {
        $scope.error = null;
        $scope.grid.fields.splice(index, 1);
      })
      .catch(function(err) {
        $scope.error = err.data;
      });
    
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