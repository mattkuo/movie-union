if (Meteor.isClient) {
  // Set the base url for images
  Meteor.call('getConfig', function(err, result) {
    Session.set('base_url', result.images.base_url);
  });

  var actorResult = new Blaze.ReactiveVar([]);

  Template.registerHelper('base_url', function(context, options) {
    return Session.get('base_url');
  });

  Template.body.events({
    'click button': function(ev, template) {
      // Perform union on movie actors
      //
      var inputs = template.findAll('input.movie-input');

      var ids = _.map(inputs, function(input, i) {
        return input.getAttribute('data-movie-id');
      });

      Meteor.call('getActorData', ids, function(err, results) {
        var dict = Object.create(null);
        var selected = []

        _.each(results, function(result) {

          _.each(result.cast, function(cast) {
            if (dict[cast.id] !== undefined && dict[cast.id].movieId_1 !== result.id) {
              dict[cast.id].role_2 = cast.character;
              dict[cast.id].movieId_2 = result.id;
              selected.push(dict[cast.id]);
            } else {
              dict[cast.id] = {
                movieId_1: result.id,
                name: cast.name,
                profile_path: cast.profile_path,
                role_1: cast.character
              };
            }
          });

        });

        actorResult.set(selected);

      });
    }

  });

  Template.body.helpers({
    actors: function() {
      return actorResult.get();
    }
  });

  Template.search.created = function() {
    this.searchResult = new Blaze.ReactiveVar();
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
      var inputElement = template.find('input.movie-input');

      inputElement.setAttribute('data-movie-id', movieId);
      inputElement.value = target.querySelector('span.title').textContent;
    }
  });

  Template.search.helpers({
    movies: function() {
      return Template.instance().searchResult.get();
    }
  });

  Template.union.helpers({

  });

  Template.union.events({

  });
}
