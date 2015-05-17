/// <reference path="../../definitions/scrape.ts" />

module Extract.Link {
	
	/**
	 * Shorthand Constructors
	 */
	
	export function fromString(str: string): ILinkExtractor {
		return new Link(str);
	}
	
	export function fromCheerio($: CheerioStatic, onlyCanonical?: boolean): ILinkExtractor {
		if (onlyCanonical) {
			var canonical = $("link[rel='canonical']").attr("href");
			return new Link(canonical);
		} else {
			var url: Cheerio = $("link").first();
			var str: string = "";
			if (url.attr("href")) {
				str = url.attr("href");
			} else {
				str = url.text();
			}
			return new Link(str);
		}
	}
	
	/**
	 * Returned Class
	 */
	
	class Link implements ILinkExtractor {
		
		constructor(private data: string) {
			// TODO: parse the damn thing, actually
			// Npm.require("url") ...
		}
		
		toString(): string {
			return this.data;
		}
		
		domain(): string {
			return this.data;
		}
		
		path(): string {
			return this.data;
		}
		
	}
	
}