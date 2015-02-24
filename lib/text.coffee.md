# Text

This helper module offers a variety of text optimizing utilities, for example
the removal of common artifacts or the un-escaping of HTML characters.

In addition, it is capable of finding the ajax meta tag (as declared in the
Google AJAX specification). IF it exists, it must be of the form:
`<meta name="fragment" content="!">`.

    cheerio = Npm.require "cheerio"

    @Text =
      clean: (str) -> rmSpace rmCitations rmHTML str
      hasAjaxFragment: (html) ->
        $ = cheerio.load html
        $("meta[name='fragment']").attr("content") is "!"


The full list of helpers used above, each one takes a string and
returns a string:

    # wikipedia-style: citation[3]
    rmCitations = (str) ->
      str.replace /\[[^\]]{0,5}\]/g, " "

    # HTML & entities
    rmHTML = (str) ->
      _(_(str).unescapeHTML()).stripTags()

    # whitespace
    rmSpace = (str) ->
      _(str).clean()