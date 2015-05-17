/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	var readability = Npm.require("readabilitySAX");
	
	/**
	 * Use different extraction algorithms, dependend on the
	 * input. 
	 * 
	 * For a given html-string, use the readability-lib to
	 * extract the raw text content of the html site. For
	 * a Cheerio DOM element, extract it's html as a string
	 * first, and then process as usual.
	 */
	 
	export function Fulltext(input: string | CheerioStatic): string {
		if (!input) {
			return "";
		}
		if (_.isString(input)) {
			return fromString(<string>input);
		} else {
			return fromCheerio(<CheerioStatic>input);
		}
	}
	
	/**
	 * Use the "readability" lib to process the html string.
	 * If the result is too short, drop it entirely, since
	 * this would hinder later analysis of the text. 
	 */
	
	function fromString(str: string): string {
		var text = readability.process(str, {type: "text"}).text;
		if (text.length < 50) {
			text = "";
		}
		// TODO: string cleaning
		return text;
	}
	
	/**
	 * Just transform the DOM element to raw html, and process it!
	 */
	
	function fromCheerio($: CheerioStatic): string {
		return fromString($.html());
	}
	
}