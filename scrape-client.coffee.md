# Scrape (Client)

This module uses the same API on the client and the server and has two modes:
*websites* and *feeds*. Either way, it consumes an URL and returns an object.

This field contains the **client** Code. And is *only* loaded in the client.

    @Scrape =
      website1: (url, fn) ->
        # console.log("fetching...", url);
        Meteor.call "Scrape.website", url, (error, data) ->
          fn? error, data
      feed: (url, fn) ->

