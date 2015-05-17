/// <reference path="../../definitions/scrape.ts" />

module Extract.Image {
	
	/**
	 * Shorthand Constructors
	 */
	
	export function fromString(str: string): IImageExtractor {
		return new Image(str);
	}
	
	export function fromCheerio($: CheerioStatic): IImageExtractor {
		var selectors: string[] = [
			"meta[property='og:image']",
			"meta[name='twitter:image']"
		]
		var list = []; 
		$(selectors.join(",")).each((i,e) => {
			list.push($(e).attr("content"));
		})
		return new Image(list.compact().first());
	}
	
	/**
	 * Returned Class
	 */
	
	export class Image implements IImageExtractor {
		
		constructor(private data: string) {
			// TODO: string cleaning and optimizations
		}
		
		toString(): string {
			return this.data;
		}
		
	}
	
}