# Scrape tests
The goal is to have every single feature tested and to work with TDD/BDD as
much as possible. Unfortunately, testing scraping involves doing real HTTP
requests which slows down stuff a bit.

To speed up most tests, there are some sample data files placed under
`/sampledata`, they are accessible like this:

    fs = Npm.require "fs"
    path = Npm.require "path"
    rootPath = path.join path.resolve("."), "assets", "packages"
    packagePath = path.join rootPath, "local-test_anonyfox_scrape"
    sitesPath = path.join packagePath, "sampledata", "sites"
    feedsPath = path.join packagePath, "sampledata", "feeds"

## Test Website Parsing
The following tests ensure that the `ParseWebsite` module works well for typical
web articles and for some edge cases. This parser has two usescases, through:

- scrape any url and fetch some metadata and links, search-engine-style.
- scrape explicit *article pages* and extract the content, instapaper-style.

Both usecases are tested below, in the same order as written above: metascrape
(*-> websites*) first, then contentscrape (*-> articles*).

#### Venturebeat Website
A nicely optimized news portal for techies and rich of multimedia content and
discoverable features. Makes a good default use-case and should work under any
circumstances.

    Tinytest.add "parse website - venturebeat-website.html", (test) ->
      file = path.join sitesPath, "venturebeat-website.html"
      data = ParseWebsite fs.readFileSync file, encoding: "utf-8"
      # test.equal data.url, 'http://venturebeat.com/'
      test.equal data.lang, 'en'
      test.equal data.title, 'Infinit and beyond: The ultimate file-sharing app just launched on mobile'
      test.equal data.description, 'VentureBeat is the leading source for news & perspective on tech innovation. We give context to help execs, entrepreneurs, & tech enthusiasts make smart decisions.'
      test.equal data.feeds.length, 1
      test.include data.feeds, 'http://feeds.venturebeat.com/VentureBeat'
      test.equal data.image, undefined # DRAGON: image is the logo, hidden in CSS background!

#### Focus Online
A german news website, the test ensures that the language is detected properly.
Additionally, this website has a huge amount of content to stress the
performance of the algorithms. This example also confirms that the parser
is able to find more than one feed per website.

    Tinytest.add "parse website - focus-website.html", (test) ->
      file = path.join sitesPath, "focus-website.html"
      data = ParseWebsite fs.readFileSync file, encoding: "utf-8"
      test.equal data.url, 'http://www.focus.de/'
      test.equal data.lang, 'de'
      test.equal data.title, 'FOCUS Online - News'
      test.equal data.description, 'FOCUS Online – minutenaktuelle Nachrichten und Service-Informationen von Deutschlands modernem Nachrichtenmagazin.'
      test.equal data.feeds.length, 12
      test.include data.feeds, 'http://rss.focus.de/'
      # test.equal data.image, undefined # DRAGON: image is the logo, hidden in CSS background!

#### BBC Article
A good example for a news article of common quality, with a medium text length and
some artifacts like "related articles" and social media stuff.

    Tinytest.add "parse article - bbc-article.html", (test) ->
      file = path.join sitesPath, "bbc-article.html"
      data = ParseWebsite fs.readFileSync file, encoding: "utf-8"
      test.equal data.url, 'http://www.bbc.com/news/technology-31565368'
      test.equal data.lang, 'en'
      test.equal data.title, 'Lenovo offers tool to remove hidden adware \'Superfish\''
      test.equal data.image, 'http://news.bbcimg.co.uk/media/images/81148000/jpg/_81148701_81101864.jpg'
      test.isTrue data.description.has "Chinese computer maker Lenovo"
      test.include data.tags, "lenovo"
      test.include data.tags, "superfish"
      test.include data.tags, "adware"
      test.include data.tags, "computer"
      test.include data.tags, "software"
      test.include data.references, 'http://news.lenovo.com/article_display.cfm?article_id=1931'
      test.isTrue data.text.has "Lenovo said on Thursday it had disabled it because of"

