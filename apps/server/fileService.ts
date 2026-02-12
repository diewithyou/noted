import { readdir, stat, readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import type { FileNode } from "./types.js";

export async function getDirectoryTree(
    dirPath: string,
    ignoreList: string[] = ["node_modules", ".git", ".yarn"],
): Promise<FileNode | null> {
    const name = basename(dirPath);

    if (ignoreList.includes(name)) return null;

    try {
        const stats = await stat(dirPath);
        const info: FileNode = { name, path: dirPath, type: "file" };

        if (stats.isDirectory()) {
            info.type = "directory";
            const files = await readdir(dirPath);
            const children = await Promise.all(
                files.map((file) =>
                    getDirectoryTree(join(dirPath, file), ignoreList),
                ),
            );
            info.children = children.filter(
                (child): child is FileNode => child !== null,
            );
        } else {
            info.size = stats.size;
        }
        return info;
    } catch (err) {
        return null;
    }
}

export async function getFileContent(filePath: string): Promise<string> {
    return await readFile(filePath, "utf-8");
}
