import type { Heading, DocSideBarConfig } from "./../types/doc";
import * as fs from "node:fs";
import * as path from "node:path";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import appConfig from "../plog.config";

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
  for (let key in mappings) {
    if (mappings[key].includes('"')) throw "mapping'value can not inclue \"";
    html = html.replace(`<${key}`, `<${key} class="${mappings[key]}"`);
  }
  return html;
};

/**
 * Wrap html string with tags
 * @param {string} html
 * @param {string} tag - For example, div, div class="container"
 */
const wrapHtmlWithTag = (html: string, tag: string) => {
  return `<${tag}>${html}</${tag.split(" ")[0]}>`;
};

/**
 * Render html to vue
 * @param {string} html
 * @param {Heading[]} headings
 * @param {DocSideBarConfig} sideBarConfig
 */
export const renderHtmlToVue = (
  html: string,
  headings: Heading[],
  sideBarConfig?: DocSideBarConfig
) => {
  let vue = wrapHtmlWithTag(html, `div class="plog-main-content"`);

  if (sideBarConfig) {
    vue = `<DocSideBar :config="sideBarConfig" ></DocSideBar>` + vue;
  }

  vue += `<DocContentTable :headings="headings"></DocContentTable>`;
  vue = wrapHtmlWithTag(vue, 'div class="plog-doc-container"');

  vue = wrapHtmlWithTag(vue, "template");

  vue += `
      <script setup lang="ts">

      const headings = ${JSON.stringify(headings)}
      const sideBarConfig = ${JSON.stringify(sideBarConfig)}
      </script>
      `;

  return vue;
};

/**
 * Render a directory of markdown files to .vue files
 * @param {string} markdownDirectory - the directory of markdown files
 * @param {string} outoutDirectory - the output directory that would contains the vue file rendered from the content of the input directory.
 * @param {Mappings} mappings - html tag to class mapping.
 * @param {DocSideBarConfig} sideBarConfig - optional, if not passed, it will find the sideBarConfig of the current markdown directory from plog.config.ts
 */
export const render = async (
  markdownDirectory: string,
  outputDirectory: string,
  mappings: Mappings,
  sideBarConfig?: DocSideBarConfig
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

      const headings: Heading[] = [];
      const mdi = MarkdownIt().use(MarkdownItAnchor, {
        callback: (token, info) => {
          const heading = { ...info } as Heading;
          heading.tag = token.tag;
          headings.push(heading);
        },
      });
      let html = mdi.render(md);
      html = addClasses(html, mappings);

      const vue = renderHtmlToVue(html, headings, sideBarConfig);

      fs.writeFileSync(
        path.join(
          outputDirectory,
          path.basename(element.name, path.extname(element.name)) + ".vue"
        ),
        vue
      );
    } else if (element.isDirectory()) {
      if (!sideBarConfig) {
        sideBarConfig =
          appConfig.sideBar[element.name as keyof typeof appConfig.sideBar];
      }

      await render(
        path.join(markdownDirectory, element.name),
        path.join(outputDirectory, element.name),
        mappings,
        sideBarConfig
      );
    }
  }
};
