# Text

This helper module offers a variety of text optimizing utilities, for example
the removal of common artifacts or the un-escaping of HTML characters.

In addition, it is capable of finding the ajax meta tag (as declared in the
Google AJAX specification). IF it exists, it must be of the form:
`<meta name="fragment" content="!">`.

    cheerio = Npm.require "cheerio"
    franc = Npm.require "franc"
    
## Port
The Port define each exported method from module.
    
    @Text = Text =

### `clean`
Cleans a text from spaces, citications and unnecessary htm code.

      clean: (text) -> 
        rmSpace rmCitations rmHTML text
        
### `hasAjaxFragment`
Detect ajax fragments in html code for upcomming wrapper.

      hasAjaxFragment: (html) ->
        $ = cheerio.load html
        $("meta[name='fragment']").attr("content") is "!"
        
### `correctLanguage`
Correct language encoding to a more usually form.

      correctLanguage: (lang) ->
        switch lang
          when "deu" then "de"
          when "eng" then "en"
          when "cmn" then "zh"
          when "spa" then "es"
          when "arb" then "ar"
          when "pol" then "pl"
          when "ita" then "it"
          when "por" then "pt"
          when "nld" then "nl"
          when "ukr" then "uk"
          when "jpn" then "jp"
          when "swh" then "sw"
          when "und" then "en"
          else lang
          
### `detectLanguage`
Detect and correct any language.

      detectLanguage: (text) ->
        whitelist = ["deu","eng","spa","pol","ita","por","nld","ukr","jpn","swh","und"]
        lang = franc text, whitelist: whitelist
        @correctLanguage lang

## Helpers
The full list of helpers used above, each one takes a string and
returns a string.

### `rmCitations`
Remove Wikipedia citations like: *citation[3]*
    
    rmCitations = (str) ->
      str.replace /\[[^\]]{0,5}\]/g, " "

### `rmHTML`
Remove HTML and HTML Entities (with german extension).

    rmHTML = (str) ->
      _(_(str).unescapeHTML()).stripTags()
        .replace /&nbsp;/g, ' '
        .replace /&auml;/g, "ä"
        .replace /&ouml;/g, "ö"
        .replace /&uuml;/g, "ü"
        .replace /&Auml;/g, "Ä"
        .replace /&Ouml;/g, "Ö"
        .replace /&Uuml;/g, "Ü"
        .replace /&szlig;/g, "ß"

### `rmSpace`
Remove any whitespaces.

    rmSpace = (str) ->
      _(str).clean()