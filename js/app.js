/**
 * Fetch 10 latest of hacker news top stories
 * and print them on page with title and link.
 */

var hn = (function() {

  const HN_TOP_STORIES = "https://hacker-news.firebaseio.com/v0/topstories.json";
  // hacker news item url form: https://hacker-news.firebaseio.com/v0/item/<item-id>.json
  const HN_ITEM = "https://hacker-news.firebaseio.com/v0/item/"

  function fetchStory(callback, id) {
    $.ajax({
      url: HN_ITEM + id + '.json',
      dataType: 'json',
      success: function(data) {
        callback(null, data);
      }
    })
  }

  function fetchLatestStories(callback, limit) {
    var stories = [];
    $.ajax({
      url: HN_TOP_STORIES,
      dataType: 'json',
      success: function(data) {
        storyIds = _.slice(data, 0, limit);
        async.each(storyIds, function(storyId, callback) {
          fetchStory(function(err, story) {
            stories.push(story);
            callback();
          }, storyId);
        }, function(err, data) {
          callback(null, stories)
        });
      }
    })
  }

  return {
    printNews: function() {
      fetchLatestStories(function(err, stories) {
        _.forEach(stories, function(story) {
          $('body').append('<a href="' + story.url + '">' + story.title +'</a><br />')
        })
      }, 10)
    }
  }
}());
