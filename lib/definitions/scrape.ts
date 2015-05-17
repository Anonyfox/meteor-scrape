// THIRD PARTY DEFINITIONS
/// <reference path="meteor.d.ts" />
/// <reference path="cheerio.d.ts" />
/// <reference path="sugar.d.ts" />
/// <reference path="underscore.d.ts" />
/// <reference path="node.d.ts" />
/// <reference path="moment.d.ts" />

// CALCULATIONS
/// <reference path="../modules/calculate/language.ts" />

// EXTRACTORS
/// <reference path="../modules/extract/title.ts" />
/// <reference path="../modules/extract/description.ts" />
/// <reference path="../modules/extract/pubdate.ts" />
/// <reference path="../modules/extract/image.ts" />
/// <reference path="../modules/extract/favicon.ts" />
/// <reference path="../modules/extract/link.ts" />
/// <reference path="../modules/extract/fulltext.ts" />
/// <reference path="../modules/extract/feeds.ts" />
/// <reference path="../modules/extract/tags.ts" />

// CLASSES
/// <reference path="../classes/feed_item.ts" />
/// <reference path="../classes/feed.ts" />
/// <reference path="../classes/website.ts" />
/// <reference path="../classes/article.ts" />

// UNTYPED LIBRARIES :(
declare var Yaki; // TODO: find/create a *.d.ts definition file for yaki
declare var franc; // TODO: find/create a *.d.ts definition file for franc

/**
 * Calculations: 
 * 
 * The actual number crunching happens here. Most computations are 
 * based on strings instead of numbers, though. 
 * 
 * The interfaces below are used for the internal classes of
 * these modules, whose instances are finally returned.
 */
 
 module Calculate {
	 
	 export interface ILanguage {
		 code(format?: string): string;
	 } 
 
 }

/**
 * Parser: 
 * 
 * the heart of this library. It is possible to parse Feeds (Atom/RSS),
 * Websites and Wikipedia Articles. 
 * 
 * Every Parser has two shorthand constructors: `fromString()` and 
 * `fromUrl()`.
 * 
 * The interfaces below are used for the internal classes of
 * these modules, whose instances are finally returned.
 */

module Parse {
	
	export interface IFeed {
		title: string;
		url: string;
		description: string;
		language: string;
		pubDate: Date;
		lastBuildDate: string;
		docs: string;
		managingEditor: string;
		webMaster: string;
		items: IFeedItem[];
	}
	
	export interface IFeedItem {
		title: string;
		description: string;
		url: string;
		pubDate: Date;
		image: string;
		language: string;
		tags: string[];
		nativeTags: string[];
	}
	
	export interface IWebsite {
		title: string;
		name: string; //alias for title
		description: string;
		summary: string; // alias for description
		url: string;
		link: string; // alias for url
		image: string;
		language: string;
		favicon: string;
		references: string[];
		feeds: string[];
	}
	
	export interface IArticle {
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
	}
}