/* global Npm */
/* global Package */

/**
 * Scrape Package Information
 */

Package.describe({
  name: 'anonyfox:scrape',
  version: '0.1.0',
  summary: 'Scrape any Website or RSS/Atom-Feed with ease',
  git: 'https://github.com/Anonyfox/meteor-scrape',
  documentation: 'README.md'
});

/**
 * External Libraries from NPM
 */

Npm.depends({
  "request": "2.53.0",
  "chardet": "0.0.8",
  "iconv-lite": "0.4.3",
  "franc": "0.7.1",
  "article-title": "1.0.1",
  "teaser": "0.1.1",
  "summarizely": "0.0.2",
  "cheerio": "0.18.0",
  "readabilitySAX": "1.6.1",
  "is-url": "1.2.0",
  "url":"0.10.3",
  "nlpsum":"0.1.15"
});

/**
 * Package Files and Dependencies
 */

Package.onUse(function(api) {
  
  // required meteor packages
  api.versionsFrom('1.0');
  api.use([
    'coffeescript',
    'underscore',
    'digilord:sugarjs@1.4.1',
    'url',
    'froatsnook:request@2.53.2',
    'nefiltari:yaki@0.1.5',
    'wizonesolutions:underscore-string@1.0.0',
    'mologie:typescript@0.0.9',
    'momentjs:moment@2.10.3',
  ],['server']);
  
  // expose the Scrape symbol to hosting meteor apps
  api.export(['Scrape', 'Parse'],['server']);
  
  // package files
  api.addFiles([
    // [refactored] TypeScript files:
    'lib/definitions/scrape.ts',
    'lib/modules/calculate/language.ts',
    'lib/modules/extract/title.ts',
    'lib/modules/extract/description.ts',
    'lib/modules/extract/pubdate.ts', 
    'lib/modules/extract/link.ts',
    'lib/modules/extract/fulltext.ts',
    'lib/modules/extract/feeds.ts',
    'lib/modules/extract/favicon.ts',
    'lib/modules/extract/image.ts',
    'lib/modules/extract/tags.ts',
    'lib/modules/extract/references.ts',
    'lib/parser/feed_item.ts',
    'lib/parser/feed.ts',
    'lib/parser/website.ts',
    'lib/parser/article.ts',
    // [deprecated] Coffeescript files: 
    'lib/text.coffee.md',
    'lib/scrape-request.coffee.md',
    'lib/parse-wikipedia.coffee.md',
  ], ['server']);
  api.addFiles("scrape-server.coffee.md","server");
  api.addFiles("globals.js","server");
});

/**
 * Package Test Files
 */

Package.onTest(function(api) {
  
  // meteor packages
  api.use([
    'tinytest',
    'coffeescript',
    'underscore',
    'mologie:typescript@0.0.9',
    'anonyfox:scrape'
  ],['server']);
  
  // sample data
  api.addFiles([
    'tests/sampledata/sites/venturebeat-website.html',
    'tests/sampledata/sites/focus-website.html',
    'tests/sampledata/sites/bbc-article.html',
    'tests/sampledata/sites/tweet.html',
    'tests/sampledata/sites/golem-article.html',
    'tests/sampledata/feeds/meteor-feed.xml',
    'tests/sampledata/feeds/spiegel-feed.xml',
    'tests/sampledata/feeds/rtv-feed.xml'
  ], 'server', {isAsset: true});
  
//  api.addFiles('test.coffee.md');
  // individual test files, toggle to speed up testing during development
  api.addFiles([
    'tests/helper/samples.ts',
    'tests/categories/feeds.coffee.md',
    'tests/categories/websites.coffee.md',
    'tests/categories/articles.ts',
  ], 'server');
});
