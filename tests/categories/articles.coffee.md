# Test Article Parsing
The following tests ensure that the `ParseArticle` module works well for typical
articles. Articles are meant as a special type of website with textual content
about a single topic. 

If you want to scrape a blog page, the domain root page would be considered a 
`website`, while individual blog posts should be trated as `articles`. 

## BBC Article
A good example for a news article of common quality, with a medium text length and
some artifacts like "related articles" and social media stuff.

		Tinytest.add "parse article - bbc-article.html", (test) ->
			html = UnitTests.Samples.site "bbc-article.html"
			data = Parse.Article.fromString html
			test.equal data.url, 'http://www.bbc.com/news/technology-31565368'
			test.equal data.language, 'en'
			test.equal data.title, 'Lenovo offers tool to remove hidden adware \'Superfish\''
			test.equal data.image, 'http://news.bbcimg.co.uk/media/images/81148000/jpg/_81148701_81101864.jpg'
			test.isTrue data.description.has "Chinese computer maker Lenovo"
			test.include data.tags, "lenovo"
			test.include data.tags, "superfish"
			test.include data.tags, "adware"
			test.include data.tags, "computer"
			test.include data.tags, "software"
			test.include data.references, 'http://news.lenovo.com/article_display.cfm?article_id=1931'
			test.isTrue data.fullText.has "Lenovo said on Thursday it had disabled it because of"