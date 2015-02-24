Package.describe({
  name: 'anonyfox:scrape',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Sophisticated scraping utilities for your meteor app. Works for websites and RSS/Atom feeds.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  documentation: 'README.md'
});

Npm.depends({
  "request": "2.53.0",
  "chardet": "0.0.8",
  "iconv-lite": "0.4.3",
  // "unfluff": "0.10.0",
  "franc": "0.7.1",
  "article-title": "1.0.1",
  "teaser": "0.1.1",
  "summarizely": "0.0.2",
  "cheerio": "0.18.0",
  "readabilitySAX": "1.6.1",
  "is-url": "1.2.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use([
    'coffeescript',
    'underscore',
    'url',
    'froatsnook:request',
    'anonyfox:tags@0.0.13',
    'wizonesolutions:underscore-string'
    // 'numtel:phantomjs-persistent-server'
  ],['server']);
  api.export(['Scrape'],['client','server']);
  // api.export(['ScrapeClient'],['client']);
  api.addFiles([
    'lib/link.coffee.md',
    'lib/text.coffee.md',
    'lib/scrape-request.coffee.md',
    'lib/parse-website.coffee.md',
    'lib/parse-feed.coffee.md'
  ],['server']);
  api.addFiles("scrape-client.coffee.md",'client');
  api.addFiles("scrape-server.coffee.md","server");
  api.addFiles("globals.js");
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'coffeescript',
    'underscore',
  ],['client','server']);
  api.use('anonyfox:scrape@0.0.1');
  api.addFiles('test.coffee.md');
});
