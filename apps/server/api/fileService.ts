import {
    readdir,
    readFile,
    writeFile,
    rename,
    rm,
    mkdir,
} from "node:fs/promises";
import { join, relative } from "node:path";

import type { DirTree } from "@noted/types";

export async function getDirectoryStructure(
    dirPath: string,
    rootPath: string,
): Promise<DirTree[]> {
    const nodes: DirTree[] = [];

    try {
        const items = await readdir(dirPath, { withFileTypes: true });

        for (const item of items) {
            const fullPath = join(dirPath, item.name);
            const isDirectory = item.isDirectory();
            const relativePath = relative(rootPath, fullPath);

            nodes.push({
                name: item.name,
                path: relativePath,
                type: isDirectory ? "d" : "f",
                children: isDirectory
                    ? await getDirectoryStructure(fullPath, rootPath)
                    : [],
            });
        }
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }

    return nodes;
}

export async function getSortedDirectoryStructure(
    dirPath: string,
    rootPath: string,
): Promise<DirTree[]> {
    try {
        const items = await readdir(dirPath, { withFileTypes: true });

        const sortedItems = items.sort((a, b) => {
            const aDir = a.isDirectory() ? 1 : 0;
            const bDir = b.isDirectory() ? 1 : 0;

            if (aDir !== bDir) {
                return bDir - aDir;
            }

            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        const nodes: DirTree[] = [];

        for (const item of sortedItems) {
            const fullPath = join(dirPath, item.name);
            const relativePath = relative(rootPath, fullPath);
            const isDirectory = item.isDirectory();

            nodes.push({
                name: item.name,
                path: relativePath,
                type: isDirectory ? "d" : "f",
                children: isDirectory
                    ? await getSortedDirectoryStructure(fullPath, rootPath)
                    : [],
            });
        }

        return nodes;
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        return [];
    }
}

export async function getFileContent(filePath: string): Promise<string> {
    return await readFile(filePath, "utf-8");
}

export async function writeFileContent(
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
