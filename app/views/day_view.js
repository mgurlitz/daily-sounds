(function(App) {

App.Views.DayView = Backbone.View.extend({

  template: _.template( $("#tmpl-day-view").html() ),
  events: {
    "click .favorite-button": "favorite",
    "click .track-title": "play"
  },

  render: function() {
    this.$el.html( this.template( this.model.toJSON() ) );
  },

  favorite: function(ev) {
    var el = $(ev.currentTarget).parent();
    var tracks = this.model.get("artists")[el.data("artist-id")];
    var the_track = tracks[el.data("track-id")];
    if(the_track.get("user_favorite"))
      App.current_user.unfavorite_track(the_track);
    else
      App.current_user.favorite_track(the_track);

    $("i", ev.currentTarget).toggleClass("icon-heart-empty icon-heart");
  },

  play: function(ev) {
    if(ev.ctrlKey)
      return;

    var el = $(ev.currentTarget).parent();
    var tracks = this.model.get("artists")[el.data("artist-id")];
    var the_track = tracks[el.data("track-id")];
    var track_id = $(".track-item").index(el);

    $(".track-item").removeClass("now-playing");
    el.addClass("now-playing");

    App.Views.SoundCloudWidget.play(the_track);
    App.Views.SoundCloudWidget.after_this_track(function() {
      var next_track = $(".track-item").eq(track_id + 1);
      if(next_track)
        $(".track-title", next_track).trigger("click");
    });
    ev.preventDefault();
  }

});

})(App);

