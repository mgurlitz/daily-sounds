(function(App) {

App.Models.SoundCloud = {};
App.Models.SoundCloud.Base = Backbone.Model.extend({

  sync: function(method, model, options) {
    SC.get(model.get("url"), function(result) {
      options.success(result);
    });
  }

});

})(App);

