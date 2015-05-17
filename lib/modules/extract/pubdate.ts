/// <reference path="../../definitions/scrape.ts" />

module Extract.PubDate {
	
	/**
	 * Shorthand COnstructors
	 */
	
	export function fromString(str: string): IPubDateExtractor {
		return new PubDate(str);
	}
	
	export function fromCheerio($: CheerioStatic): IPubDateExtractor {
		var dateString: string = $("pubDate,pubdate,updated").first().text();
		return new PubDate(dateString);
	}
	
	/**
	 * Returned Class
	 */
	
	 class PubDate implements IPubDateExtractor {
		
		private data: moment.Moment;
		
		constructor(private inputData: string) {
			try {
				// TODO: try several specific patterns here
				this.data = moment(new Date(inputData));
			}
			catch (e) {
				this.data = moment();
			}
			if (!this.data || !this.data.isValid()) {
				this.data = moment();
			}
		}
		
		// uses http://momentjs.com/docs/#/displaying/format/ syntax
		public toString(pattern?: string): string {
			if (pattern) {
				return this.data.format(pattern);
			} else {
				return this.data.toISOString();
			}
		}
		
		public toDate(): Date {
			return this.data.toDate();
		}
	}
	
}