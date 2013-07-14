(function(App) {

App.Models.SoundCloud.Track = App.Models.SoundCloud.Base.extend({

  parse: function(data, options) {
    return _.pick(data,
      "id",
      "stream_url",
      "title",
      "permalink_url",
      "user",
      "user_favorite",
      "created_at",
      "duration"
    );
  },

});

})(App);

