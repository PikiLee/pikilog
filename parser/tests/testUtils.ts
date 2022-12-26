import { tmpdir } from "node:os";
import * as fs from "node:fs";
import * as path from "node:path";

export type DirectoryContent = (string | DirectoryStructure)[];

export interface DirectoryStructure {
  [index: string]: DirectoryContent;
}

export const createTemporaryDirectory = () => {
  const temporaryDirectory = fs.mkdtempSync(path.join(tmpdir(), "plog-"));

  const removeTemporaryDirectory = () => {
    fs.rmSync(temporaryDirectory, { recursive: true });
  };

  return {
    temporaryDirectory,
    removeTemporaryDirectory,
  };
};

export const createFilesAndDirectories = (
  parentDirectory: string,
  FilesAndDirectories: DirectoryContent
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

export const createFilesAndDirectoriesInTemporaryDirectory = (
  FilesAndDirectories: DirectoryContent
) => {
  const { temporaryDirectory, removeTemporaryDirectory } =
    createTemporaryDirectory();

  createFilesAndDirectories(temporaryDirectory, FilesAndDirectories);

  return { temporaryDirectory, removeTemporaryDirectory };
};

/**
 * get all file paths in a directory.
 * @param {string} directory
 * @return {DirectoryContent}
 */
export const getDirectoryContent = async (directory: string) => {
  const directoyrContent: DirectoryContent = [];
  const directoryHandle = fs.opendirSync(directory);
  for await (const dirent of directoryHandle) {
    if (dirent.isFile()) {
      directoyrContent.push(dirent.name);
    } else if (dirent.isDirectory()) {
      const content = await getDirectoryContent(
        path.join(directory, dirent.name)
      );
      if (content)
        directoyrContent.push({
          [dirent.name]: content,
        });
    }
  }
  return directoyrContent;
};
