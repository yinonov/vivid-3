// @ts-ignore
import * as fs from 'fs';
import * as path from 'path';
const extract = require('extract-gfm');
import type {Page} from '@playwright/test';

/**
 * @param str
 * @param find
 * @param replace
 */
export function replaceAll(str: string, find: string, replace: string) {
	return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * @param pathToReadme
 */
export function extractHTMLBlocksFromReadme(pathToReadme: string): string[] {
	const readmeFileContents = fs.readFileSync(path.resolve(pathToReadme)).toString();
	const readmeFileSnippets = extract.extractBlocks(readmeFileContents);
	return readmeFileSnippets.filter((block: any) => block.lang === 'html').map((block: any) => replaceAll(block.code.replace('preview', ''), '\n', ''));
}

const defaultStyles = [
	'http://127.0.0.1:8080/dist/libs/themes/fonts/spezia.css',
	'http://127.0.0.1:8080/dist/libs/themes/theme/light.css'
];

/**
 * @param root0
 * @param root0.page
 * @param root0.componentName
 * @param root0.styleUrls
 */
export async function loadComponent({
	page,
	componentName,
	styleUrls = defaultStyles,
}: {
	page: Page,
	componentName: string,
	styleUrls?: string[]
}) {
	await page.goto('http://127.0.0.1:8080/scripts/visual-tests/index.html');

	await page.addScriptTag({
		url: `http://127.0.0.1:8080/dist/libs/components/${componentName}/index.js`,
		type: 'module',
	});

	const styleTags$ = styleUrls.map(url => page.addStyleTag({ url }));
	await Promise.all(styleTags$);
}

/**
 * @param root0
 * @param root0.page
 * @param root0.template
 */
export async function loadTemplate({
	page,
	template,
}: { page: Page, template: string }) {
	const wrappedTemplate = `<div id="wrapper">${template}</div>`;
	await page.addScriptTag({
		content: `
            document.body.innerHTML = \`${wrappedTemplate}\`;
        `,
	});
}