#### Golem Article
A german article to test that *umlauts* won't break anything. Also there are quite good hints
on the page that describe the topic further (useful for keyword/tag extraction). Finally
the `image` is well hidden on the sidebar instead of the main part of the DOM with the
actual article text.

    Tinytest.add "parse article - golem-article.html", (test) ->
      file = path.join sitesPath, "golem-article.html"
      data = ParseWebsite fs.readFileSync file, encoding: "utf-8"
      # test.equal data.url, 'http://www.bbc.com/news/technology-31565368'
      test.equal data.lang, 'de'
      test.equal data.title, 'Andreesen Horowitz Wird Meteor das nächste große Ding für Entwickler?'
      test.equal data.image, 'http://www.golem.de/1207/93439-40201-i.jpg'
      test.isTrue data.description.has "Open-Source-Plattform zur Entwicklung von Web Apps"
      test.include data.tags, 'andreessen horowitz'
      test.include data.tags, 'meteor'
      test.include data.tags, 'open source framework'
      test.include data.tags, 'javascript'
      test.include data.tags, 'risikokapitalgeber'
      test.include data.references, 'http://meteor.com/blog/2012/07/25/meteors-new-112-million-development-budget'
      test.isTrue data.text.has "Zu den weiteren Investoren in Meteor zählen neben Andreessen Horowitz"

#### Tweet
Even a minimalist text like a tweet should suffice for the algorithms to determine
correct article informations.

    Tinytest.add "parse article - tweet.html", (test) ->
      file = path.join sitesPath, "tweet.html"
      data = ParseWebsite fs.readFileSync file, encoding: "utf-8"
      test.equal data.url, 'https://twitter.com/meteorjs/status/542422624995778564'
      test.equal data.lang, "en"
      test.isTrue data.title.has "Meteor 1.0.1"
      test.equal data.image, 'https://pbs.twimg.com/profile_images/527039622434418688/uJPMDhZq_400x400.png'
      test.isTrue data.description.has "Just released Meteor 1.0.1 with a security fix"
      test.include data.tags, "meteor"
      test.include data.tags, "security"
      test.include data.tags, "released"
      test.include data.references, 'https://t.co/DSOobCSZQv' # DRAGON: resolve shorteners?

## Test Feed Parsing
The following tests ensure that the `ParseFeed` module works well for common RSS feed
formats.

