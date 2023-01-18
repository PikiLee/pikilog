import { buildFileSystemTree, FileSystemNode } from "./FileSystemTree"
import type {
	Heading,
	DocSideBarConfig,
} from "./../types/doc"
import * as fs from "node:fs"
import * as nodePath from "node:path"
import * as crypto from "node:crypto"
import * as buffer from "node:buffer"
import MarkdownIt from "markdown-it"
import MarkdownItAnchor from "markdown-it-anchor"
import lodash from "lodash"
import appConfig from "../plog.config"

export interface Mappings {
  [index: string]: string;
}

/**
 * Add classes to html string.
 * @param {string} html - html string
 * @param {Object} mappings - mappings between a html tag and a class
 * @example
 * ```js
 * {
 *    'h1': 'head1',
 *    'h2': 'head2'
 * }
 * ```
 * @return {string} - html string
 */
export const addClasses = (html: string, mappings: Mappings) => {
	for (const tag in mappings) {
		const escapedClass = lodash.escape(mappings[tag])
		const regex = new RegExp(`<${tag}.*?>`, "gs")

		html = html.replaceAll(regex, (match) => {
			let addedClassMatch = match
			const classIndex = match.indexOf("class")
			if (classIndex !== -1) {
				const insertClassIndex = 7 + classIndex
				addedClassMatch = `${match.slice(
					0,
					insertClassIndex
				)}${escapedClass} ${match.slice(insertClassIndex)}`
			} else {
				const insertClassIndex = 1 + tag.length
				addedClassMatch = `${match.slice(
					0,
					insertClassIndex
				)} class="${escapedClass}"${match.slice(insertClassIndex)}`
			}
			return addedClassMatch
		})
	}
	return html
}

/**
 * Wrap html string with tags
 * @param {string} html
 * @param {string} tag - For example, div, div class="container"
 */
const wrapHtmlWithTag = (html: string, tag: string) => {
	return `<${tag}>${html}</${tag.split(" ")[0]}>`
}

/**
 * Render html to vue
 */
export const renderHtmlToVue = (
	html: string,
	headings: Heading[],
	sideBarConfig: DocSideBarConfig | null,
) => {
	let vue = html

	vue = wrapHtmlWithTag(vue, "div class=\"plog-main-content\"")

	if (sideBarConfig) {
		vue =
      "<DocSideBarContainer :config=\"sideBarConfig\" ></DocSideBarContainer>" +
      vue
	}

	vue += "<DocContentTable :headings=\"headings\"></DocContentTable>"
	vue = wrapHtmlWithTag(vue, "div class=\"plog-doc-container\"")

	vue = wrapHtmlWithTag(vue, "template")

	vue += `
      <script setup lang="ts">

      const headings = ${JSON.stringify(headings)}
      const sideBarConfig = ${JSON.stringify(sideBarConfig)}
      </script>
      `

	return vue
}

/**
 * Copy images referenced in vue to the specified directory, and update the link in vue file.
 */
export const rebaseImageLink = (
	vueString: string,
	markdownFile: string,
	imageDirectory: string
) => {
	return vueString.replaceAll(/<img.*?src="(.*?)".*?\>/gs, (match, p1) => {
		const imageFile = nodePath.resolve(
			nodePath.normalize(nodePath.dirname(markdownFile)),
			p1
		)
		const imageName = nodePath.basename(imageFile)
		const idBuffer = buffer.Buffer.alloc(5)
		crypto.randomFillSync(idBuffer, 0, 5)
		const randomName = idBuffer.toString("hex") + imageName
		const imageDestination = nodePath.join(imageDirectory, randomName)
		fs.copyFileSync(imageFile, imageDestination)

		const index = imageDirectory.search(/assets.*/)
		const prefix = imageDirectory.slice(index).replaceAll(nodePath.sep, "/")
		const stringToReplace = `~/${prefix}/${randomName}`
		return match.replace(p1, stringToReplace)
	})
}

/**
 * renderVueFile
 * @param {string} inputFile - a markdown file.
 * @param {string} imageDirectory - must be a directory under assets, used for storing images in docs.
 */
