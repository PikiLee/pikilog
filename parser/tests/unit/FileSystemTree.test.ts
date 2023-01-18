import { createTemporaryDirectory } from "./../testUtils"
import { buildFileSystemTree, File, Directory } from "./../../FileSystemTree"
import { describe, test, expect } from "vitest"
import { createFilesAndDirectoriesInTemporaryDirectory } from "../testUtils"
import * as nodePath from "node:path"

/**
 * parition:
 *  the target is a file
 *  the target is a directory and is empty
 *  the target is a directory and is not empty
 */
describe("test build a file system tree.", () => {
	test("Cover the target is a file", async () => {
		const filename = "file1.md"
		const docsDirectoryContent = [filename]
		const {
			temporaryDirectory: docsDirectory,
			removeTemporaryDirectory: removeDocsDirectory,
		} = createFilesAndDirectoriesInTemporaryDirectory(docsDirectoryContent)

		try {
			const fileNode = await buildFileSystemTree(docsDirectory, filename)
			expect(fileNode.getName()).toBe(filename)
			expect(fileNode).toBeInstanceOf(File)
		} finally {
			removeDocsDirectory()
		}
	})

	test("Cover the target is a directory and is empty", async () => {
		const {
			temporaryDirectory: docsDirectory,
			removeTemporaryDirectory: removeDocsDirectory,
		} = createTemporaryDirectory()

		try {
			const directoryName = nodePath.basename(docsDirectory)
			const directoryNode = await buildFileSystemTree(
				nodePath.dirname(docsDirectory),
				directoryName
			)
			expect(directoryNode.getName()).toBe(directoryName)
			expect(directoryNode).toBeInstanceOf(Directory)
		} finally {
			removeDocsDirectory()
		}
	})

	test("Cover the target is a directory and is not empty", async () => {
		const file1 = "file1.md"
		const file4 = "file4.png"
		const docsDirectoryContent = [
			file1,
			"file2.jpg",
			{ dir1: ["file3.md", file4] },
		]
		const {
			temporaryDirectory: docsDirectory,
			removeTemporaryDirectory: removeDocsDirectory,
		} = createFilesAndDirectoriesInTemporaryDirectory(docsDirectoryContent)

		try {
			const directoryName = nodePath.basename(docsDirectory)
			const directoryNode = await buildFileSystemTree(
				nodePath.dirname(docsDirectory),
				directoryName
			)
			expect(directoryNode.getName()).toBe(directoryName)
			expect(directoryNode).toBeInstanceOf(Directory)
			expect((directoryNode as Directory).getChild(file1)?.getName()).toBe(
				file1
			)

			const dir1 = (directoryNode as Directory).getChild("dir1")
			expect((dir1 as Directory).getChild(file4)?.getName()).toBe(file4)
		} finally {
			removeDocsDirectory()
		}
	})
})
