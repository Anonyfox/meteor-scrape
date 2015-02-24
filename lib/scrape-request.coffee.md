# Scrape-Request

Core module of Scrape itself. Handles the requesting of urls and the
detection & correction of encodings. The following external libraries are used:

    chardet = Npm.require 'chardet'
    iconv = Npm.require 'iconv-lite'

The configuration for [request ](https://github.com/request/request) looks like this:

    options =
      headers:
        'Accept-Charset': "UTF-8" # maybe the target server is friendly!
      encoding: null # returns a raw buffer instead of a string
      timeout: 60*1000 # 1 minute should suffice for usual usecases
      followAllRedirects: true

The API of this module is a single method, since it doesn't matter if you are
requesting a website or a feed. Implements the
[Google AJAX Specification](https://developers.google.com/webmasters/ajax-crawling/)
to crawl dynamic pages. This needs a second HTTP request when necessary.

    @ScrapeRequest =
      fetch: (url) ->
        try
          html = fetch url
          if Text.hasAjaxFragment html
            html = fetch Link.ajaxified url
          return html
        catch e
          return null

Request the target URL and correct the encoding to UTF-8

    fetch = (url) ->
      result = request.getSync url, options
      correctEncoding result.body

Detect the encoding of the buffer and autocorrect it when not already UTF-8

    correctEncoding = (buffer) ->
      try
        encoding = chardet.detect(buffer) or "utf-8"
        iconv.decode buffer, encoding
      catch e
        buffer.toString()