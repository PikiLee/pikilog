import * as markdownToVue from "./markdownToVue"
import * as fs from "node:fs"
import * as process from "node:process"
import minimist from "minimist"
import pc from "picocolors"

const mappings: markdownToVue.Mappings = {
	h1: "heading1",
	h2: "heading2",
	h3: "heading3",
	h4: "heading4",
	h5: "heading5",
	ul: "unordered-list",
	ol: "ordered-list",
	img: "image",
	a: "link",
	blockquote: "quote",
}
const packageName = "plog"

// add packageName in front of mappings
for (const tag in mappings) {
	mappings[tag] = `${packageName}-${mappings[tag]}`
}

const docsDirectory = "./docs"
const outputDirectory = "./pages"
const imageDirectory = "./assets/images"

const watch = (
	sources: string[],
	callback: () => void,
	immediate = false
) => {
	const cb = () => {
		callback()
		console.log(pc.yellow("Watching for file changes."))
	}
	if (immediate) cb()
	sources.forEach((source) => {
		fs.watch(source, { recursive: true }, () => {
			cb()
		})
	})
}

const renderCallback = async () => {
	if (isRendering) {
		console.log("Is already rendering. Waiting for rerender.")
		setTimeout(renderCallback, 1000)
	} else {
		isRendering = true
		await markdownToVue.render(
			docsDirectory,
			outputDirectory,
			imageDirectory,
			mappings
		)
		isRendering = false
	}
}

let isRendering = false
const argv = minimist(process.argv.slice(2))
console.log(pc.yellow("----------- Parsing Starts -----------"))
if ("w" in argv || "watch" in argv) {
	watch([docsDirectory], renderCallback, true)
} else {
	markdownToVue.render(
		docsDirectory,
		outputDirectory,
		imageDirectory,
		mappings
	)
}
