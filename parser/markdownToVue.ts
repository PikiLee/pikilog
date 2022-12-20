import * as fs from "node:fs";
import * as path from "node:path";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor"

interface Mappings {
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
  for (let key in mappings) {
    if (mappings[key].includes('"')) throw "mapping'value can not inclue \"";
    html = html.replace(`<${key}`, `<${key} class="${mappings[key]}"`);
  }
  return html;
};

/**
 * Render a directory of markdown files to .vue files
 * @param {string} markdownDirectory - the directory of markdown files
 * @param {string} outoutDirectory - the output directory that would contains the vue file rendered from the content of the input directory.
 */
export const render = async (
  markdownDirectory: string,
  outputDirectory: string,
  mappings: Mappings
) => {
  const markdownDirectoryHandle = fs.opendirSync(markdownDirectory);

  if (fs.existsSync(outputDirectory)) {
    fs.rmSync(outputDirectory, {
      recursive: true,
    });
  }
  fs.mkdirSync(outputDirectory);

  for await (let element of markdownDirectoryHandle) {
    if (element.isFile() && path.extname(element.name) === ".md") {
      const file = path.join(markdownDirectory, element.name);
      const md = fs.readFileSync(file).toString();

      const mdi = MarkdownIt().use(MarkdownItAnchor, {
        callback: (token, info) => {
          console.log(token)
          console.log(info)
        }
      });
      let html = mdi.render(md);
      html = addClasses(html, mappings);

      fs.writeFileSync(
        path.join(
          outputDirectory,
          path.basename(element.name, path.extname(element.name)) + ".vue"
        ),
        `<template>\n${html}</template>\n`
      );
    } else if (element.isDirectory()) {
      await render(
        path.join(markdownDirectory, element.name),
        path.join(outputDirectory, element.name),
        mappings
      );
    }
  }
};

const mappings = {
  h1: "head1",
  h2: "head2",
};

const docsDirectory = "./docs";
const outputDirectory = './pages/docs'
render(docsDirectory, outputDirectory, mappings);
fs.watch(docsDirectory, () => {
  render(docsDirectory, outputDirectory, mappings);
});
