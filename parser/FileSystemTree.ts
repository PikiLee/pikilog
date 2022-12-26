import * as nodePath from "node:path";
import * as fs from "node:fs";

export type FileSystemNode = FileInterface | DirectoryInterface;
export type NullableFileSystemNode = FileSystemNode | null | undefined;

// export interface FileSystemTreeInterface {
//   root: FileSystemNode;
//   getRootNode(): FileSystemNode;
//   setRootNode(node: FileSystemNode): void;
//   tracerse(): Iterable<FileSystemNode>;
// }

export interface FileInterface {
  name: string;
  parent: NullableFileSystemNode;
  setName(name: string): void;
  getName(): string;
  setParent(parent: FileSystemNode): void;
  getParent(): NullableFileSystemNode;
  getExtension(): string;
  traverse(): Iterable<FileInterface>;
}

export interface DirectoryInterface extends FileInterface {
  children: FileSystemNode[];
  addChild(childNode: FileSystemNode): void;
  getChild(name: string): NullableFileSystemNode;
  removeChild(name: string): void;
  traverse(): Iterable<FileSystemNode>;
}

export class File implements FileInterface {
  name = "";
  parent: NullableFileSystemNode = null;
  constructor(name: string) {
    this.name = name;
    return this;
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setParent(parent: FileSystemNode): void {
    this.parent = parent;
  }

  getParent(): NullableFileSystemNode {
    return this.parent;
  }

  getExtension(): string {
    return nodePath.extname(this.name);
  }
  *traverse(): Iterable<FileInterface> {
    yield this;
  }
}

export class Directory extends File implements DirectoryInterface {
  children: (FileInterface | DirectoryInterface)[] = [];
  addChild(childNode: FileSystemNode): void {
    childNode.setParent(this);
    this.children.push(childNode);
  }

  getChild(name: string): NullableFileSystemNode {
    return this.children.find((child) => child.getName() === name);
  }

  removeChild(name: string): void {
    this.children = this.children.filter((child) => child.getName() !== name);
  }

  *traverse(): Iterable<FileSystemNode> {
    yield this;
    for (let child of this.children) {
      for (let node of child.traverse()) {
        yield node;
      }
    }
  }
}

/**
 * Build FileSystemTree From
 * @param {string} parentDirectory - the parent directory of the target
 * @param {string} name - the name of the target
 */
export const buildFileSystemTree = async (
  parentDirectory: string,
  name: string
) => {
  let fileSystemTree: FileSystemNode;

  const path = nodePath.join(parentDirectory, name);
  const isFile = fs.statSync(path).isFile();
  if (isFile) {
    fileSystemTree = new File(name);
  } else {
    const directory = fs.opendirSync(path);
    const directoryNode = new Directory(name);

    for await (const content of directory) {
      let child: FileSystemNode;
      if (!content.isDirectory()) {
        child = new File(content.name);
      } else {
        child = await buildFileSystemTree(path, content.name);
      }
      directoryNode.addChild(child);
    }

    fileSystemTree = directoryNode;
  }
  return fileSystemTree;
};
