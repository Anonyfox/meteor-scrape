/// <reference path="../../definitions/scrape.ts" />

module Extract.Title {
	
	var at = Npm.require("article-title");
	
	/**
	 * Shorthand Constructors
	 */
	
	export function fromString(str: string): ITitleExtractor {
		var title = at(str);
		return new Title(title);
	}
	
	export function fromCheerio($: CheerioStatic, native: boolean = false): ITitleExtractor {
		var str: string;
		if (native) {
			str = $("title").first().text();
		} else {
			str = $("title,h1,h2,h3,h4,h5,h6").first().text();
		}
		return new Title(str);
	}
	
	/**
	 * Returned Class
	 */
	
	class Title implements ITitleExtractor {
		
		constructor(private data: string) {
			// TODO: string cleaning and optimizations
		}
		
		toString(): string {
			return this.data;
		}
		
	}
	
}