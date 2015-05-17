# Feed Parsing Tests
The following tests ensure that the `ParseFeed` module works well for common RSS feed
formats.

## Meteor Blog Feed
This is a example for an **ATOM** feed. It has no images, hides its item contents in
CDATA blocks, and is probably the most important blog you'll have to read
(*well, at least if you're reading this and are a meteor monkey!*).

		Tinytest.add "parse feed - meteor-feed.xml", (test) ->
		  xml = UnitTests.Samples.feed "meteor-feed.xml"
		  data = Parse.Feed.fromString xml
		  test.equal data.title, 'The Meteor Blog'
		  # test.equal data.link, ''
		  test.equal data.items.length, 50
		  for item in data.items
		    test.isTrue item.title.length > 6, "item title too short"
		    test.isTrue item.link.length > 6, "item link url too short"
		    test.isTrue item.pubDate.isValid(), "item pubdate invalid"
		    test.isTrue item.tags.length > 0, "item tags too few"
		#    test.equal item.language, "en"

## Spiegel Online Feed
This is the **RSS 2.0** feed of a german news portal. Again, the parser must detect
the correct language (german) and must not break due to *umlauts*. Additionally,
the feed has images hidden in CDATA blocks right inside the description which must
be found by the parser.

		Tinytest.add "parse feed - spiegel-feed.xml", (test) ->
		  xml = UnitTests.Samples.feed "spiegel-feed.xml"
		  data = Parse.Feed.fromString xml
		  test.equal data.title, 'SPIEGEL ONLINE - Schlagzeilen'
		#  test.equal data.link, 'http://www.spiegel.de'
		  test.equal data.items.length, 30
		  for item in data.items
		    test.isTrue item.title.length > 6, "item title too short"
		    test.isTrue item.link.length > 6, "item link url too short"
		    test.isTrue item.pubDate.isValid(), "item pubdate invalid"
		    test.isTrue item.tags.length > 0, "item tags too few"
		    test.equal item.language, "de"
		  test.equal _.filter(data.items, ((item) -> item.image)).length, 24

## RTV television program feed
Another **RSS 2.0** feed, with several meta informations on the feed itself.
Also, it is fairly odd formatted and additionally includes HTML escaped
characters. It has a description and image on *every* item.
		
		Tinytest.add "parse feed - rtv-feed.xml", (test) ->
		  xml = UnitTests.Samples.feed "rtv-feed.xml"
		  data = Parse.Feed.fromString xml
		  test.equal data.title, 'rtv.de: TV-Tipps'
		#  test.equal data.link, 'http://www.rtv.de/'
		  test.equal data.items.length, 10
		  for item in data.items
		    test.isTrue item.title.length > 6, "item title too short"
		    test.isTrue item.link.length > 6, "item link url too short"
		    test.isTrue item.image.length > 6, "item image url too short"
		    test.isTrue item.description.length > 6, "item description too short"
		    test.isTrue item.pubDate.isValid(), "item pubdate invalid"
		    test.isTrue item.tags.length > 0, "item tags too few"
		    test.equal item.language, "de"