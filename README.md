# Scraping Web Stuff with Meteor

This package adds some sophisticated scraping utilities to your meteor app. You can request ordinary
HTML sites or RSS/Atom-Feeds and get a nicely detailed result object back. A few features, built on top of
excellent NPM modules:

- **Encoding autocorrection**: Don't worry for non-UTF-8 sources, they'll get [detected](https://github.com/runk/node-chardet) and [converted](https://github.com/ashtuchkin/iconv-lite)
- Follows the **Google Ajax Specification***, thus can scrape dynamic pages (as long as google could do it, too)
- **[Language Detection](https://github.com/wooorm/franc)**
- **Summarization**: extracted text content on websites comes in different flavors:
  - [Title](https://github.com/sindresorhus/article-title): the determined headline
  - Description: can be a [a four-sentence summary of the content of this page](https://www.npmjs.com/package/teaser) or [The most important sentences of the whole text](https://www.npmjs.com/package/summarizely) or handpicked from meta tags
  - **[fulltext](https://www.npmjs.com/package/readabilitySAX)**: The complete *text* of the Website (think of instapaper, pocket or readability)
- fast and sophisticated **[tagging](https://github.com/Anonyfox/meteor-tags)**
- **RSS/Atom feed parsing** and item optimization:
  - Tries hard to find an acceptable image
  - Tags the content directly

## Installation

`meteor add anonyfox:scrape`

## Usage

Works on the server with an easy API:

`data = Scrape.website "http://example.com/article" # for websites and articles`

`data = Scrape.feed "http://example.com/rss.xml" # for RSS/Atom feeds`

`data = Scrape.url "http://example.com/" # for anything else, plain HTML`

or on the Client **(client support still in progress, doesn't work for now.)**

`Scrape.website "http://example.com/article", (error, data) -> console.log data`

`Scrape.feed "http://example.com/article", (error, data) -> console.log data`

`Scrape.feed "http://example.com/", (error, data) -> console.log data`

## Responses

#### Scrape.website

Works best for typical articles, blog posts or other content sites, but even a tweet should
suffice. Example response data for `http://www.bbc.com/news/technology-31565368`:

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

#### Scrape.feed

Takes any RSS or Atom Feed and returns a bunch of items. For example:

    `data = Scrape.feed "http://feeds.venturebeat.com/VentureBeat"` # {items: [...]}

A single news item looks like this:

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

## ToDo

- [ ] get it working on the client
- [ ] image thumbnail creation
- [ ] transform Favicon to Base64 String

## License

Scraping is a game of catch-22, and everything may break everytime. Therefore this package is licensed under
the **LGPL 3.0**. Do whatever you want with it, but please give improvements and bugfixes back so everyone can benefit
from it.