/// <reference path="../../definitions/scrape.ts" />

module Extract.Fulltext {
	
	/**
	 * Shorthand Constructors
	 */
	
	export function fromString(str: string): IFulltextExtractor {
		return new Fulltext(str);
	}
	
	export function fromCheerio($: CheerioStatic, onlyCanonical?: boolean): IFulltextExtractor {
		return new Fulltext($.html());
	}
	
	var readability = Npm.require("readabilitySAX");
	
	/**
	 * Returned Class
	 */
	
	class Fulltext implements IFulltextExtractor {
		
		private data: string;
		
		constructor(str: string) {
			// TODO: string cleaning
			this.data = readability.process(str, {type: "text"}).text;
			this.normalize();
		}
		
		normalize(): void {
			if (this.data.length < 50) {
				this.data = "";
			}
		}
		
		toString(): string {
			return this.data;
		}
		
	}
	
}