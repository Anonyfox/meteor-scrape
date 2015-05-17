# Link

This helper module simplifies the handling of URIs and extracts a bit of
data from it. It uses the following packages under the hood:

    isUrl = Npm.require "is-url"
    url = Npm.require "url"

To avoid confusions, URIs received as parameters are now called *links*, while
internal used libraries or helpers are derivates of *URLs or URIs*.

## Port
The Port define each exported method from module.

#    @Link = Link = (lnk) ->
#      link = url.parse lnk, true
#      link.base = "#{link.protocol}//#{link.hostname}"
#      link.path = link.pathname
#      link.domain = link.hostname
#      link.search = ''
#      link.brands = -> brands link
#      link.ajaxify = -> ajaxify link
#      link.create = -> url.format link
#      link.join = (path) -> url.resolve link.base, path or ''
#      link.inspect = (depth) -> link.create()
#      link

### `join`
Joins domain and path to a link. Regards the *deepness* of `domain`.

    Link.join = (link, path) ->
      Link(link).join path

### `test`
Test if `link` is a valid URL.

#    Link.test = (link) ->
#      isUrl link

## Helpers
Some helpers are nontrivial and declared below.

### `brands`
A brand is the name of SLD (in most cases) and all subdomains to SLD.

    brands = (link) ->
      words = _.filter link.hostname.split("."), (part) -> part.length > 3
      words = Yaki(words, natural: false).clean()
      words.reverse()

### `ajaxify`
Use the Google Specification to pages with dynamic content and ads
`_escaped_fragments_=!` to the query string to retrieve static content.

#    ajaxify = (link) ->
#      link.query['_escaped_fragment_'] = '!'
#      result = link.create()
#      delete link.query['_escaped_fragment_']
#      result