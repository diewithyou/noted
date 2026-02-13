import { url } from "./FileService.consts";

export const fetchDirTree = async () => {
    const response = await fetch(`${url}api/files/tree`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.json();
};

export const fetchFile = async (filePath: string) => {
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

export const writeFile = async (filePath: string, content: string) => {
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

export const createFile = async (filePath: string) => {
    const response = await fetch(`${url}api/files/createFile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            filePath,
        }),
    });

    return response.json();
};

export const createDir = async (dirPath: string) => {
    const response = await fetch(`${url}api/files/createDir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dirPath,
        }),
    });

    return response.json();
};

export const move = async (oldPath: string, newPath: string) => {
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

export const remove = async (path: string) => {
    const response = await fetch(`${url}api/files/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            path,
        }),
    });

    return response.json();
};
