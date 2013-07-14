(function(App) {
App.Models.SoundCloud.User = App.Models.SoundCloud.Base.extend({

  url: function() {
    return "/users/" + this.get("id");
  },

  parse: function(data, options) {
    return _.pick(data,
      "id",
      "username",
      "track_count",
      "followings_count",
      "public_favorites_count",
      "avatar_url");
  },

  my_activities: function(url, options, next) {
    var that = this;
    SC.get(url, options, function(result) {
      next( result["next_href"], _.map(result["collection"], function(i) {
        return new App.Models.SoundCloud.Track(i["origin"], { parse: true });
      }) );
    });
  },
  
  my_activities_on: function(days_ago, next) {
    var tracks = [];
    var day_begin = moment().startOf("day").subtract("days", days_ago);
    var day_end   = moment().startOf("day").add("days", 1 - days_ago);
    var that = this;
    (function recur(url) {
      that.my_activities(url, {type: "track"}, function(next_href, data) {
        var oldest_track = _.last(data);
        if(!moment(oldest_track.get("created_at")).isAfter(day_end)) {
          tracks = tracks.concat(_.filter(data, function(i) {
            var t = moment(i.get("created_at"));
            return t.isAfter(day_begin) && t.isBefore(day_end);
          }));
        }
        if(moment(oldest_track.get("created_at")).isAfter(day_begin)) {
          recur(next_href);
        } else {
          next(tracks);
        }
      });
    })("/me/activities");
  },

  favorite_track: function(track, next) {
    SC.put(this.url() + "/favorites/" + track.get("id"), function() {
      if(_.isFunction(next))
        next();
    });
  },

  unfavorite_track: function(track, next) {
    SC.delete(this.url() + "/favorites/" + track.get("id"), function() {
      if(_.isFunction(next))
        next();
    });
  }

});

})(App);
