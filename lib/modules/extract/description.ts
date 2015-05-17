/// <reference path="../../definitions/scrape.ts" />

module Extract.Description {
	
	var nlpsum = Npm.require("nlpsum");
	
	/**
	 * Shorthand Constructors
	 */
	
	export function fromString(str: string): IDescriptionExtractor {
		var sum = new nlpsum();
		var text = sum.sinWordFrequencySummary(str, 4).text;
		return new Description(text);
	}
	
	export function fromCheerio($: CheerioStatic): IDescriptionExtractor {
		var metaDescription = extractMeta($);
		if (metaDescription) {
			return new Description(metaDescription);
		} else {
			var str: string = $("description").first().text();
			return new Description(str);
		}
	}
	
	/**
	 * Construction helpers
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
	
	/**
	 * Returned Class
	 */
	
	export class Description implements IDescriptionExtractor {
		
		constructor(private data: string) {
			// TODO: string cleaning and optimizations
		}
		
		toString(): string {
			return this.data;
		}
		
	}
	
}