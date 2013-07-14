(function(App) {

function soundcloud_init(next) {
  SC.initialize({
    client_id: "",
    redirect_uri: ""
  });

  function getCookie(sKey) {
    return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  }

  var sc_token = getCookie("sc_token");
  if(sc_token) {
    SC.accessToken(sc_token);
    next();
  } else {
    SC.connect(function() {
      document.cookie = "sc_token=" + SC.accessToken();
      next();
    });
  }
}

soundcloud_init(function() {
  App.current_user = new App.Models.SoundCloud.User({url: "/me"});
  App.current_user.fetch();
  App.current_user.on("sync", function() {
    var days_ago = parseInt(location.search.substring(1));
    if(isNaN(days_ago) || days_ago < 0)
      days_ago = 0;
    if(days_ago > 4)
      days_ago = 4;

    App.current_user.my_activities_on(days_ago, function(tracks) {
      var tracks_by_author = _.groupBy(tracks, function(i) { return i.get("user")["id"] });
      var widget = new App.Views.DayView({
        model: new Backbone.Model({
          "artists": tracks_by_author,
          "days_ago": days_ago
        }),
        el: "#days-list"
      });
      widget.render();
    });
  });
  App.Views.SoundCloudWidget = new App.Views.SoundCloudWidgetView({ el: $("#player") });
});

})(App);

