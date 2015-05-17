/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	var at = Npm.require("article-title");
	
	/**
	 * Uses different extraction algorithms, dependend on the 
	 * input. 
	 * 
	 * For a html-string, use the "article-title" lib 
	 * to determine the true title of the document. If it's a 
	 * Cheerio DOM element, extract from <title>, <h1>, ... . 
	 */
	
	export function Title(input: string | CheerioStatic): string {
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
	 * Use the "article-title" lib to find the "true" title
	 * from the given HTML string and strip out noise as much
	 * as possible.
	 */
	
	function fromString(str: string): string {
		var title = at(str);
		// TODO: string cleaning
		return title;
	}
	
	/**
	 * Just grab the contents of the "<title>" tag, or use 
	 * the headlines' text, without further guessing.
	 */
	
	function fromCheerio($: CheerioStatic): string {
		var str = $("title,h1,h2,h3,h4,h5,h6").first().text();
		// TODO: string cleaning
		return str;
	}
	
}