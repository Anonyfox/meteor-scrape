/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	/**
	 * Use different extraction algorithms, dependend on the
	 * input. 
	 * 
	 * For a date-string, try to parse it using "moment.js". For 
	 * a Cheerio DOM element, try to find the correct date string, 
	 * and then proceed it.
	 */
	
	export function PubDate(input: string | CheerioStatic): Date {
		if (!input) {
			return new Date();
		}
		if (_.isString(input)) {
			return fromString(<string>input);
		} else {
			return fromCheerio(<CheerioStatic>input);
		}
	}
	
	/**
	 * try to parse the given date string using moment.js. A bit 
	 * brittle right now, since it relies on the new Date()-constructor
	 * right now. 
	 * 
	 * Actual string parsing for a more robust solution is
	 * hightly desired!
	 */
	
	function fromString(str: string): Date {
		var date: moment.Moment;
		try {
			// TODO: try several specific patterns here
			date = moment(new Date(str));
		}
		catch (e) {
			date = moment();
		}
		if (!date || !date.isValid()) {
			date = moment();
		}
		return date.toDate();
	}
	
	/**
	 * At the moment only useful for XML data. Look through the DOM to
	 * find the usual tags that may contain the timestamp.
	 */
	
	function fromCheerio($: CheerioStatic): Date {
		var dateString: string = $("pubDate,pubdate,updated").first().text();
		if (!dateString) {
			// try google microdata markup
			dateString = $("time[itemprop='startDate']").attr("datetime");
		}
		return fromString(dateString);
	}
	
}