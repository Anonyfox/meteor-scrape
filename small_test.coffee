

# feed 1

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