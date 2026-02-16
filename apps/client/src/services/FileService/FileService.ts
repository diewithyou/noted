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

import { url } from "./FileService.consts";

export const fetchDirTree = async (): Promise<GetDirectoryTreeResponse> => {
    const response = await fetch(`${url}api/files/tree`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.json();
};

export const fetchFile = async (
    request: ReadFileContentRequest,
): Promise<ReadFileContentResponse> => {
    const { filePath } = request;
    const response = await fetch(`${url}api/files/content`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            filePath,
        }),
    });

    return response.json();
};

export const writeFile = async (
    request: UpdateFileContentRequest,
): Promise<UpdateFileContentResponse> => {
    const { content, filePath } = request;
    const response = await fetch(`${url}api/files/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            filePath,
            content,
        }),
    });

    return response.json();
};

export const createFile = async (
    request: CreateFileRequest,
): Promise<CreateFileResponse> => {
    const { filePath } = request;
    const response = await fetch(`${url}api/files/createFile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            filePath,
        }),
    });

    return response.json();
};

export const createDir = async (
    request: CreateDirectoryRequest,
): Promise<CreateDirectoryResponse> => {
    const { dirPath } = request;
    const response = await fetch(`${url}api/files/createDir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dirPath,
        }),
    });

    return response.json();
};

export const move = async (
    request: MoveItemRequest,
): Promise<MoveItemResponse> => {
    const { newPath, oldPath } = request;
    const response = await fetch(`${url}api/files/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            oldPath,
            newPath,
        }),
    });

    return response.json();
};

export const remove = async (
    request: RemoveItemRequest,
): Promise<RemoveItemResponse> => {
    const { path } = request;
    const response = await fetch(`${url}api/files/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            path,
        }),
    });

    return response.json();
};
