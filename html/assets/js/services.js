app.service('loginService', function() {
  var profile = null;
  
  return {
    setProfile: function(aProfile) { profile = aProfile; },
    getProfile: function() { return profile; }
  }
});