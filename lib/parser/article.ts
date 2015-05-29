/// <reference path="../../lib/definitions/scrape.ts" />

module Parse.Article {
	
	var cheerio = Npm.require("cheerio");
	
	/**
	 * Shorthand Constructors
	 */
	 
	export function fromString(str: string): ArticleObject {
		return new ArticleObject(str);
	}
		
	export function fromUrl(url: string): ArticleObject {
		return new ArticleObject(url);
	}
	 
	/**
	 * The returned Class
	 */
	 
	export class ArticleObject implements BasicInfo, ArticleInfo, Tagged {
		
		// BasicInfo
		title: string;
		name: string; //alias for title
		description: string;
		summary: string; // alias for description
		fullText: string;
		url: string;
		link: string; // alias for url
		image: string;
		language: string;
		pubDate: Date;
		
		// ArticleInfo
		references: string[];
		
		// Tagged
		tags: string[];
		keywords: string[]; // alias for tags
		nativeTags: string[];
		nativeKeywords: string[]; // alias for nativeTags
		
		// private members
		private $: CheerioStatic;
		
		constructor(private str: string) {
			this.$ = cheerio.load(str, {xmlMode: true});
			this.extractBasicInfo();
			this.extractArticleInfo();
			this.extractTagInfo();
		}
		
		private extractBasicInfo(): void {
			this.title = Extract.Title(this.str);
			this.url = Extract.Link(this.$);
			this.fullText = Extract.Fulltext(this.str);
			this.image = Extract.Image(this.$);
			this.description = Extract.Description(this.fullText);
			this.language = Calculate.Language(this.fullText);
		}
		
		private extractArticleInfo(): void {
			this.references = Extract.References(this.$);
		}
		
		private extractTagInfo(): void {
			this.tags = Extract.Tags(this.fullText);
			this.keywords = this.tags;
			this.nativeTags = Extract.Tags(this.$);
			this.nativeKeywords = this.nativeTags;
		}
	}
}