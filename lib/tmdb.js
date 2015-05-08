if (Meteor.isServer) {
  Meteor.methods({
    getConfig: function() {
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

    getMovieData: function(query) {
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
        return EJSON.parse(result.content)['results'].slice(0, 5);
      } else {
        throw new Meteor.Error(500, 'Failed to get movie data');
      }
    },

    getActorData: function(movieIds) {
      if (!Meteor.settings.tmdb) {
        throw new Meteor.Error(500, 'Please provide a Tmdb api key to access data.');
      }

      var options = {
        'api_key': Meteor.settings.tmdb
      }

      Future = Npm.require('fibers/future');

      var futures = _.map(movieIds, function(id, index) {
        var future = new Future();

        HTTP.get('http://api.themoviedb.org/3/movie/' + id + '/credits', {
          params: options
        }, function(err, result) {
          if (err) {
            future.throw(err);
          } else {
            future.return(EJSON.parse(result.content));
          }

        });

        return future;
      });

      var results = _.map(futures, function(future, index) {
        return future.wait();
      });

      return results;
    }
  });
}


