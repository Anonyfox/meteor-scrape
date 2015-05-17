/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	var nlpsum = Npm.require("nlpsum");
	
	/**
	 * Uses different extraction algorithms, dependend on the 
	 * input. 
	 * 
	 * For a text-string, leverage the "nlpsum"-algorithms to find
	 * the most important sentences. For a Cheerio DOM element, 
	 * search in the DOM for relevant meta-tags and use their
	 * content.
	 */
	
	export function Description(input: string | CheerioStatic): string {
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
	 * Use the "nlpsum" lib to extract the most relevant sentences
	 * from the given natural text. Currently, hard-code the 
	 * amount of sentences included to 4 for best results.
	 */
	
	function fromString(str: string): string {
		var sum = new nlpsum();
		var text = sum.sinWordFrequencySummary(str, 4).text;
		// TODO: string cleaning
		return text;
	}
	
	/**
	 * Search for social media share-markup first, use the 
	 * meta-description-tag if none are found. 
	 * 
	 * In case it's not a HTML DOM but some kind of XML, try
	 * usual tag names. 
	 */
	
	function fromCheerio($: CheerioStatic): string {
		var metaDescription = extractMeta($);
		if (metaDescription) {
			return metaDescription;
		} else {
			var str = $("description, summary").first().text();
			return str;
		}
	}
	
	/**
	 * Search a DOM for usual meta tags meant for sharing
	 * informations. 
	 */
	 
	function extractMeta($: CheerioStatic): string {
		var selectors = [
			"meta[property='og:description']",
        	"meta[name='twitter:description']",
        	"meta[name='description']"
		];
		var list: string[] = [];
		$(selectors.join(",")).each((i,e) => {
			list.push($(e).attr("content"));
		});
		return list.compact().sortBy("length").last();
	} 
	
}