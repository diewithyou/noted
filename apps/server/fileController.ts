import type { Request, Response } from "express";
import * as fileService from "./fileService.js";
import { resolve } from "node:path";

const ROOT_DIR = resolve("/config");

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

    const absolutePath = resolve(filePath);
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
