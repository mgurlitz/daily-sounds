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
    $("#connect-btn").on("click", function() {
      SC.connect(function() {
        document.cookie = "sc_token=" + SC.accessToken();
        next();
      });
    });
  }
}

soundcloud_init(function() {
  $("#connect-message").hide();

  var username = location.search.substring(1);
  if(username == "") {
    window.location = "index.html";
    return;
  }

  SC.get("/resolve.json?url=http://soundcloud.com/" + username, function(result) {
    var user = new App.Models.SoundCloud.User(result);
    user.tracks({limit: 100}, function(i) {
      var widget = new App.Views.ArtistView({
        model: new Backbone.Model({ tracks: i, artist: user }),
        el: "#artist"
      });
      widget.render();
    });
  });

  App.Views.SoundCloudWidget = new App.Views.SoundCloudWidgetView({ el: $("#player") });
});

})(App);


