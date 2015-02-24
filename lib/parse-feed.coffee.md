# ParseFeed
This module is capable of parsing RSS and Atom feeds. Just give it a
HTML string and you're ready to go. The following libraries are used for this:

    cheerio = Npm.require "cheerio"
    franc = Npm.require "franc"

Instead of real XML parsing, just use cheerio for this task, this way efficient
CSS3 selectorss can be used instead of nasty XPaths or fragile RegExps!

    @ParseFeed =
      run: (xml) ->
        $ = cheerio.load xml, xmlMode: true
        items = $('item,entry').map((i,e) -> mapItem e).get()
        return {items: items}

This function takes the DOM element of a single feed item and extracts the
relevant data.

    mapItem = (item) ->
      $ = cheerio.load item, xmlMode: true
      data = {}
      data.title = _(Text.clean $("title").first().text() or "").prune 100
      data.description = _(Text.clean $("summary,description").first().text() or "").prune 1000
      data.language = franc "#{data.title} #{data.description}"
      data.link = $("link").first().attr("href") or $("link").first().text()
      data.pubDate = findPubDate $
      data.image = findImage $
      tags = $("category,categories").map((i,e) -> $(e).text()).get()
      moreTags = Tags.findFrom "#{data.title} #{data.description}"
      data.tags = _.union tags, moreTags
      # console.log data.title, data.tags
      return data

The following helper functions are used by the mapItem function, for data
that is nontrivial to parse.

    findImage = ($) ->
      # example: http://venturebeat.com/
      image = $("enclosure").attr("url")
      # example: http://www.n24.de/n24/
      image or= $('media\\:content, media\\:thumbnail, content').attr("url")
      # prio 1: find in content via unescaped html scan again
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