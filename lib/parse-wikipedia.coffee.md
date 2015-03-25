# Wikipedia Scraper & Parser

This module provides an interface for scraping websites from wikipedia.
The main functionality is seperated into two functions:
Choose the right page and scrape the page for useful content.
Any optional dependencies goes here

## Port
The port define each exported method from module.

    @Wikipedia = Wikipedia =

### `find`
Search in Wikipedia for a single page that are closest to `key`. If you have more
information about the searched page post a `tags` array as second parameter (optional).
This method returns a page object for further scraping (`title`, `link`, `teaser`).

      find: (key, lang, tags) ->
        # Construct and fire the API request
        lang = Text.correctLanguage(lang) or 'en'
        tags = if tags then Yaki(tags, language: lang).clean() else []
        key = Yaki([key], {language: lang, natural: false}).clean()[0]
        api = Link "http://#{lang}.wikipedia.org/w/api.php"
        api.query = addApiParams api.query
        api.query = addOpenSearchParams api.query, key
        result = ScrapeRequest.fetch api.create()
        return {} if result and result[1].length is 0
        # Process the found pages
        best = max: 0, id: 0, tags: []
        # Find better pages than the first entry with optional tags
        for title, i in result[1]
          intersect = lookupForTags title, lang, tags
          if intersect.quality > best.max
            best.max = intersect.quality
            best.tags = intersect.tags
            best.id = i
        # Gather informations for the best page      
        page = 
          lang: lang
          title: result[1][best.id]
          url: result[3][best.id]
          tags: best.tags
  
