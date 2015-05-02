if (Meteor.isServer) {
  Meteor.methods({
    'getConfig': function() {
      if (!Meteor.settings.tmdb) {
        throw new Meteor.Error(500, 'Please provide a Tmdb api key to access data.');
      }

      var options = {
        'api_key': Meteor.settings.tmdb
      };

      var result = HTTP.call('GET', 'http://api.themoviedb.org/3/configuration', {
        params: options
      });

      if (result.statusCode === 200) {
        return EJSON.parse(result.content);
      } else {
        throw new Meteor.Error(500, 'Failed to get configuration');
      }
    },

    'getMovieData': function(query) {
      if (!Meteor.settings.tmdb) {
        throw new Meteor.Error(500, 'Please provide a Tmdb api key to access data.');
      }

      var options = {
        'api_key': Meteor.settings.tmdb,
        'query': escape(query),
        'search_type': 'ngram'
      };

      var result = HTTP.call('GET', 'http://api.themoviedb.org/3/search/movie?', {
        params: options
      });

      if (result.statusCode === 200) {
        return EJSON.parse(result.content)['results'];
      } else {
        throw new Meteor.Error(500, 'Failed to get movie data');
      }
    }
  });
}


