# ParseWebsite
This core module takes an HTML string and returns a proper data object. The
following NPM modules are used:

    franc = Npm.require "franc"
    articleTitle = Npm.require "article-title"
    teaser = Npm.require "teaser"
    summarize = Npm.require "summarizely"
    cheerio = Npm.require "cheerio"
    readability = Npm.require "readabilitySAX"
    unfluff = Npm.require "unfluff"

The API of this module includes a central `run()` method.

    @ParseWebsite = share.ParseWebsite =
      run: (html) ->
        txt = extractFromText html
        dom = extractFromDOM html
        mergeResults txt, dom

## Extract the raw data from the plaintext and analyze it

    extractFromText = (html) ->
      data = {}
      extract = unfluff.lazy html
      data.title = articleTitle html
      data.title or= extract.title()
      data.title or= html.match(/<title>([^<])*<\/title>/i)[0]
      data.text = extract.text()
      data.text or= extract.description()
      data.text or= readability.process(html, {type: "text"}).text
      data.text = "" unless data.text?.length > 50
      # NOTE: readability also finds the "next" page for paginated articles!
      # --> ToDo: follow the NEXT-pages and join all to one article!
      data.teaser = extract.description()
      data.teaser or= new teaser(data).summarize()
      data.teaser or= ""
      data.summary = extract.description()
      data.summary or= summarize(data.text).join("\n")
      data.tags = Tags.findFrom "#{data.title} #{data.text}"
      data.tags = _.union data.tags, extract.tags()
      return data

## DOM Parsing

Every bit of valuable data is needed, so let's get dirty and fish for more
stuff by hand. To make scraping a bit more sane, the package
[cheerio](https://www.npmjs.com/package/cheerio) is used. It's kind of
jQuery, but on the server. This way, CSS3 selectors can be leveraged instead
of nasty XPaths or unreadable RegExps.

    extractFromDOM = (html) ->
      $ = cheerio.load html
      data = {}
      data.feeds = findFeeds $
      data.favicon = findFavicon $
      data.tags = findTags $
      data.references = findReferences $
      data.image = findImage $
      data.description = findDescription $
      data.text = findText $
      data.url = findCanonical $
      data.title = findTitle $
      return data

    findFeeds = ($) ->
      selector = """
        link[type='application/rss+xml'],
        link[type='application/atom+xml'],
        link[rel='alternate']
      """
      feeds = $(selector).map((i,e) -> $(this).attr("href")).get()
      return _.uniq _.compact feeds

    findFavicon = ($) ->
      selector = """
        link[rel='apple-touch-icon'],
        link[rel='shortcut icon'],
        link[rel='icon']
      """
      favicon = $(selector).attr("href")
      return favicon

    findTags = ($) ->
      str = $("meta[name='keywords']").attr("content")
      tags = []
      if str
        ary = if /;/.test str then str.split(";") else str.split(",")
        tags = _.uniq _.compact ary.map((s) -> s.trim().toLowerCase())
      return tags

    findReferences = ($) ->
      refs = $("a").map (i, e) -> $(e).attr("href")
      _.uniq _.compact _.filter refs, (r) -> Link.test r

    findImage = ($) ->
      selector = """
        meta[property='og:image'],
        meta[name='twitter:image']
      """
      list = $(selector).map((i,e) -> $(this).attr("content")).get()
      _.compact(list)[0]

    findDescription = ($) ->
      selector = """
        meta[property='og:description'],
        meta[name='twitter:description'],
        meta[name='description']
      """
      list = $(selector).map((i,e) -> $(this).attr("content")).get()
      _.compact(list)[0]

    findText = ($) ->
      $("h1,h2,h3,h4,h5,h6,p,article").map((i,e) -> $(e).text()).get().join("\n\n")

    findCanonical = ($) ->
      url = $("link[rel='canonical']").attr("href")
      if Link.test url then url else ""

    findTitle = ($) ->
      $("title,h1,2h,h3,h4,h5,h6").first().text()

## Merge the results

Join the results from the TextParser and DomParser into one uniform
result object. Pick the best results if there is some overlap.

    mergeResults = (txt, dom) ->
      data = {}
      data.title = Text.clean(txt.title or dom.title)
      data.text = Text.clean txt.text or dom.text
      data.lang = txt.lang
      data.description = Text.clean dom.description or txt.teaser?.join(" ") or txt.summary
      data.favicon = dom.favicon
      data.references = dom.references
      data.image = dom.image
      data.feeds = dom.feeds
      data.tags = Tags.clean _.union dom.tags, txt.tags
      data.lang = franc "#{data.title} #{data.text}", whitelist: [
        "deu","eng","spa","pol","ita","por","nld","ukr","jpn","swh","und"
      ]
      return data