import { join, resolve } from "node:path";

import type {
    CreateDirectoryRequest,
    CreateDirectoryResponse,
    CreateFileRequest,
    CreateFileResponse,
    GetDirectoryTreeResponse,
    MoveItemRequest,
    MoveItemResponse,
    ReadFileContentRequest,
    ReadFileContentResponse,
    RemoveItemRequest,
    RemoveItemResponse,
    UpdateFileContentRequest,
    UpdateFileContentResponse,
} from "@noted/types";
import type { Request, Response } from "express";

import * as fileService from "./fileService.js";

const ROOT_DIR = resolve("/test");

export const getTree = async (
    _req: Request,
    res: Response<GetDirectoryTreeResponse>,
) => {
    try {
        const tree = await fileService.getSortedDirectoryStructure(
            ROOT_DIR,
            ROOT_DIR,
        );
        res.json({
            tree,
            status: { success: true },
        } as GetDirectoryTreeResponse);
    } catch {
        res.status(500).json({
            status: { success: false, error: "Internal Server Error" },
        });
    }
};

export const readFileContent = async (
    req: Request<unknown, unknown, ReadFileContentRequest>,
    res: Response<ReadFileContentResponse>,
) => {
    const { filePath } = req.body;

    if (!filePath) {
        return res.status(400).json({
            status: {
                success: false,
                error: "Path is required in request body",
            },
        });
    }

    const absolutePath = resolve(join(ROOT_DIR, filePath));
    if (!absolutePath.startsWith(ROOT_DIR)) {
        return res
            .status(403)
            .json({ status: { success: false, error: "Access denied" } });
    }

    try {
        const content = await fileService.getFileContent(absolutePath);
        res.json({
            content,
            path: absolutePath,
        } as ReadFileContentResponse);
    } catch {
        res.status(500).json({
            status: { success: false, error: "Could not read file" },
        });
    }
};

export const updateFileContent = async (
    req: Request<unknown, unknown, UpdateFileContentRequest>,
    res: Response<UpdateFileContentResponse>,
) => {
    const { filePath, content } = req.body;

    if (!filePath || content === undefined) {
        return res.status(400).json({
            status: {
                success: false,
                error: "FilePath and content are required",
            },
        });
    }

    const absolutePath = resolve(join(ROOT_DIR, filePath));
    if (!absolutePath.startsWith(ROOT_DIR)) {
        return res.status(403).json({
            status: {
                success: false,
                error: "Access denied: Out of workspace",
            },
        });
    }

    try {
        await fileService.writeFileContent(absolutePath, content);
        res.json({ status: { success: true } });
    } catch {
        res.status(500).json({
            status: { success: false, error: "Could not save file" },
        });
    }
};

export const moveItem = async (
    req: Request<unknown, unknown, MoveItemRequest>,
    res: Response<MoveItemResponse>,
) => {
    const { oldPath, newPath } = req.body;

    if (!oldPath || !newPath) {
        return res.status(400).json({
            status: {
                success: false,
                error: "Both oldPath and newPath are required",
            },
        });
    }

    const absOld = resolve(join(ROOT_DIR, oldPath));
    const absNew = resolve(join(ROOT_DIR, newPath));

    if (!absOld.startsWith(ROOT_DIR) || !absNew.startsWith(ROOT_DIR)) {
        return res.status(403).json({
            status: {
                success: false,
                error: "Access denied: Path outside of workspace",
            },
        });
    }

    try {
        await fileService.moveOrRename(absOld, absNew);
        res.json({ status: { success: true } });
    } catch {
        res.status(500).json({
            status: { success: false, error: "Could not move or rename item" },
        });
    }
};

export const removeItem = async (
    req: Request<unknown, unknown, RemoveItemRequest>,
    res: Response<RemoveItemResponse>,
) => {
    const { path } = req.body;

    if (!path) {
        return res
            .status(400)
            .json({ status: { success: false, error: "Path is required" } });
    }

    const absolutePath = resolve(join(ROOT_DIR, path));
    if (!absolutePath.startsWith(ROOT_DIR)) {
        return res
            .status(403)
            .json({ status: { success: false, error: "Access denied" } });
    }

    try {
        await fileService.deleteItem(absolutePath);
        res.json({ status: { success: true } });
    } catch {
        res.status(500).json({
            status: { success: false, error: "Could not delete item" },
        });
    }
};

export const createFile = async (
    req: Request<unknown, unknown, CreateFileRequest>,
    res: Response<CreateFileResponse>,
) => {
    const { filePath } = req.body;

    if (!filePath)
        return res
            .status(400)
            .json({ status: { success: false, error: "Path is required" } });

    const absolutePath = resolve(join(ROOT_DIR, filePath));
    if (!absolutePath.startsWith(ROOT_DIR))
        return res
            .status(403)
            .json({ status: { success: false, error: "Access denied" } });

    try {
        await fileService.createNewFile(absolutePath);
        res.json({ status: { success: true } });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const msg =
            error.code === "EEXIST"
                ? "File already exists"
                : "Could not create file";
        res.status(500).json({ status: { success: false, error: msg } });
    }
};

export const createDirectory = async (
    req: Request<unknown, unknown, CreateDirectoryRequest>,
    res: Response<CreateDirectoryResponse>,
) => {
    const { dirPath } = req.body;

    if (!dirPath)
        return res.status(400).json({
            status: { success: false, error: "Directory path is required" },
        });

    const absolutePath = resolve(join(ROOT_DIR, dirPath));
    if (!absolutePath.startsWith(ROOT_DIR))
        return res
            .status(403)
            .json({ status: { success: false, error: "Access denied" } });

    try {
        await fileService.createNewDirectory(absolutePath);
        res.json({ status: { success: true } });
    } catch {
        res.status(500).json({
            status: { success: false, error: "Could not create directory" },
        });
    }
};
