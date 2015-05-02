if (Meteor.isClient) {
  // Set the base url for images
  Meteor.call('getConfig', function(err, result) {
    Session.setDefault('base_url', result.images.base_url);
  });


  Template.search.created = function() {
    this.searchResult = new Blaze.ReactiveVar();
  }

  Template.search.events({
    'keyup input': _.throttle(function(ev, template) {
      // Call api here
      var query = ev.target.value;
      Meteor.call('getMovieData', query, function(err, result) {
        template.searchResult.set(result);
      });

    }, 800, {leading: false}),

    'focus input': function(event, template) {
      var dropdown = template.find('ul.search-results');

    }
  });

  Template.search.helpers({
    movies: function() {
      return Template.instance().searchResult.get();
    }
  })

  Template.body.events({
    'click button': function() {
      console.log('fired');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
