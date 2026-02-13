import type { Request, Response } from "express";
import * as fileService from "./fileService.js";
import { join, resolve } from "node:path";

const ROOT_DIR = resolve("/test");

export const getTree = async (_req: Request, res: Response) => {
    try {
        const tree = await fileService.getDirectoryTree(ROOT_DIR);
        res.json(tree);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const readFileContent = async (req: Request, res: Response) => {
    const { filePath } = req.body;

    if (!filePath) {
        return res
            .status(400)
            .json({ error: "Path is required in request body" });
    }

    const absolutePath = resolve(join(ROOT_DIR, filePath));
    if (!absolutePath.startsWith(ROOT_DIR)) {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const content = await fileService.getFileContent(absolutePath);
        res.json({ content, path: absolutePath });
    } catch (error) {
        res.status(500).json({ error: "Could not read file" });
    }
};

export const updateFileContent = async (req: Request, res: Response) => {
    const { filePath, content } = req.body;

    if (!filePath || content === undefined) {
        return res
            .status(400)
            .json({ error: "FilePath and content are required" });
    }

    const absolutePath = resolve(join(ROOT_DIR, filePath));
    if (!absolutePath.startsWith(ROOT_DIR)) {
        return res
            .status(403)
            .json({ error: "Access denied: Out of workspace" });
    }

    try {
        await fileService.saveFileContent(absolutePath, content);
        res.json({ success: true, message: "File saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not save file" });
    }
};

export const moveItem = async (req: Request, res: Response) => {
    const { oldPath, newPath } = req.body;

    if (!oldPath || !newPath) {
        return res
            .status(400)
            .json({ error: "Both oldPath and newPath are required" });
    }

    const absOld = resolve(join(ROOT_DIR, oldPath));
    const absNew = resolve(join(ROOT_DIR, newPath));

    if (!absOld.startsWith(ROOT_DIR) || !absNew.startsWith(ROOT_DIR)) {
        return res
            .status(403)
            .json({ error: "Access denied: Path outside of workspace" });
    }

    try {
        await fileService.moveOrRename(absOld, absNew);
        res.json({ success: true, message: "Item moved/renamed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not move or rename item" });
    }
};

export const removeItem = async (req: Request, res: Response) => {
    const { path } = req.body;

    if (!path) {
        return res.status(400).json({ error: "Path is required" });
    }

    const absolutePath = resolve(join(ROOT_DIR, path));
    if (!absolutePath.startsWith(ROOT_DIR)) {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        await fileService.deleteItem(absolutePath);
        res.json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete item" });
    }
};

export const createFile = async (req: Request, res: Response) => {
    const { filePath } = req.body;

    if (!filePath) return res.status(400).json({ error: "Path is required" });

    const absolutePath = resolve(join(ROOT_DIR, filePath));
    if (!absolutePath.startsWith(ROOT_DIR))
        return res.status(403).json({ error: "Access denied" });

    try {
        await fileService.createNewFile(absolutePath);
        res.json({ success: true, message: "File created successfully" });
    } catch (error: any) {
        const msg =
            error.code === "EEXIST"
                ? "File already exists"
                : "Could not create file";
        res.status(500).json({ error: msg });
    }
};

export const createDirectory = async (req: Request, res: Response) => {
    const { dirPath } = req.body;

    if (!dirPath)
        return res.status(400).json({ error: "Directory path is required" });

    const absolutePath = resolve(join(ROOT_DIR, dirPath));
    if (!absolutePath.startsWith(ROOT_DIR))
        return res.status(403).json({ error: "Access denied" });

    try {
        await fileService.createNewDirectory(absolutePath);
        res.json({ success: true, message: "Directory created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not create directory" });
    }
};
