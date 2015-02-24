# Link

This helper module simplifies the handling of URIs and extracts a bit of
data from it. It uses the following packages under the hood:

    isUrl = Npm.require "is-url"
    url = Npm.require "url"

To avoid confusions, URIs received as parameters are now called *links*, while
internal used libraries or helpers are derivates of *URLs or URIs*.

    @Link =
      test: (link) -> isUrl link
      join: (base, path) -> join base, path
      base: (link) -> base link
      domain: (link) -> url.parse(link).hostname
      brands: (link) -> brands link
      path: (link) -> url.parse(link).pathname
      ajaxified: (link) -> ajaxified link

Some helpers are nontrivial (or at least, don't fit well in a one-liner):

    base = (link) ->
      u = url.parse link
      "#{u.protocol}//#{u.hostname}"

    join = (domain, path) ->
      if path
        url.resolve base(domain), path
      else
        base(domain)

    brands = (link) ->
      u = url.parse link
      words = _.filter u.hostname.split("."), (w) -> w.length > 3
      Tags.clean words

    ajaxified = (link) ->
      u = url.parse link
      params = if u.search?.length > 1
        u.search + "&_escaped_fragment_=!"
      else
        "?_escaped_fragment_=!"
      hash = if u.hash then u.hash else ""
      "#{u.protocol}//#{u.hostname}#{u.pathname}#{params}{hash}"