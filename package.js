Package.describe({
  name: 'anonyfox:scrape',
  version: '0.0.2',
  summary: 'Scrape any Website or RSS/Atom-Feed with ease',
  git: 'https://github.com/Anonyfox/meteor-scrape',
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
    'froatsnook:request@2.53.2',
    'anonyfox:tags@0.0.13',
    'wizonesolutions:underscore-string@1.0.0'
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
  api.use('anonyfox:scrape');
  api.addFiles('test.coffee.md');
});
