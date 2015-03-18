# Scrape tests

The goal is to have every single feature tested and to work with TDD/BDD as
much as possible. Unfortunately, testing scraping involves doing real HTTP
requests which slows down stuff a bit.

The following function acts as a generic test factory. For every target URL,
basic tests are performed. Additional custom validations can be
provided through a callback function `fn`.

On the Client, `Tinytest.addAsync` is used instead of `Tinytest.add`, because
there is a proxy request involved.

    scrapeWebsiteTest = (url, fn) ->

      websiteDataTest = (test, data, fn) ->
        test.isTrue data.title, "title is missing!"
        test.isTrue data.tags.length, "zero tags found!"
        fn? test, data

      if Meteor.isServer
        Tinytest.add "website - #{url}", (test) ->
          data = Scrape.website url
          websiteDataTest test, data, fn
      # else # isClient
      #   Tinytest.addAsync "scrape - #{url}", (test, next) ->
      #     console.log Scrape
      #     Scrape.website1 url, (error, data) ->
      #       websiteDataTest test, data, fn
      #       next()

Run the following example pages. Everyone of them must work under any circumstances:
*(Well, except they're unavailable of course)*

    scrapeWebsiteTest "http://en.wikipedia.org/wiki/Meteor_%28web_framework%29"#, (test, data) -> console.log data
    scrapeWebsiteTest "http://www.golem.de/news/raspberry-pi-2-die-feierabend-maschine-1502-112365.html"
    scrapeWebsiteTest "http://blog.fefe.de/?ts=aa0e3af6"#, (test, data) -> console.log data
    scrapeWebsiteTest "http://www.bbc.com/news/technology-31565368"#, (test, data) -> console.log data
    scrapeWebsiteTest "http://lifehacker.com/thermos-controls-your-nest-from-os-x-s-notification-cen-1673279696"
    scrapeWebsiteTest "http://www.bunte.de/schweden/estelle-von-schweden-hinter-den-kulissen-der-ski-wm-117174.html"
    scrapeWebsiteTest "https://twitter.com/meteorjs/status/542422624995778564"#, (test, data) ->      # console.log data
    scrapeWebsiteTest "http://www.annabelle.ch/shopping/produkte/burberry-london-37150"#, (test, data) -> console.log data
    scrapeWebsiteTest "https://www.meteor.com/blog/2015/01/20/meteor-show"#, (test, data) ->
    scrapeWebsiteTest "http://www.nachrichten.at/nachrichten/wirtschaft/Briten-blockieren-Verkauf-von-Oelfeldern-an-Russen;art15,1670166#ref=rss"#, (test, data) -> console.log data


## Test the Feed Scraper
Declare the feed test body.

    scrapeFeedTest = (url, fn) ->
      if Meteor.isServer
        Tinytest.add "feed - #{url}", (test) ->
          data = Scrape.feed url
          test.isTrue data.items.length
          for item in data.items
            test.isTrue item.title, "title is missing!"
            test.isTrue item.link, "link is missing!"
            test.isTrue item.pubDate, "pubDate is missing!"
          fn? test, data
          
Define some feed test cases with uncommen feed structures:

    scrapeFeedTest "http://blog.fefe.de/rss.xml"
    scrapeFeedTest "http://www.n-tv.de/rss", # (test, data) -> console.log data.items[0]
    scrapeFeedTest "http://www.spiegel.de/schlagzeilen/index.rss"
    scrapeFeedTest "https://www.meteor.com/blog/atom.xml"#, (test, data) -> console.log data.items
    scrapeFeedTest "http://feeds.venturebeat.com/VentureBeat"#, (test, data) -> console.log data.items
    
## Test Wikipedia Scraper
Declare the test body. The parameter `tags` is optional.

    scrapeWikipediaTest = (key, lang, tags, fn) ->
      if Meteor.isServer
        Tinytest.add "wiki - [#{lang}] #{key}", (test) ->
          page = Scrape.wikipedia key, lang, tags
          test.isTrue page
          switch 
            when fn? then fn test, page
            when _.isFunction(tags) then tags test, page
    
Define some test cases with different parameters:

    scrapeWikipediaTest 'HTTP', 'en', (test, page) -> console.log page
    scrapeWikipediaTest 'HTTP', 'de', (test, page) -> console.log page
    scrapeWikipediaTest 'RK', 'de', ['Mathematik'], (test, page) -> console.log page
    scrapeWikipediaTest 'Sparkasse Chemnitz', 'de', (test, page) -> console.log page
    
## Test Mime Type Detection
Declare the mime test body.
  
    detectMimeType = (url, mime, fn) ->
      if Meteor.isServer
        Tinytest.add "mime - #{url}", (test) ->
          type = ScrapeRequest.mime url
          test.equal type, mime
          fn? test, type
        
Define some test cases with different mime types:
        
    detectMimeType "https://nodejs.org/api/buffer.html", "text/html"#, (test, data) -> console.log data
    detectMimeType "http://i.imgur.com/aVfYhHm.jpg", "image/jpeg"#, (test, data) -> console.log data