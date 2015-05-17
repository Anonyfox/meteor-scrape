/// <reference path="../../definitions/scrape.ts" />

module Extract.Feeds {
	
	/**
	 * Shorthand Constructors
	 */
	
	export function fromCheerio($: CheerioStatic): IFeedsExtractor {
		return new Feeds($);
	}
	
	/**
	 * Returned Class
	 */
	
	class Feeds implements IFeedsExtractor {
		
		private data: string[] = [];
		
		constructor($: CheerioStatic) {
			var selectors = [
				"link[type='application/rss+xml']",
        		"link[type='application/atom+xml']",
        		"link[rel='alternate']"
			]
			var list: string[] = [];
			$(selectors.join(",")).each((i,e) => {
				var url = $(e).attr("href");
				list.push(url);
			});
			// TODO: parse and autocorrect the actual URLs
			this.data = list.compact().unique();
		}
		
		toList(): string[] {
			return this.data;
		}
		
	}
	
}