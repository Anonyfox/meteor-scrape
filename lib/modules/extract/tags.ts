/// <reference path="../../definitions/scrape.ts" />

module Extract.Tags {
	
	/**
	 * Shorthand Constructors
	 */
	
	export function fromString(str: string): ITagsExtractor {
		var language = Calculate.Language.fromString(str);
		var tags: string[] = Yaki(str, {language: language}).extract();
		return new Tags(tags);
	}
	
	export function fromCheerio($: CheerioStatic): ITagsExtractor {
		var str = $("meta[name='keywords']").attr("content");
		if (str) {
			var language = Calculate.Language.fromString(str);
			var tags: string[];
			if (/;/.test(str)) {
				tags = str.split(";");
			} else {
				tags = str.split(",");
			}
			return new Tags(Yaki(tags).clean());
			
		} else {
			return new Tags([]);
		}
		
	}
	
	/**
	 * Returned Class
	 */
	
	export class Tags implements ITagsExtractor {
		
		constructor(private data: string[]) {
			// TODO: string cleaning and optimizations
		}
		
		toList(): string[] {
			return this.data;
		}
		
	}
	
}