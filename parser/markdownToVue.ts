import { buildFileSystemTree, FileSystemNode, File } from "./FileSystemTree";
import type {
  Heading,
  DocSideBarConfigItemList,
  DocSideBarConfigMaps,
  DocSideBarConfig,
} from "./../types/doc";
import * as fs from "node:fs";
import * as path from "node:path";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import appConfig from "../plog.config";
import lodash from "lodash";

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
  for (let tag in mappings) {
    const escapedClass = lodash.escape(mappings[tag]);
    const regex = new RegExp(`<${tag}.*?>`, "gs");

    html = html.replaceAll(regex, (match) => {
      let addedClassMatch = match;
      const classIndex = match.indexOf("class");
      if (classIndex !== -1) {
        const insertClassIndex = 7 + classIndex;
        addedClassMatch = `${match.slice(
          0,
          insertClassIndex
        )}${escapedClass} ${match.slice(insertClassIndex)}`;
      } else {
        const insertClassIndex = 1 + tag.length;
        addedClassMatch = `${match.slice(
          0,
          insertClassIndex
        )} class="${escapedClass}"${match.slice(insertClassIndex)}`;
      }
      return addedClassMatch;
    });
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
 */
export const renderHtmlToVue = (
  html: string,
  headings: Heading[],
  sideBarConfig: DocSideBarConfig | null,
  title: string
) => {
  let vue = `<h1 class="plog-doc-title">${title}</h1>` + html

  vue = wrapHtmlWithTag(vue, `div class="plog-main-content"`);

  if (sideBarConfig) {
    vue = `<DocSideBarContainer :config="sideBarConfig" ></DocSideBarContainer>` + vue;
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
 * renderVueFile
 *
 */
const renderVueFile = (
  inputFile: string,
  outputDirectory: string,
  mappings: Mappings,
  sideBarConfig: DocSideBarConfig | null
) => {
  const md = fs.readFileSync(inputFile).toString();

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

  const title = extractTitleFromFilename(path.basename(inputFile))

  const vue = renderHtmlToVue(html, headings, sideBarConfig, title);

  fs.writeFileSync(
    path.join(
      outputDirectory,
      path.basename(inputFile, path.extname(inputFile)) + ".vue"
    ),
    vue
  );
};

const removeHyphen = (str: string) => {
  return str.replace("-", " ");
};

const removeExtension = (p: string) => {
  return p.replace(path.extname(p), "");
};

const extractLinkFromPath = (p: string) => {
  return "/" + removeExtension(p).replaceAll("\\", "/");
}

const extractTitleFromFilename = (filename: string) => {
  return removeHyphen(removeExtension(filename));
};

const isMarkDownFile = (fileNode: File) => {
  return fileNode.getExtension() === ".md";
};

/**
 * get sidebar config for the input node.
 * If the directory was empty or did not contain any markdown file, the directory itself would not appear in sidebar config.
 */
export const getSideBarConfig = (fileSystemNode: FileSystemNode) => {
  let sideBarConfig: DocSideBarConfig | null = null;
  if ("children" in fileSystemNode) {
    const config = {
      text: extractTitleFromFilename(fileSystemNode.getName()),
      items: [],
    } as DocSideBarConfigItemList;
    fileSystemNode.getChildren().forEach((childNode) => {
      const childNodeConfig = getSideBarConfig(childNode);
      if (childNodeConfig) config.items.push(childNodeConfig);
    });

    if (config.items.length > 0) sideBarConfig = config;
  } else if (isMarkDownFile(fileSystemNode)) {
    const sideBarConfigItem = {
      text: extractTitleFromFilename(fileSystemNode.getName()),
      link: extractLinkFromPath(fileSystemNode.getPath()),
    };
    sideBarConfig = sideBarConfigItem;
  }

  return sideBarConfig;
};

/**
 * Find the input node's parent node that has a depth of 1, then get the parent node's sidebar config.
 */
export const getSideBarConfigBelowDepth1 = (
  fileSystemNode: FileSystemNode,
  sideBarConfigMaps: DocSideBarConfigMaps
) => {
  let sideBarConfig: DocSideBarConfig | null;
  if (!fileSystemNode.getParent()) {
    sideBarConfig = null;
  } else {
    let currentNode = fileSystemNode;
    while (currentNode.getDepth() > 1) {
      const parentNode = currentNode.getParent();
      if (!parentNode) throw `Something wrong with the node ${currentNode}`;
      currentNode = parentNode;
    }

    // check if config is already in sideBarConfigMaps
    sideBarConfig = sideBarConfigMaps.get(currentNode) ?? null;

    if (!sideBarConfig) {
      sideBarConfig = getSideBarConfig(currentNode);
      if (sideBarConfig) sideBarConfigMaps.set(currentNode, sideBarConfig);
    }
  }

  return sideBarConfig;
};

/**
 * Render a directory of markdown files to .vue files
 * @param {string} markdownDirectory - the directory of markdown files
 * @param {string} outoutDirectory - the output directory that would contain a directory with the same name as the markdown directory except all the files in the output direcotry had been rendered to vue files.
 * @param {Mappings} mappings - html tag to class mapping.
 */
export const render = async (
  markdownDirectory: string,
  outputDirectory: string,
  mappings: Mappings
) => {
  const markdownDirectoryName = path.basename(markdownDirectory);
  const markdownDirectoryParent = path.dirname(markdownDirectory);

  const markdownDirectoryNode = await buildFileSystemTree(
    markdownDirectoryParent,
    markdownDirectoryName
  );

  const sideBarConfigMaps = new Map<FileSystemNode, DocSideBarConfig>();

  for (const childNode of markdownDirectoryNode) {
    if ("children" in childNode) {
      // check if directory node
      const outputPath = path.join(outputDirectory, childNode.getPath());
      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true });
        fs.mkdirSync(outputPath);
      } else {
        fs.mkdirSync(outputPath);
      }
      console.log(`Making directory: ${childNode.getName()}`);
    } else if (childNode.getExtension() === ".md") {
      // check if markdown file
      const childNodePath = path.join(
        markdownDirectoryParent,
        childNode.getPath()
      );
      const sideBarConfig = getSideBarConfigBelowDepth1(
        childNode,
        sideBarConfigMaps
      );
      const parentNode = childNode.getParent();
      const outputPath = parentNode
        ? path.join(outputDirectory, parentNode.getPath())
        : outputDirectory;
      renderVueFile(childNodePath, outputPath, mappings, sideBarConfig);
      console.log(`Rendering markdown file: ${childNode.getName()}`);
    }
  }
};
