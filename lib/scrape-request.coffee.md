# Scrape-Request

Core module of Scrape itself. Handles the requesting of urls and the detection & 
correction of encodings. In further versions it is client and server independant.
The following external libraries are used:

    chardet = Npm.require 'chardet'
    iconv = Npm.require 'iconv-lite'  
    
## Configuration
The configuration for [request](https://github.com/request/request) looks like this:

    config =
      headers: # Any request headers goes here
        'Accept-Charset': "UTF-8"
      encoding: null # returns a raw buffer instead of a string
      timeout: 60*1000 # 1 minute should suffice for usual usecases
      followAllRedirects: true

## Port
The Port define each exported method from module.

    @ScrapeRequest = ScrapeRequest =
    
### `fetch`
The main method of this module. It doesn't matter if you are
requesting a website or a feed or anything else. Implements the
[Google AJAX Specification](https://developers.google.com/webmasters/ajax-crawling/)
to crawl dynamic pages. This needs a second HTTP request when necessary.

      fetch: (url) ->
        try
          return fetchRequest url
        catch e
          return null
          
### `mime`
Detect the mime from any request.

      mime: (url) ->
        result = request.getSync url, config
        getResponseType result.response
      
## Helpers
The full list of helpers used above.

### `fetchRequest`
Request the target URL, switch between different types and correct the encoding to UTF-8.
Define more mime types if required.

    fetchRequest = (url) ->
      result = request.getSync url, config
      switch getResponseType result.response
        when 'application/json'
          body = correctEncoding result.body
          JSON.parse body
        when 'image/jpeg', 'image/gif', 'image/png', 'image/tiff'
          result.body
        else 
          body = correctEncoding result.body
          if Text.hasAjaxFragment(body)
            fetchRequest Link(url).ajaxify()
          else body

### `correctEncoding`
Detect the encoding of the buffer and autocorrect it when not already UTF-8.

    correctEncoding = (buffer) ->
      try
        encoding = chardet.detect(buffer) or "utf-8"
        iconv.decode buffer, encoding
      catch e
        buffer.toString()

### `getResponseType`
Get the response type from response meta informations.
        
    getResponseType = (response) ->
      if response.headers['content-type']?
        regex = new RegExp /^([^\;]+)\;?/ 
        regex.exec(response.headers['content-type'])[1]
      else
        'text/plain'