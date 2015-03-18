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
        api = Link "http://#{lang}.wikipedia.org/w/api.php"
        api.query = addApiParams api.query
        api.query = addOpenSearchParams api.query, key
        result = ScrapeRequest.fetch api.create()
        # Process the found pages
        return null if result and result[1].length is 0
        best = max: 0, id: 0
        for teaser, i in result[2]
          relevance = lookupForTags teaser, lang, tags 
          if relevance > best.max
            best.max = relevance
            best.id = i
        # Gather informations for the best page
        page = 
          relevance: best.max
          lang: lang
          title: result[1][best.id]
          url: result[3][best.id]
  
### `scrape`
Scrape an page for useful informations like teaser, pictures or a list of meta
informations. Resolve also disambiguation pages.

      scrape: (page, lang, tags) ->
        lang = Text.correctLanguage(lang) or 'en'
        tags = if tags then Yaki(tags).clean() else []
        page = if page?.title then page else title: page
        if page.title.match(/\[\[/)
          page.title = @extractTitle(page.title).title
        api = Link "http://#{lang}.wikipedia.org/w/api.php"
        api.query = addApiParams api.query
        api.query = addScrapeParams api.query, page.title
        result = ScrapeRequest.fetch api.create()
        return null unless result
        # Example: http://goo.gl/UVsIBL
        query = _.values(result.query.pages)[0]
        return null if query.missing?
        if query.pageprops?.disambiguation?
          delete api.query['rvsection']
          result = ScrapeRequest.fetch api.create()
          query = _.values(result.query.pages)[0]
          page = parseDisambiguationPage query.revisions[0]['*'], lang, tags
          return if page then @scrape(page, lang, tags) else null
        # Fill the page object with additional informations
        page.lang = lang
        page.descriptions = query.terms.description if query.terms?.description
        if query.terms?.label
          page.tags = _.map Yaki(query.terms.label).clean(), (tags) -> tags
        page.aliases = query.terms.alias if query.terms?.alias
        page.url = query.canonicalurl
        page.summary = query.extract
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
      terms = Yaki(text, language: lang).extract()
      (2 * _.intersection(terms, tags).length) / (tags.length + terms.length)

### `parseDisambiguationPage`
This method looks into an disambiguation and retrive the right page via tags.
Returns an page object with `title` and `link`.

    parseDisambiguationPage = (wiki, lang, tags) ->
      lines = wiki.split "\n"
      best = max: -1, id: -1
      for line, i in lines when line[0] is '*'
        relevance = lookupForTags line, lang, tags
        if relevance > best.max
          best.max = relevance
          best.id = i
      # Find any link (if exist) in the best matching line
      title = Wikipedia.extractTitle lines[best.id]
      if title
        page = 
          relevance: best.max
          title: title
      else null

### `parseForMetaData`
Parse the intro/summary from any real page (not disambiguation). Find any pictures
or additional meta informations.
    
    parseForMetaData = (wiki, page) ->
      # Find any Images in the summary
      image = wiki.match(/\[\[((Image|File|Datei|Bild)[^\|\]]+)/)?[1]
      if image
        api = Link "http://#{page.lang}.wikipedia.org/w/api.php"
        api.query = addApiParams api.query
        api.query = addImageParams api.query, image
        result = ScrapeRequest.fetch api.create()
        if result
          # Example: http://goo.gl/d3TJ3f
          page.image = _.values(result.query.pages)[0].imageinfo[0]
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