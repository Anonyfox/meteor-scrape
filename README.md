# Scraping Web Stuff with Meteor

This package adds some sophisticated scraping utilities to your meteor app. You can request ordinary
HTML sites or RSS/Atom-Feeds and get a nicely detailed result object back. A few features, built on top of
excellent NPM modules:

- **Encoding autocorrection**: non-UTF-8 sources, get [detected](https://github.com/runk/node-chardet) and [converted](https://github.com/ashtuchkin/iconv-lite)
- Follows the **Google Ajax Specification***, [can scrape dynamic pages](https://developers.google.com/webmasters/ajax-crawling/)
- **[Language Detection](https://github.com/wooorm/franc)** is built in
- fast and sophisticated **[tagging](https://github.com/nefiltari/yaki)**
- **RSS/Atom feed parsing** and item optimization:
  - Tries hard to find an acceptable image
  - Tags the content directly
- Scrape [wikipedia.org](http://en.wikipedia.org/) directly via keywords in different languages

## Installation

`meteor add anonyfox:scrape`

## Quickstart

Works on the **server** with an easy API:

````coffee-script
    # scrape any website
    websiteData = Scrape.website "http://example.com/article"

    # scrape any RSS or Atom feed
    feedData = Scrape.feed "http://example.com/rss.xml"

    # scrape wikipedia
    article = Scrape.wikipedia "web scraping"

    # scrape everything else, without further parsing
    data = Scrape.url "http://example.com/"
````

## Responses

#### Scrape.website

Works best for typical articles, blog posts or other content sites, but even a tweet should
suffice. Example response data for `http://www.bbc.com/news/technology-31565368`:
````json
    {
      title: 'Inside the digital war room',

      text: '21 February 2015 Last updated at 15:55 GMT It is not clear how many devices have the software installed Chinese computer maker Lenovo is offering customers a tool to help them remove pre-installed software that experts warned was a security risk. The Superfish adware [...]', # shortened, actually here is the full text !

      lang: 'eng',

      description: 'This would allow it - or anyone who hacked Superfish - to collect data over secure web connections. Users had initially complained about intrusive pop-up ads appearing on their browsers. Lenovo said on Thursday it had disabled it because of customer complaints. Superfish was designed to help users find products by visually analysing images on the web to find the cheapest ones. Superfish appears to work by substituting its own security key for the encryption certificates used by many websites.',

      favicon: 'http://www.bbc.co.uk/favicon.ico',

      references: [ 'http://m.bbc.co.uk/', ... ]

      image: 'http://news.bbcimg.co.uk/media/images/81152000/jpg/_81152777_81101864.jpg',

      feeds:
      [ 'http://www.bbc.com/news/technology-31565368',
        'http://www.bbc.co.uk/news/technology-31565368' ],

      tags:
      [ 'devices',
       'software',
       'installed',
       'computer',
       'lenovo',
       'offered',
       'customer',
       'help',
       'remove',
       'experts',
       'warned',
       'secure',
       'risk',
       'superfish',
       'company',
       'quot',
       'users',
       'use',
       'find',
       'web',
       'appears' ],

      domain: 'www.bbc.com',

      url: 'http://www.bbc.com/news/technology-31565368'
    }
````

#### Scrape.feed

Takes any RSS or Atom Feed and returns a bunch of items. For example:

````coffee-script
    data = Scrape.feed "http://feeds.venturebeat.com/VentureBeat" # {items: [...]}
````

A single news item looks like this:
````json
    {
      title: 'AppMachine raises $15M to help non-coders build their own mobile apps',

      description: '"Build your own app" startup AppMachine has announced a $15.2 million funding round, as domain hosting and registration behemoth Endurance International Group takes 40 percent in shares.',

      language: 'eng',

      link: 'http://venturebeat.com/2015/02/24/appmachine-raises-15m-to-help-non-coders-build-their-own-apps/',

      pubDate: Tue Feb 24 2015 16:10:17 GMT+0000 (UTC),

      image: 'http://i2.wp.com/venturebeat.com/wp-content/uploads/2015/02/Apps1.jpg?resize=160%2C140',

      tags:
       [ 'netherlands',
         'deals',
         'appmachine',
         'business',
         'appmachine',
         'raises',
         'help',
         'coders',
         'build',
         'mobile',
         'app',
         'startup',
         'announced',
         'funding',
         'round',
         'domain',
         'hosting',
         'registration',
         'behemoth',
         'endurance',
         'international',
         'group',
         'takes',
         'percent',
         'shares' ]
    }
````

#### Scrape.wikipedia

Takes a simple keyword and optional language and additional tags (in case of disambiguation)

````coffee-script
    Scrape.wikipedia 'avengers', 'en', ['film']
````

This produces following output:
````json
{
  title: 'The Avengers (2012 film)'
  lang: 'en'
  descriptions: [ '2012 superhero film produced by Marvel Studios' ]
  tags: [ 'avengers' ]
  aliases: [ 'Marvel Avengers Assemble', 'Marvel\'s The Avengers' ]
  url: 'http://en.wikipedia.org/wiki/The_Avengers_(2012_film)'
  summary: '<p><i><b>Marvel\'s The Avengers</b></i> (classified under the name <i><b>Marvel Avengers Assemble</b></i> in the United Kingdom and Ireland), or simply <i><b>The Avengers</b></i>, is a 2012 American superhero film based on the Marvel Comics superhero team of the same name, produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures.<sup class="reference plainlinks nourlexpansion" id="ref_1">1</sup> It is the sixth installment in the Marvel Cinematic Universe. The film was written [...]'
  meta:
    caption: 'Theatrical release poster'
    director: '[Joss Whedon](http://en.wikipedia.org/wiki/Joss_Whedon)'
    producer: '[Kevin Feige](http://en.wikipedia.org/wiki/Kevin_Feige)'
    screenplay: 'Joss Whedon'
    based: '[The Avengers](http://en.wikipedia.org/wiki/Avengers_(comics))'
    music: '[Alan Silvestri](http://en.wikipedia.org/wiki/Alan_Silvestri)'
    cinematography: '[Seamus McGarvey](http://en.wikipedia.org/wiki/Seamus_McGarvey)'
    studio: '[Marvel Studios](http://en.wikipedia.org/wiki/Marvel_Studios)'
    runtime: '143 minutes'
    country: 'United States'
    language: 'English'
    budget: '$220 million'
    gross: '$1.518 billion'
````

## ToDo

- [ ] get it working on the client
- [ ] image thumbnail creation
- [ ] transform Favicon to Base64 String

## License

Scraping is a game of catch-22, and everything may break everytime. Therefore this package is licensed under
the **LGPL 3.0**. Do whatever you want with it, but please give improvements and bugfixes back so everyone can benefit.