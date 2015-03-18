# Scrape (Server)

This module uses the same API on the client and the server and has two modes:
*websites* and *feeds*. Either way, it consumes an URL and returns an object.
Additionally, there is an *url()* method that returns the plain response text
without any further parsing

    @Scrape =
      website: (url) ->
        #try
        html = ScrapeRequest.fetch url
        data = ParseWebsite.run html
        obj = correctWebsite url, data
        #return obj
        #catch e
        #  return {}
      feed: (url) ->
        #try
        xml = ScrapeRequest.fetch url
        data = ParseFeed.run xml
        obj = correctFeedItems url, data
        return obj
        #catch e
        #  return {}
      wikipedia: (key, lang, tags) ->
        #try
        page = Wikipedia.lookup key, lang, tags
        return page
        #catch e
        #  return {}
      url: (url) ->
        try
          data = ScrapeRequest.fetch url
          return data
        catch e
          return ""
          
For communication between client and server, the following Methods are required:

    # ToDO: may be needed when the client export works, but not now.
    # Meteor.methods
    #   ScrapingWebsiteCustom: (url) ->
    #     html = ScrapeRequest.fetch url
    #     data = ParseWebsite.run html
    #     return data

Some cleanup of the data is needed before delivering the result. Especially
the transformation from any type of link to a clean absolute url.

    correctWebsite = (url, data) ->
      obj = _.clone data
      url = Link url
      obj.feeds = _.compact _.uniq _.map obj.feeds, (f) ->
        link = if f then url.join f else ""
        if Link.test(link) then link else ""
      obj.image = if obj.image then url.join obj.image else ""
      obj.favicon = url.join obj.favicon
      obj.references = _.map obj.references, (r) -> url.join r
      obj.domain = url.domain
      obj.url = if obj.url then obj.url else url
      rx = _.map url.brands(), (e) -> new RegExp(e, "i") 
      obj.tags = _.reject Yaki(obj.tags).clean(), (tag) ->
        _.some (r.test tag for r in rx)
      obj.references = _.uniq _.filter obj.references, (r) ->
        Link(r).domain isnt url.domain
      return obj

    correctFeedItems = (url, data) ->
      obj = _.clone data
      url = Link url
      obj.items = []
      for item in data.items when item.link and item.title and item.pubDate
        i = _.clone item
        i.link = url.join i.link
        i.image = if i.image then url.join i.image else ""
        rx = _.map url.brands(), (e) -> new RegExp(e, "i") 
        i.tags = _.reject Yaki(i.tags).clean(), (tag) ->
          _.some (r.test tag for r in rx)
        obj.items.push i
      return obj