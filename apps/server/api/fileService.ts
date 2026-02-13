import {
    readdir,
    stat,
    readFile,
    writeFile,
    rename,
    rm,
    mkdir,
} from "node:fs/promises";
import { join, basename } from "node:path";
import type { FileNode } from "./types.ts";

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

export async function saveFileContent(
    filePath: string,
    content: string,
): Promise<void> {
    await writeFile(filePath, content, "utf-8");
}

export async function moveOrRename(
    oldPath: string,
    newPath: string,
): Promise<void> {
    await rename(oldPath, newPath);
}

export async function deleteItem(path: string): Promise<void> {
    await rm(path, { recursive: true, force: true });
}

export async function createNewFile(filePath: string): Promise<void> {
    await writeFile(filePath, "", { flag: "wx" });
}

export async function createNewDirectory(dirPath: string): Promise<void> {
    await mkdir(dirPath, { recursive: true });
}
