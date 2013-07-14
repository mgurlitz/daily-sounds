(function(App) {

App.Views.SoundCloudWidgetView = Backbone.View.extend({

  player_options: {
    auto_play: true
  },

  template : _.template( $("#tmpl-sc-widget").html() ),
  widget   : function() {
    if(typeof this._widget === "undefined")
      this.render();
    return this._widget;
  },

  render: function() {
    this.$el.html( this.template( this.model.toJSON() ) );
    this._widget = SC.Widget( $("iframe", this.$el)[0] );
    $("#push-player-down").show();
  },

  load: function() { 
    if(typeof this._widget === "undefined") {
      this.render();
      return;
    }
    this.widget().load(this.model.get("permalink_url"), this.player_options);
  },

  play: function(track) {
    this.model = track;
    this.load();

    document.title = track.get("title");
  },

  after_this_track: function(next) {
    this.widget().unbind(SC.Widget.Events.FINISH);
    this.widget().bind(SC.Widget.Events.FINISH, next);
  }

});

})(App);

