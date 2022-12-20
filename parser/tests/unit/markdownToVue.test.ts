import { addClasses, render } from "../../markdownToVue";
import { describe, expect, test } from "vitest";
import { tmpdir } from "node:os";
import * as fs from "node:fs";
import * as path from "node:path";

export type DirectryContent = (string | DirectoryStructure)[];

export interface DirectoryStructure {
  [index: string]: DirectryContent;
}

const createTemporaryDirectory = () => {
  const temporaryDirectory = fs.mkdtempSync(path.join(tmpdir(), "plog-"));

  const removeTemporaryDirectory = () => {
    fs.rmSync(temporaryDirectory, { recursive: true });
  };

  return {
    temporaryDirectory,
    removeTemporaryDirectory,
  };
};

const createFilesAndDirectories = (
  parentDirectory: string,
  FilesAndDirectories: DirectryContent
) => {
  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory);
  }

  FilesAndDirectories.forEach((element) => {
    if (typeof element === "string") {
      fs.writeFileSync(path.join(parentDirectory, element), "");
    } else {
      const key = Object.keys(element)[0];
      createFilesAndDirectories(path.join(parentDirectory, key), element[key]);
    }
  });
};

const createFilesAndDirectoriesInTemporaryDirectory = (
  FilesAndDirectories: DirectryContent
) => {
  const { temporaryDirectory, removeTemporaryDirectory } =
    createTemporaryDirectory();

  createFilesAndDirectories(temporaryDirectory, FilesAndDirectories)

  return { temporaryDirectory,removeTemporaryDirectory}
};

/**
 * get all file paths in a directory.
 * @param {string} directory
 * @return {DirectryContent}
 */
export const getDirectoryContent = async (directory: string) => {
  const directoyrContent: DirectryContent = [];
  const directoryHandle = fs.opendirSync(directory);
  for await (const dirent of directoryHandle) {
    if (dirent.isFile()) {
      directoyrContent.push(dirent.name);
    } else if (dirent.isDirectory()) {
      const content = await getDirectoryContent(path.join(directory, dirent.name));
      if (content)
        directoyrContent.push({
          [dirent.name]: content,
        });
    }
  }
  return directoyrContent;
};

/**
 * Partition on html string:
 *  html string is empty
 *  html string is not empty
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
    const res = addClasses(html, mappings);
    expect(res).toBe(html);
  });

  test("Cover html string is not empty and m0 < the number of mappings <= the number of tags in html string", () => {
    const html = "<h1>I am Title</h1><h2>subtitle</h2>";
    const mappings = {
      h1: "head1",
      h2: "head2",
    };
    const res = addClasses(html, mappings);
    expect(res).toEqual(
      '<h1 class="head1">I am Title</h1><h2 class="head2">subtitle</h2>'
    );
  });

  test("Cover html string is not empty and the number of mappings > the number of tags in html string", () => {
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

  test("throw error if mapping's value contains \"", () => {
    const html = "<h1>I am Title</h1><h2>subtitle</h2>";
    const mappings = {
      h1: 'head1"',
    };
    expect(() => addClasses(html, mappings)).toThrowError();
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
    const {temporaryDirectory: docsDirectory, removeTemporaryDirectory: removeDocsDirectory} = createTemporaryDirectory()
    const {temporaryDirectory: outputDirectory, removeTemporaryDirectory: removeOutputDocsDirectory} = createTemporaryDirectory()
    const mappings = {
      h1: "head1",
      h2: "head2",
      p: "paragraph",
    };

    await render(docsDirectory, outputDirectory,  mappings);
    const outputDirectoryContent = await getDirectoryContent(outputDirectory);
    expect(outputDirectoryContent.length).toBe(0);

    removeDocsDirectory()
    removeOutputDocsDirectory()
  });
  test("Cover The directory contains files and more than one type of files.", async () => {
    const docsDirectoryContent = ["file1.md", "file2.md", "file3"];
    const {temporaryDirectory: docsDirectory, removeTemporaryDirectory: removeDocsDirectory} = createFilesAndDirectoriesInTemporaryDirectory(docsDirectoryContent)
    const {temporaryDirectory: outputDirectory, removeTemporaryDirectory: removeOutputDocsDirectory} = createTemporaryDirectory()
    const mappings = {
      h1: "head1",
      h2: "head2",
      p: "paragraph",
    };

    await render(docsDirectory, outputDirectory,  mappings);
    const outputDirectoryContent = await getDirectoryContent(outputDirectory);
    expect(outputDirectoryContent).toStrictEqual(["file1.vue", "file2.vue"]);

    removeDocsDirectory()
    removeOutputDocsDirectory()
  });
  test("Cover The directory contains directries and one type of files", async () => {
    const docsDirectoryContent = [
      {
        dir1: ["file1.md", "file2.md"],
      },
      "file3.md",
      "file4.md",
    ];
     const {temporaryDirectory: docsDirectory, removeTemporaryDirectory: removeDocsDirectory} = createFilesAndDirectoriesInTemporaryDirectory(docsDirectoryContent)
    const {temporaryDirectory: outputDirectory, removeTemporaryDirectory: removeOutputDocsDirectory} = createTemporaryDirectory()
    const mappings = {
      h1: "head1",
      h2: "head2",
      p: "paragraph",
    };

    await render(docsDirectory, outputDirectory,  mappings);
    const outputDirectoryContent = await getDirectoryContent(outputDirectory);
    expect(outputDirectoryContent).toStrictEqual([{
      dir1: ["file1.vue", "file2.vue"]
    },"file3.vue", "file4.vue"]);

    removeDocsDirectory()
    removeOutputDocsDirectory()
  });
});
