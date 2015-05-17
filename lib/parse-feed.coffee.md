# ParseFeed
This module is capable of parsing RSS and Atom feeds. Just give it a
HTML string and you are ready to go. The following libraries are used for this:

    cheerio = Npm.require "cheerio"

Instead of "real" XML handling, just use
[cheerio](https://github.com/cheeriojs/cheerio) for this task, this way
efficient CSS3 selectorss can be used instead of nasty XPaths or
fragile RegExps!

    @ParseFeed = (xml) ->
      $ = cheerio.load xml, xmlMode: true
      feed = {}
      feed.title = Text.clean $('title').first().text() or ""
      feed.link = Text.clean $('link').first().text() or ""
      feed.description = Text.clean $('description').first().text() or ""
      feed.language = Text.clean $('language').first().text() or ""
      feed.pubDate = stringToDate(Text.clean $('pubDate').first().text() or "")
      feed.lastBuildDate = stringToDate(Text.clean $('lastBuildDate').first().text() or "")
      feed.docs = Text.clean $('docs').first().text() or ""
      feed.managingEditor = Text.clean $('managingEditor').first().text() or ""
      feed.webMaster = Text.clean $('webMaster').first().text() or ""

      feed.image = {}
      feed.image.url = Text.clean $('image url').first().text() or ""
      feed.image.title = Text.clean $('image title').first().text() or ""
      feed.image.link = Text.clean $('image link').first().text() or ""
      feed.image.width = parseInt(Text.clean $('image width').first().text() or "")
      feed.image.height = parseInt(Text.clean $('image height').first().text() or "")

      feed.items = $('item,entry').map((i,e) ->
        new Parse.Feed.FeedItem($(e))
      )
      return feed

This function takes the DOM element of a single feed item and extracts the
relevant data.

    mapItem = (item) ->
      $ = cheerio.load item, xmlMode: true
      data = {}
      data.title = Text.clean $("title").first().text() or ""
      data.description = Text.clean $("summary,description").first().text() or ""
      data.link = $("link").first().attr("href") or $("link").first().text()
      data.pubDate = findPubDate $
      data.image = findImage $
      text = "#{data.title} #{data.description}"
      data.language = Text.detectLanguage text
      foreignTags = $("category,categories").map((i,e) -> $(e).text()).get()
      extractTags = Yaki(text, language: data.language).extract()
      data.tags = _.union foreignTags, extractTags
      return data

The following helper functions are used by the mapItem function, for data
that is nontrivial to parse.

    findImage = ($) ->
      image = $("enclosure").attr("url")
      image or= $('media\\:content, media\\:thumbnail, content').attr("url")
      unless image
        str = $('media\\:content, content\\:encoded, content').html()
        image = str?.match(/\ssrc=["']*(([^'"\s]+)\.(jpe?g)|(png))["'\s]/)?[1]
      return image

    findPubDate = ($) ->
      str = $("updated,pubDate,pubdate").first().text()
      pubDate = if str
        try
          new Date(str)
        catch e
          new Date()
      else
        new Date()
      return pubDate

    stringToDate = (text) ->
      text = text.replace(/(\d{1,2} \w\w\w )(15)/, "$120$2")
      try
        ret = new Date(text)
      catch e
        ret = null
      return ret