const renderVueFile = (
	inputFile: string,
	outputDirectory: string,
	imageDirectory: string,
	mappings: Mappings,
	sideBarConfig: DocSideBarConfig | null
) => {
	const md = fs.readFileSync(inputFile).toString()

	const headings: Heading[] = []
	const mdi = MarkdownIt().use(MarkdownItAnchor, {
		callback: (token, info) => {
			const heading = { ...info } as Heading
			heading.tag = token.tag
			headings.push(heading)
		},
	})
	let html = mdi.render(md)
	html = addClasses(html, mappings)

	const vue = renderHtmlToVue(html, headings, sideBarConfig)

	const rebasedVue = rebaseImageLink(vue, inputFile, imageDirectory)

	fs.writeFileSync(
		nodePath.join(
			outputDirectory,
			nodePath.basename(inputFile, nodePath.extname(inputFile)) + ".vue"
		),
		rebasedVue
	)
}

/**
 * get sidebar config for the input node from plog.config
 */
export const getSideBarConfig = (fileSystemNode: FileSystemNode) => {
	const depth1ParentNode = getDepth1ParentNode(fileSystemNode)
	if (!depth1ParentNode) {
		return null
	}
	const sideBarConfig = appConfig.sidebar[depth1ParentNode.getName()]
	return sideBarConfig
}

/**
 * Find the input node's parent node that has a depth of 1.
 * If the input node's depth is 0, return null.
 * If the input node's depth is 1, return the input node.
 */
export const getDepth1ParentNode = (fileSystemNode: FileSystemNode) => {
	if (!fileSystemNode.getParent()) {
		return null
	}

	let currentNode = fileSystemNode
	while (currentNode.getDepth() > 1) {
		const parentNode = currentNode.getParent()
		if (!parentNode) throw `Something wrong with the node ${currentNode}`
		currentNode = parentNode
	}
	return currentNode
}

/**
 * Render a directory of markdown files to .vue files
 * @param {string} markdownDirectory - the directory of markdown files
 * @param {string} outoutDirectory - the output directory that would contain a directory with the same name as the markdown directory except all the files in the output direcotry had been rendered to vue files.
 * @param {string} imageDirectory - must be a directory under assets, used for storing images in docs.
 * @param {Mappings} mappings - html tag to class mapping.
 */
export const render = async (
	markdownDirectory: string,
	outputDirectory: string,
	imageDirectory: string,
	mappings: Mappings
) => {
	const markdownDirectoryName = nodePath.basename(markdownDirectory)
	const markdownDirectoryParent = nodePath.dirname(markdownDirectory)

	const markdownDirectoryNode = await buildFileSystemTree(
		markdownDirectoryParent,
		markdownDirectoryName
	)

	if (fs.existsSync(imageDirectory)) {
		fs.rmSync(imageDirectory, { recursive: true })
	}
	fs.mkdirSync(imageDirectory)

	for (const childNode of markdownDirectoryNode) {
		if ("children" in childNode) {
			// check if directory node
			const outputPath = nodePath.join(outputDirectory, childNode.getPath())
			if (fs.existsSync(outputPath)) {
				fs.rmSync(outputPath, { recursive: true })
				fs.mkdirSync(outputPath)
			} else {
				fs.mkdirSync(outputPath)
			}
			console.log(`Making directory: ${childNode.getName()}`)
		} else if (childNode.getExtension() === ".md") {
			// check if markdown file
			const childNodePath = nodePath.join(
				markdownDirectoryParent,
				childNode.getPath()
			)
			const sideBarConfig = getSideBarConfig(childNode)
			const parentNode = childNode.getParent()
			const outputPath = parentNode
				? nodePath.join(outputDirectory, parentNode.getPath())
				: outputDirectory
			renderVueFile(
				childNodePath,
				outputPath,
				imageDirectory,
				mappings,
				sideBarConfig
			)
			console.log(`Rendering markdown file: ${childNode.getName()}`)
		}
	}
}
