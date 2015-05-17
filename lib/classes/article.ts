/// <reference path="../../lib/definitions/scrape.ts" />

module Parse.Article {
	
	var cheerio = Npm.require("cheerio");
	
	/**
	 * Shorthand Constructors
	 */
	 
	export function fromString(str: string): IArticle {
		return new ArticleObject(str);
	}
		
	export function fromUrl(url: string): IArticle {
		return new ArticleObject(url);
	}
	 
	/**
	 * The returned Class
	 */
	 
	export class ArticleObject implements IArticle {
		
		title: string;
		name: string; //alias for title
		description: string;
		summary: string; // alias for description
		fullText: string;
		url: string;
		link: string; // alias for url
		image: string;
		language: string;
		references: string[];

		tags: string[];
		keywords: string[]; // alias for tags
		nativeTags: string[];
		nativeKeywords: string[]; // alias for nativeTags
		private $: CheerioStatic;
		
		constructor(private str: string) {
			this.$ = cheerio.load(str, {xmlMode: true});
			this.extractBasicData();
			this.extractAdvancedData();
		}
		
		private extractBasicData(): void {
			this.title = Extract.Title.fromString(this.str).toString();
			this.url = Extract.Link.fromCheerio(this.$, true).toString();
			this.fullText = Extract.Fulltext.fromString(this.str).toString();
			this.image = Extract.Image.fromCheerio(this.$).toString();
		}
		
		private extractAdvancedData(): void {
			this.description = Extract.Description.fromString(this.fullText).toString();
			this.language = Calculate.Language.fromString(this.fullText).code();
			this.tags = Extract.Tags.fromString(this.fullText).toList();
		}
	}
}