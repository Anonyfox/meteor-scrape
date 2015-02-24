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

Run the following example pages. Everyone of them must work under any circumstances.
*(Well, except they're unavailable of course)*

    scrapeWebsiteTest "http://en.wikipedia.org/wiki/Meteor_%28web_framework%29"#, (test, data) -> console.log data
    scrapeWebsiteTest "http://www.golem.de/news/raspberry-pi-2-die-feierabend-maschine-1502-112365.html"
    scrapeWebsiteTest "http://blog.fefe.de/?ts=aa19b67e"
    scrapeWebsiteTest "http://www.bbc.com/news/technology-31565368"#, (test, data) -> console.log data
    scrapeWebsiteTest "http://lifehacker.com/thermos-controls-your-nest-from-os-x-s-notification-cen-1673279696"
    scrapeWebsiteTest "http://www.bunte.de/schweden/estelle-von-schweden-hinter-den-kulissen-der-ski-wm-117174.html"
    scrapeWebsiteTest "https://twitter.com/meteorjs/status/542422624995778564"#, (test, data) ->      # console.log data
    scrapeWebsiteTest "http://www.annabelle.ch/shopping/produkte/burberry-london-37150"#, (test, data) ->
    scrapeWebsiteTest "https://www.meteor.com/blog/2015/01/20/meteor-show"#, (test, data) ->


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

    scrapeFeedTest "http://blog.fefe.de/rss.xml"
    scrapeFeedTest "http://www.n-tv.de/rss"#, (test, data) -> console.log data.items[0]
    scrapeFeedTest "http://www.spiegel.de/schlagzeilen/index.rss"
    scrapeFeedTest "https://www.meteor.com/blog/atom.xml"#, (test, data) -> console.log data.items
    scrapeFeedTest "http://feeds.venturebeat.com/VentureBeat"#, (test, data) -> console.log data.items