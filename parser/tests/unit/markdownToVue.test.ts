import { renderHtmlToVue } from "./../../markdownToVue";
import { addClasses, render } from "../../markdownToVue";
import { describe, expect, test } from "vitest";
import {
  createTemporaryDirectory,
  createFilesAndDirectoriesInTemporaryDirectory,
  getDirectoryContent,
} from "../testUtils";

/**
 * Partition on html string:
 *  html string is empty
 *  html string is not empty and has no class
 *  html string is not empty and has class
 *
 * Partition on mappings:
 *  mappings is empty
 *  0 < the number of mappings <= the number of tags in html string
 * the number of mappings > the number of tags in html string
 *
 */
describe("test add class to html string", () => {
  test("Cover html string is empty and mappings is empty", () => {
    const html = "";
    const mappings = {};
    const result = addClasses(html, mappings);
    expect(result).toBe(html);
  });

  test("Cover html string is not empty and has class and 0 < the number of mappings <= the number of tags in html string", () => {
    const html = `<h1 class="title">I am Title</h1><h2>subtitle</h2>`;
    const mappings = {
      h1: "head1",
      h2: "head2",
    };
    const res = addClasses(html, mappings);
    expect(res).toEqual(
      '<h1 class="head1 title">I am Title</h1><h2 class="head2">subtitle</h2>'
    );
  });

  test("Cover html string is not empty and has no class and the number of mappings > the number of tags in html string", () => {
    const html = "<h1>I am Title</h1><h2>subtitle</h2>";
    const mappings = {
      h1: "head1",
      h2: "head2",
      p: "paragraph",
    };
    const res = addClasses(html, mappings);
    expect(res).toEqual(
      '<h1 class="head1">I am Title</h1><h2 class="head2">subtitle</h2>'
    );
  });
});

/**
 * partition on html:
 *  html string is empty
 *  html string is not empty
 *
 * partition on headings:
 *  headings is empty
 *  headings is not empty
 *
 * partition on sideBarConfig:
 *  no sideBarConfig
 *  has sideBarConfig
 */
describe("test render html to vue.", () => {
  test("Cover html string, headings is empty, no sideBarConfig", () => {
    const html = "";
    const vue = renderHtmlToVue(html, []);
    expect(vue).toMatch(
      /^<template>.*<DocContentTable :headings="headings"><\/DocContentTable>.*<\/template>\s*<script setup lang="ts">.*<\/script>\s*$/s
    );
  });

  test("Cover html string, headings is not empty, has sideBarConfig", () => {
    const html = "<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading3</h3>";
    const sideBarConfig = [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "Part1", link: "/guide/part1" },
        ],
      },
    ];
    const vue = renderHtmlToVue(html, [], sideBarConfig);
    expect(vue).toMatch(
      /^<template>.*<DocSideBar :config="sideBarConfig" ><\/DocSideBar>.*<DocContentTable :headings="headings"><\/DocContentTable>.*<\/template>\s*<script setup lang="ts">.*<\/script>\s*$/s
    );
  });
});

/**
 * parition:
 *  The directory is empty
 *  The directory contains files
 *  The directory contains directries
 *
 * partition:
 *  The directory contains one type of files.
 *  The directory contains more than one type of files
 */
describe("Test render a directory of markdown files to .vue files", () => {
  test("Cover the directroy is empty", async () => {
    const {
      temporaryDirectory: docsDirectory,
      removeTemporaryDirectory: removeDocsDirectory,
    } = createTemporaryDirectory();
    const {
      temporaryDirectory: outputDirectory,
      removeTemporaryDirectory: removeOutputDocsDirectory,
    } = createTemporaryDirectory();
    const mappings = {
      h1: "head1",
      h2: "head2",
      p: "paragraph",
    };

    await render(docsDirectory, outputDirectory, mappings);
    const outputDirectoryContent = await getDirectoryContent(outputDirectory);
    expect(outputDirectoryContent.length).toBe(0);

    removeDocsDirectory();
    removeOutputDocsDirectory();
  });
  test("Cover The directory contains files and more than one type of files.", async () => {
    const docsDirectoryContent = ["file1.md", "file2.md", "file3"];
    const {
      temporaryDirectory: docsDirectory,
      removeTemporaryDirectory: removeDocsDirectory,
    } = createFilesAndDirectoriesInTemporaryDirectory(docsDirectoryContent);
    const {
      temporaryDirectory: outputDirectory,
      removeTemporaryDirectory: removeOutputDocsDirectory,
    } = createTemporaryDirectory();
    const mappings = {
      h1: "head1",
      h2: "head2",
      p: "paragraph",
    };

    await render(docsDirectory, outputDirectory, mappings);
    const outputDirectoryContent = await getDirectoryContent(outputDirectory);
    expect(outputDirectoryContent).toStrictEqual(["file1.vue", "file2.vue"]);

    removeDocsDirectory();
    removeOutputDocsDirectory();
  });
  test("Cover The directory contains directries and one type of files", async () => {
    const docsDirectoryContent = [
      {
        dir1: ["file1.md", "file2.md"],
      },
      "file3.md",
      "file4.md",
    ];
    const {
      temporaryDirectory: docsDirectory,
      removeTemporaryDirectory: removeDocsDirectory,
    } = createFilesAndDirectoriesInTemporaryDirectory(docsDirectoryContent);
    const {
      temporaryDirectory: outputDirectory,
      removeTemporaryDirectory: removeOutputDocsDirectory,
    } = createTemporaryDirectory();
    const mappings = {
      h1: "head1",
      h2: "head2",
      p: "paragraph",
    };

    await render(docsDirectory, outputDirectory, mappings);
    const outputDirectoryContent = await getDirectoryContent(outputDirectory);
    expect(outputDirectoryContent).toStrictEqual([
      {
        dir1: ["file1.vue", "file2.vue"],
      },
      "file3.vue",
      "file4.vue",
    ]);

    removeDocsDirectory();
    removeOutputDocsDirectory();
  });
});
