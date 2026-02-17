export type ResponseStatus = {
    success: boolean;
    error?: string;
};

export type DirTree = {
    name: string;
    path: string;
    type: "f" | "d";
    size?: number;
    children?: DirTree[];
};

export type GetDirectoryTreeResponse = {
    tree?: DirTree[];
    status?: ResponseStatus;
};

export type ReadFileContentRequest = {
    filePath: string;
};

export type ReadFileContentResponse = {
    content?: string;
    path?: string;
    status: ResponseStatus;
};

export type UpdateFileContentRequest = {
    filePath: string;
    content: string;
};

export type UpdateFileContentResponse = {
    status: ResponseStatus;
};

export type MoveItemRequest = {
    oldPath: string;
    newPath: string;
};

export type MoveItemResponse = {
    status: ResponseStatus;
};

export type RemoveItemRequest = {
    path: string;
};

export type RemoveItemResponse = {
    status: ResponseStatus;
};

export type CreateFileRequest = {
    filePath: string;
};

export type CreateFileResponse = {
    status: ResponseStatus;
};

export type CreateDirectoryRequest = {
    dirPath: string;
};

export type CreateDirectoryResponse = {
    status: ResponseStatus;
};
