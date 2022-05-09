const fs = require('fs');
const Image = require('@11ty/eleventy-img');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const pluginTOC = require('eleventy-plugin-toc');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const PATH = require('path');


module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(pluginTOC);
	eleventyConfig.addShortcode('image', imageShortcode);
	eleventyConfig.addShortcode('icon', iconShortcode);
	eleventyConfig.addPassthroughCopy('./assets');
	eleventyConfig.addPassthroughCopy('./service-worker.js');
	eleventyConfig.addPassthroughCopy('./robots.txt');

	eleventyConfig.setBrowserSyncConfig({
		files: ['./**/*.css', './**/*.js'],
	});


	// ISO Date Format
	eleventyConfig.addLiquidFilter('isoDate', (dateValue) => {
		return isoDate(dateValue);
	});

	eleventyConfig.setLibrary('md', markdownIt().use(markdownItAnchor))


	return {
		dir: {
			layouts: '_layouts',
		},
		htmlTemplateEngine: 'liquid',
		markdownTemplateEngine: 'liquid',
	};

};

async function imageShortcode(src, alt, classString) {

	//console.log({ src, alt, classString });

	let sizes = '(min-width: 1024px) 100vw, 50vw';
	let srcPrefix = `./assets/img/`;
	src = srcPrefix + src;
	console.log(`Generating image(s) from:  ${src}`);

	if (!alt) {
		// Throw an error on missing alt (alt="" works okay)
		throw new Error(`Missing \`alt\` on responsiveimage from: ${src}, ${alt}`);
	}
	let defaultFormat = src.endsWith('.png') ? 'png' : 'jpeg';

	let metadata = await Image(src, {
		widths: [600, 900, 1500],
		formats: ['webp', defaultFormat],
		urlPath: '/assets/img',
		outputDir: './_site/assets/img',

		filenameFormat: function (id, src, width, format, options) {
			const extension = PATH.extname(src);
			const name = PATH.basename(src, extension);
			return `${name}-${width}w.${format}`;
		},
	});
	let lowsrc = metadata['webp'][0];
	let pictureClass = classString ? 'class="' + classString + '"' : '';
	return `<picture ${pictureClass}>
	  ${Object.values(metadata)
			.map((imageFormat) => {
				return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat
					.map((entry) => entry.srcset)
					.join(', ')}" sizes="${sizes}">`;
			})
			.join('\n')}
	  <img
		src="${lowsrc.url}"
		width="${lowsrc.width}"
		height="${lowsrc.height}"
		alt="${alt}"
		loading="lazy"
		decoding="async">
	</picture>`;
}

async function isoDate(dateString) {
	const date = new Date(dateString);
	return date.toISOString();
}

async function iconShortcode(file) {
	const svgString = fs.readFileSync('./assets/icons/' + file);
	const currentColor = svgString.toString().replace(/#000/g, 'currentColor');
	return currentColor;
}