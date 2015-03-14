# ParseFeed
This module is capable of parsing RSS and Atom feeds. Just give it a
HTML string and you're ready to go. The following libraries are used for this:

    cheerio = Npm.require "cheerio"
    franc = Npm.require "franc"

Instead of "real" XML handling, just use
[cheerio](https://github.com/cheeriojs/cheerio) for this task, this way
efficient CSS3 selectorss can be used instead of nasty XPaths or
fragile RegExps!

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
      data.title = Text.clean $("title").first().text() or ""
      data.description = Text.clean $("summary,description").first().text() or ""
      data.language = franc "#{data.title} #{data.description}", whitelist: [
        "deu","eng","spa","pol","ita","por","nld","ukr","jpn","swh","und"
      ]
      data.link = $("link").first().attr("href") or $("link").first().text()
      data.pubDate = findPubDate $
      data.image = findImage $
      tags = $("category,categories").map((i,e) -> $(e).text()).get()
      lang = if data.language is 'deu' then 'de' else 'en'
      moreTags = Yaki.analyse("#{data.title} #{data.description}", language: lang)
      data.tags = _.union tags, moreTags
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