### `scrape`
Scrape an page for useful informations like teaser, pictures or a list of meta
informations. Resolve also disambiguation pages.

      scrape: (page, lang, tags) ->
        lang = Text.correctLanguage(lang) or 'en'
        tags = if tags then Yaki(tags, language: lang).clean() else []
        # Extract Title
        page = title: page if _.isString page
        return {} unless page.title
        if page.title.match(/\[\[/)
          page.title = @extractTitle page.title
        # Constrcut and Fire the API request
        api = Link "http://#{lang}.wikipedia.org/w/api.php"
        api.query = addApiParams api.query
        api.query = addScrapeParams api.query, page.title
        result = ScrapeRequest.fetch api.create()
        # Process the result (Example: http://goo.gl/UVsIBL)
        return {} unless result
        query = _.values(result.query.pages)[0]
        return {} if query.missing?
        # Process disambiguation
        if query.pageprops?.disambiguation?
          delete api.query['rvsection']
          result = ScrapeRequest.fetch api.create()
          query = _.values(result.query.pages)[0]
          result = parseDisambiguationPage query.revisions[0]['*'], lang, tags
          return if result
            result.tags = _.union page.tags, result.tags
            @scrape result, lang, tags
          else {}
        # Fill the page object with additional informations
        page.language = lang
        page.keys = Yaki(page.title, {language: lang, natural: false}).split().clean()
        if query.terms?.description
          page.description = query.terms.description[0]
          tags = Yaki(page.description, {language: lang, filter: false}).extract()
          page.keys = _.union page.keys, tags
        page.aliases = query.terms.alias if query.terms?.alias
        page.url = query.canonicalurl
        page.summary = query.extract
        # Find Image
        if query.pageprops?['page_image']
          image = scrapeImage page, query.pageprops?['page_image']
          page.image = image if image
        else
          image = findAdditionalImage page
          page.image = image if image
        # Find additonal meta data
        page = parseForMetaData query.revisions[0]['*'], page
        page
        
    
### `lookup`
This method combines `find` and `scrape` to a shorter call. Parameters are the same as `find`.

      lookup: (key, lang, tags) ->
        page = @find key, lang, tags
        @scrape page, lang, tags
        
### `extractTitle`
Extract any title (for scraping) from a wiki link or text with wiki link.

      extractTitle: (text) ->
        result = text.match(/\[\[([^\]\|\[]+)\|?([^\]\|]*)\]\]/)
        if result then result[1] else ''
        
### `titleToLink`
Converts a title with language to a simple link.

      titleToLink: (title, lang) ->
        lang = Text.correctLanguage(lang) or 'en'
        title = title.replace /\s+/g, '_' 
        link = "http://#{lang}.wikipedia.org/wiki/#{title}"
        
## Helpers
The full list of helpers used above.

### `addApiParams`
The standard options with each query.

    addApiParams = (query) ->
      query['format'] = 'json'
      query
      
### `addOpenSearchParams`
Additional options for opensearch. The parameter key is the search string.

    addOpenSearchParams = (query, key) ->
      query['action'] = 'opensearch'
      query['redirects'] = 'resolve'
      query['limit'] = '25'
      query['search'] = key
      query
      
### `addTemplateParams`
Additional options for used templates in a page.

    addTemplateParams = (query, template, title) ->
      query['action'] = 'parse'
      query['title'] = title
      query['text'] = template
      query
      
### `addScrapeParams`
Additional options for scraping that includes: page properties, page term, an parsed
intro text (summary) and the wiki encoded intro with all templates from the latest
revision.

    addScrapeParams = (query, title) ->
      query['action'] = 'query'
      query['prop'] = 'pageprops|info|pageterms|extracts|revisions'
      query['titles'] = title
      query['redirects'] = 'resolve'
      query['ppprops'] = 'disambiguation'
      query['inprop'] = 'url'
      query['exintro'] = ''
      query['rvprop'] = 'content'
      query['rvsection'] = '0'
      query
      
### `addParsedPageParams`
Additonal Paramters for a fully expanded page (intro section). Useful to scrape for
links and images.

    addParsedPageParams = (query, title) ->
      query['action'] = 'query'
      query['prop'] = 'revisions'
      query['titles'] = title
      query['rvprop'] = 'content'
      query['rvsection'] = '0'
      query['rvexpandtemplates'] = ''
      query
      
### `addImageParams`
Additonal options for retrieving image informations.

    addImageParams = (query, image) ->
      query['action'] = 'query'
      query['prop'] = 'imageinfo'
      query['titles'] = image
      query['redirects'] = 'resolve'
      query['iiprop'] = 'url|dimensions|mime'
      query
      
### `addConancialParams`
Additional conancial options for url.

    addConancialParams = (query, title) ->
      query['action'] = 'query'
      query['prop'] = 'info'
      query['redirects'] = 'resolve'
      query['inprop'] = 'url'
      query
      
### `lookupForTags`
Calculates the intersect between two tag sets. Use Dice for relevance.

    lookupForTags = (text, lang, tags) ->
      result = Yaki(text, {language: lang, tags: tags}).extract().tags
      reduce = (array, init, fn) -> array.reduce fn, init
      reduce tags, {tags: [], quality: 0}, (akk, tag) -> 
        # Maybe our tag is in a word combination
        elem = _.find result, (elem) -> 
          new RegExp("^(.*\\s)?#{tag}(\\s.*)?$").test elem.term
        if elem
          akk.quality = akk.quality + elem?.quality or 0
          akk.tags.push tag
        return akk

### `parseDisambiguationPage`
This method looks into an disambiguation and retrive the right page via tags.
Returns an page object with `title` and `link`.

    parseDisambiguationPage = (wiki, lang, tags) ->
      lines = wiki.split "\n"
      best = max: -1, id: -1, tags: []
      for line, i in lines when line[0] is '*'
        line = line.replace /[\[\]\|\{\}]/g, ' '
        intersect = lookupForTags line, lang, tags
        if intersect.quality > best.max
          best.max = intersect.quality
          best.tags = intersect.tags
          best.id = i
      # Find any link (if exist) in the best matching line
      title = Wikipedia.extractTitle lines[best.id]
      if title
        page =
          disambiguation: true
          tags: best.tags
          title: title
      else null

### `parseForMetaData`
Parse the intro/summary from any real page (not disambiguation). Find any pictures
or additional meta informations.
    
    parseForMetaData = (wiki, page) ->
      # Find additional meta information
      page.meta = {}
      lines = wiki.split "\n"
      for line in lines when line[0] is '|' and line.length < 100
        # Process Template Parameter during calling
        match = line.match /^\|([^\=]+)\=(.+)?$/
        if match
          key = Yaki(Text.clean(match[1])).split().clean().join(' ')
          value = Text.clean match[2]
          value = wikiToMarkdown value, page
          value = Text.clean value
          value = value.replace /(\{\{|\}\}|\[\[|\]\])/g, ''
          page.meta[key] = value if key and value
      return page
      
### `findAdditionalImage`
Find addtional images in expanded page version.

    findAdditionalImage = (page) ->
      api = Link "http://#{page.lang}.wikipedia.org/w/api.php"
      api.query = addApiParams api.query
      api.query = addParsedPageParams api.query, page.title
      result = ScrapeRequest.fetch api.create()
      if result
        html = _.values(result.query.pages)[0].revisions?[0]['*']
        if html
          image = html.match(/\[\[((Image|File|Datei|Bild)[^\|\]]+)/)?[1]
          if image
            image = scrapeImage page, image
            return image if image
      return null
      
### `scrapeImage`
Scrape additonal image informations. Normalize the title of an image if necessary.

    scrapeImage = (page, image) ->
      image = "File:#{image}" unless image.match(/((Image|File|Datei|Bild)[^\|\]]+)/)
      api = Link "http://#{page.lang}.wikipedia.org/w/api.php"
      api.query = addApiParams api.query
      api.query = addImageParams api.query, image
      result = ScrapeRequest.fetch api.create()
      if result
        # Example: http://goo.gl/d3TJ3f
        _.values(result.query.pages)[0].imageinfo?[0]
      else null
     
### `wikiToMarkdown`
An simple recursive parser that replaces any occurences from links,
external links (to markdown) and inner templates.

    wikiToMarkdown = (wiki, page) ->
      found = false
      # Filter Image or File Links
      regex = /\[\[((Image|File|Datei|Bild)[^\[\]]+\]\])/
      found = wiki.match regex
      if found
        repl = ''
        wiki = wiki.replace regex, repl
        return wikiToMarkdown wiki, page
      # Extract from any Template
      regex = new RegExp /\{\{([^\{\}]+)\}\}/
      found = wiki.match regex
      if found
        repl = extractFromTemplate found[0], page
        wiki = wiki.replace regex, repl
        return wikiToMarkdown wiki, page
      # Replace any wiki link
      regex = new RegExp /\[\[([^\]\|\[]+)\|?([^\]\|]*)\]\]/
      found = wiki.match regex
      if found
        link = Wikipedia.titleToLink found[1], page.lang
        label = found[2] or found[1]
        repl = "[ #{label}](#{link})"
        wiki = wiki.replace regex, repl
        return wikiToMarkdown wiki, page
      # Replace any external link
      regex = new RegExp /\[([^\]\s\[]+)\s?([^\]\[]*)\]/
      found = wiki.match regex
      if found
        link = found[1]
        label = found[2]
        repl = "#{link}"
        repl = "[ #{label}](#{link})" if label
        wiki = wiki.replace regex, repl
        return wikiToMarkdown wiki, page
      # This is needed to prevent self recursion from replacements
      return wiki.replace /\[\s/g, '['

### `extractFromTemplate`
Extract useful imformations from templates.

    extractFromTemplate = (template, page) ->
      api = Link "http://#{page.lang}.wikipedia.org/w/api.php"
      api.query = addApiParams api.query
      api.query = addTemplateParams api.query, template, page.title
      result = ScrapeRequest.fetch api.create()
      return '' unless result
      value = result.parse.text['*']
      value = Text.clean value