#### Meteor Blog Feed
This is a example for an **ATOM** feed. It has no images, hides it's item contents in
CDATA blocks, and is probably the most important blog you'll have to read
(*well, at least if you're reading this and are a meteor monkey!*).

    Tinytest.add "parse feed - meteor-feed.xml", (test) ->
      file = path.join feedsPath, "meteor-feed.xml"
      data = ParseFeed fs.readFileSync file, encoding: "utf-8"
      test.equal data.title, 'The Meteor Blog'
      # test.equal data.link, ''
      test.equal data.items.length, 50
      for item in data.items
        test.isTrue item.title.length > 6, "item title too short"
        test.isTrue item.link.length > 6, "item link url too short"
        test.isTrue item.pubDate.isValid(), "item pubdate invalid"
        test.isTrue item.tags.length > 0, "item tags too few"
        # test.equal item.language, "en"

#### Spiegel Online Feed
This is the **RSS 2.0** feed of a german news portal. Again, the parser must detect
the correct language (german) and must not break due to *umlauts*. Additionally,
the feed has images hidden in CDATA blocks right inside the description which must
be found by the parser.

    Tinytest.add "parse feed - spiegel-feed.xml", (test) ->
      file = path.join feedsPath, "spiegel-feed.xml"
      data = ParseFeed fs.readFileSync file, encoding: "utf-8"
      test.equal data.title, 'SPIEGEL ONLINE - Schlagzeilen'
      test.equal data.link, 'http://www.spiegel.de'
      test.equal data.items.length, 30
      for item in data.items
        test.isTrue item.title.length > 6, "item title too short"
        test.isTrue item.link.length > 6, "item link url too short"
        test.isTrue item.pubDate.isValid(), "item pubdate invalid"
        test.isTrue item.tags.length > 0, "item tags too few"
        test.equal item.language, "de"
      test.equal data.items.filter((item) -> item.image).length, 24
      # DRAGON: shouldn't there be 30 images, one per item?

#### RTV television program feed
Another **RSS 2.0** feed, with several meta informations on the feed itself.
Also, it is fairly odd formatted and additionally includes HTML escaped
characters. It has a description and image on *every* item.

    Tinytest.add "parse feed - rtv-feed.xml", (test) ->
      file = path.join feedsPath, "rtv-feed.xml"
      data = ParseFeed fs.readFileSync file, encoding: "utf-8"
      test.equal data.title, 'rtv.de: TV-Tipps'
      test.equal data.link, 'http://www.rtv.de/'
      test.isTrue data.lastBuildDate?.isValid()
      test.equal data.items.length, 10
      for item in data.items
        test.isTrue item.title.length > 6, "item title too short"
        test.isTrue item.link.length > 6, "item link url too short"
        test.isTrue item.image.length > 6, "item image url too short"
        test.isTrue item.description.length > 6, "item description too short"
        test.isTrue item.pubDate.isValid(), "item pubdate invalid"
        test.isTrue item.tags.length > 0, "item tags too few"
        test.equal item.language, "de"

## Live Examples
Ensure that the algorithms work is one thing, doing real scraping on actual
source websites is another. So let's forget about the static sample files
and **scrape**. These tests are slow, depending on your internet connection.

#### Wikipedia's Meteor Article
It's a bit tricky to define too tight test assertions, since the contents of
the article may change anytime. That's why only the basics are tested, as
a proof that the scraper itself works fine.

    Tinytest.add "scrape - wikipedia article", (test) ->
      url = "http://en.wikipedia.org/wiki/Meteor_%28web_framework%29"
      data = Scrape.website url
      test.equal data.title, 'Meteor (web framework)'
      test.equal data.url, 'http://en.wikipedia.org/wiki/Meteor_(web_framework)'
      test.equal data.domain, 'en.wikipedia.org'
      test.equal data.lang, "en"
      test.isTrue data.favicon
      test.isTrue data.tags.length > 10

#### Meteor Blog Article
The articles of the meteor blog are only crawlable through the google ajax
specification (see the meteor package *spiderable*). The scraper must be
clever enough to detect this behavior and process the website properly.
This requires a double-request and may need a few seconds for the latency.

    Tinytest.add "scrape - meteor blog article", (test) ->
      url = "https://www.meteor.com/blog/2015/03/17/meteor-104-mongo-cordova-template-subscriptions"
      data = Scrape.website url
      test.equal data.title, 'Meteor'
      test.equal data.url, url
      test.equal data.domain, 'www.meteor.com'
      test.equal data.lang, "en"
      test.isTrue data.favicon
      test.isTrue data.tags.length > 10
      test.isTrue data.text.length > 400
      test.isTrue data.description.length > 50

#### Presseportal RSS Feed
The feed is highly available and encoded in ISO-8859-1, perfect to ensure that
the encoding correction algorithms are working.

    Tinytest.add "scrape - presseportal feed", (test) ->
      url = "http://www.presseportal.de/rss/presseportal.rss2"
      data = Scrape.feed url
      test.equal data.title, 'Presseportal.de'
      test.equal data.link, 'http://www.presseportal.de'
      test.isTrue data.lastBuildDate?.isValid()
      test.isTrue data.items.length > 5
      for item in data.items
        test.isTrue item.title.length > 6, "item title too short"
        test.isTrue item.link.length > 6, "item link url too short"
        test.isTrue item.description.length > 6, "item description too short"
        test.isTrue item.pubDate.isValid(), "item pubdate invalid"
        test.isTrue item.tags.length > 0, "item tags too few"
        test.equal item.language, "de"

## Test Wikipedia Scraper
The Wikipedia scraper takes 3 arguments:

- `keyword`: This is what you're looking for. Can be any word or string.
- `language`: Wikipedia is multilingual and we can't guess the language from a single word.
- `tags`: an array of words that describe the context.

The combination of these parameters is necessary to handle all the edge cases.
Technically speaking, `tags` is optional, but it helps to find the best matching
article. [This Example](https://en.wikipedia.org/wiki/CSI) should demonstrate
the problem.

#### Basic Wikipedia Scrape
The phrase *"ipad air 2"* is currently unique in the english-speaking part of
wikipedia, so the request should find a single, direct match. This test ensures
that the scraper is working without any more clever features.

    Tinytest.add "wikipedia - basic: 'ipad air 2'", (test) ->
      data = Scrape.wikipedia "ipad air 2", "en"
      test.equal data.title, 'IPad Air 2'
      test.equal data.url, 'http://en.wikipedia.org/wiki/IPad_Air_2'
      test.include data.summary, "The iPad Air 2 is thinner and faster"
      test.equal data.image.url, 'http://upload.wikimedia.org/wikipedia/commons/3/38/IPad_Air_2.png'

#### German Wikipedia Scrape
To ensure that everything still works language-independent and that *umlauts* won't break
the algorithms, the phrase *"google"* is searched in the german wikipedia.

    Tinytest.add "wikipedia - german: 'google'", (test) ->
      data = Scrape.wikipedia "google", "de"
      test.equal data.title, 'Google'
      test.equal data.url, 'http://de.wikipedia.org/wiki/Google'
      test.include data.summary, "Suchmaschine des US-amerikanischen Unternehmens Google Inc."
      test.equal data.image.url, 'http://upload.wikimedia.org/wikipedia/de/e/e5/Googleinterface.png'

    scrapeWikipediaTest = (key, lang, tags, fn) ->
      if Meteor.isServer
        Tinytest.add "wiki - [#{lang}] #{key}", (test) ->
          page = Scrape.wikipedia key, lang, tags
          test.isTrue page.title
          switch
            when fn? then fn test, page
            when _.isFunction(tags) then tags test, page

#### Wikipedia Scrape with Ambiguity
Finally, the scraper must be able to resolve phrases like `CSI`, given a few hints
about the context. IN this case, the TV series is the desired result.

    Tinytest.add "wikipedia - ambiguity: 'CSI'", (test) ->
      data = Scrape.wikipedia "CSI", "en", ["miami", "television", "series"]
      test.equal data.title, 'CSI: Miami'
      test.equal data.url, 'http://en.wikipedia.org/wiki/CSI:_Miami'
      test.include data.summary, "The series was produced in partnership with"
      test.equal data.image.url, 'http://upload.wikimedia.org/wikipedia/en/9/96/CSI_Miami.png'

#### Wikipedia Scrape More
In addition to the `title`, `summary`, `image` and `url`, the "infobox" (right
column) is parsed if possible. This returns a `meta` object, containing all the
informations in a simple key-value-format. For example Coffeescript's wiki page:

    Tinytest.add "wikipedia - coffeescript meta data", (test) ->
      data = Scrape.wikipedia "coffeescript", "en"
      # basic string informations
      test.equal data.meta.developer, 'Jeremy Ashkenas, et al.'
      test.equal data.meta.website, 'coffeescript.org'
      # links are escaped using markdown syntax, multiple links are possible
      test.equal data.meta.license, '[MIT License](http://en.wikipedia.org/wiki/MIT_License)'
      test.equal data.meta.influenced, '[MoonScript](http://moonscript.org/), [LiveScript](http://en.wikipedia.org/wiki/LiveScript)'

## Test Mime Type Detection
The given URLs can point to anything, not only text/html. In case of JSON or images,
a special treatment is needed. The scraper should detect this through the MIME type
of the server response and dispatch accordingly. *Text* is the default case,
and handled in all the tests above so far.

#### JSON Detection
If you want to consume JSON data from any source, the MIME type "application/json"
is set and used to handle JSON:

    Tinytest.add "MIME - JSON", (test) ->
      data = Scrape.url "http://ip.jsontest.com/"
      test.isTrue data.ip

#### Image detection
Images are dangerous if unhandled, since trying to parse image data as HTML could
kill your CPU process. All the common image formats are handled:

    Tinytest.add "MIME - PNG", (test) ->
      data = Scrape.url "http://i.kinja-img.com/gawker-media/image/upload/s--TBjOdHcL--/c_fit,fl_progressive,q_80,w_600/bwiqhbo45ulldozwchb0.png"

    Tinytest.add "MIME - GIF", (test) ->
      data = Scrape.url "http://news.ycombinator.com/y18.gif"

    Tinytest.add "MIME - JPEG", (test) ->
      data = Scrape.url "http://ichef.bbci.co.uk/news/660/media/images/82027000/jpg/_82027547_f09037fb-7b15-4d4a-8645-d251bb44f02f.jpg"