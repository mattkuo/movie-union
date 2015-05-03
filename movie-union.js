if (Meteor.isClient) {
  // Set the base url for images
  Meteor.call('getConfig', function(err, result) {
    Session.setDefault('base_url', result.images.base_url);
  });


  Template.search.created = function() {
    this.searchResult = new Blaze.ReactiveVar();
    this.selectedItem = new Blaze.ReactiveVar();
  }

  Template.search.events({
    'keyup input': _.throttle(function(ev, template) {
      // Call api here
      var query = ev.target.value.trim();
      if (!query || query.length < 2) return;
      Meteor.call('getMovieData', query, function(err, result) {
        template.searchResult.set(result);
      });

    }, 800, {leading: false}),

    'focus input': function(ev, template) {
      var dropdown = template.find('ul.search-results');

    },

    'click li.movie-item': function(ev, template) {
      var target = ev.currentTarget;
      var movieId = target.getAttribute('data-movie-id');
      template.selectedItem.set(movieId);
      template.find('input').value = target.querySelector('span.title').textContent;
    }
  });

  Template.search.helpers({
    movies: function() {
      return Template.instance().searchResult.get();
    },
    base_url: function() {
      return Session.get('base_url');
    }
  });

  Template.body.events({
    'click button': function() {
      // Perform union on movie actors
    }
  });
}
