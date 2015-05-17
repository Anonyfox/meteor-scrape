# Test Website Parsing
The following tests ensure that the `ParseWebsite` module works well for typical
websites.

## Venturebeat Website
A nicely optimized news portal for techies and rich of multimedia content and
discoverable features. Makes a good default use-case and should work under any
circumstances.

		Tinytest.add "parse website - venturebeat-website.html", (test) ->
			html = UnitTests.Samples.site "venturebeat-website.html"
			data = Parse.Website.fromString html
			# test.equal data.url, 'http://venturebeat.com/'
			test.equal data.language, 'en'
			test.equal data.title, 'VentureBeat | Tech News That Matters'
			test.equal data.description, 'VentureBeat is the leading source for news & perspective on tech innovation. We give context to help execs, entrepreneurs, & tech enthusiasts make smart decisions.'
			test.equal data.feeds.length, 1
			test.include data.feeds, 'http://feeds.venturebeat.com/VentureBeat'
			test.equal data.image, undefined # DRAGON: image is the logo, hidden in CSS background!

## Focus Online
A german news website, the test ensures that the language is detected properly.
Additionally, this website has a huge amount of content to stress the
performance of the algorithms. This example also confirms that the parser
is able to find more than one feed per website.

		Tinytest.add "parse website - focus-website.html", (test) ->
			html = UnitTests.Samples.site "focus-website.html"
			data = Parse.Website.fromString html
			test.equal data.url, 'http://www.focus.de/'
			test.equal data.language, 'de'
			test.equal data.title, 'FOCUS Online - Nachrichten'
			test.equal data.description, 'FOCUS Online – minutenaktuelle Nachrichten und Service-Informationen von Deutschlands modernem Nachrichtenmagazin.'
			test.equal data.feeds.length, 12
			test.include data.feeds, 'http://rss.focus.de/'
			# test.equal data.image, undefined # DRAGON: image is the logo, hidden in CSS background!
