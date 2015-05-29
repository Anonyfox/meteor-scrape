/// <reference path="../test-definitions.ts" />

/**
 * The following tests ensure that the `ParseArticle` module works well for typical
 * articles. Articles are meant as a special type of website with textual content
 * about a single topic.
 * 
 * If you want to scrape a blog page, the domain root page would be considered a
 * `website`, while individual blog posts should be trated as `articles`.  
 */

/**
 * A good example for a news article of common quality, with a medium text length and
 * some artifacts like "related articles" and social media stuff. 
 */

Tinytest.add("parse article - bbc-article.html", (test) => {
  var html = UnitTests.Samples.site("bbc-article.html");
	var data = Parse.Article.fromString(html)
	test.equal(data.url, 'http://www.bbc.com/news/technology-31565368');
	test.equal(data.language, 'en');
	test.equal(data.title, 'Lenovo offers tool to remove hidden adware \'Superfish\'');
	test.equal(data.image, 'http://news.bbcimg.co.uk/media/images/81148000/jpg/_81148701_81101864.jpg');
	test.isTrue(data.description.has("Chinese computer maker Lenovo"));
	test.include(data.tags, "lenovo");
	test.include(data.tags, "superfish");
	test.include(data.tags, "adware");
	test.include(data.tags, "computer");
	test.include(data.tags, "software");
	test.include(data.references, 'http://news.lenovo.com/article_display.cfm?article_id=1931');
	test.isTrue(data.fullText.has("Lenovo said on Thursday it had disabled it because of")); 
});

/**
 * A german article to test that *umlauts* wont break anything. Also there are quite good hints
 * on the page that describe the topic further (useful for keyword/tag extraction). Finally
 * the `image` is well hidden on the sidebar instead of the main part of the DOM with the
 * actual article text
 */
Tinytest.add("parse article - golem-article.html", (test) => {
  var html = UnitTests.Samples.site("golem-article.html");
  var data = Parse.Article.fromString(html);
  // test.equal data.url, 'http://www.bbc.com/news/technology-31565368'
  test.equal(data.language, 'de');
  test.equal(data.title, 'Andreesen Horowitz Wird Meteor das nächste große Ding für Entwickler?');
  test.equal(data.image, 'http://www.golem.de/1207/93439-40201-i.jpg');
  test.isTrue(data.description.has("Für das Investment in Meteor ist bei Andreessen Horowitz Peter Levine zuständig,"));
  test.include(data.tags, 'andreessen horowitz');
  test.include(data.tags, 'meteor');
  // test.include data.tags, 'open source framework'
  test.include(data.tags, 'javascript');
  test.include(data.tags, 'risikokapitalgeber');
  test.include(data.references, 'http://meteor.com/blog/2012/07/25/meteors-new-112-million-development-budget');
  test.isTrue(data.fullText.has("Zu den weiteren Investoren in Meteor zählen neben Andreessen Horowitz"));
});
  
/**
 * Even a minimalist text like a tweet should suffice for the algorithms to determine
 * correct article informations. 
 */
 // disabled for now, better readability is in the works!
//Tinytest.add("parse article - tweet.html", (test) => {
//  var html = UnitTests.Samples.site("tweet.html");
//  var data = Parse.Article.fromString(html);
//  test.equal(data.url, 'https://twitter.com/meteorjs/status/542422624995778564');
//  test.equal(data.language, "en");
//  test.isTrue(data.title.has("Meteor 1.0.1"));
//  test.equal(data.image, 'https://pbs.twimg.com/profile_images/527039622434418688/uJPMDhZq_400x400.png');
//  test.isTrue(data.description.has("Just released Meteor 1.0.1 with a security fix"));
//  test.include(data.tags, "meteor");
//  test.include(data.tags, "security");
//  test.include(data.tags, "released");
//  test.include(data.references, 'https://t.co/DSOobCSZQv'); // DRAGON: resolve shorteners?
//});
