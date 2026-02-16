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

export type GetDirectoryTreeResponseType = {
    tree?: DirTree;
    status?: ResponseStatus;
};

export type GetDirectoryTreeResponse = {
    response: GetDirectoryTreeResponseType;
};

export type ReadFileContentRequest = {
    filePath: string;
};

export type ReadFileContentResponseType = {
    content?: string;
    path?: string;
    status: ResponseStatus;
};

export type ReadFileContentResponse = {
    response: ReadFileContentResponseType;
};

export type UpdateFileContentRequest = {
    filePath: string;
    content: string;
};

export type UpdateFileContentResponseType = {
    status: ResponseStatus;
};

export type UpdateFileContentResponse = {
    response: UpdateFileContentResponseType;
};

export type MoveItemRequest = {
    oldPath: string;
    newPath: string;
};

export type MoveItemResponseType = {
    status: ResponseStatus;
};

export type MoveItemResponse = {
    response: MoveItemResponseType;
};

export type RemoveItemRequest = {
    path: string;
};

export type RemoveItemResponseType = {
    status: ResponseStatus;
};

export type RemoveItemResponse = {
    response: RemoveItemResponseType;
};

export type CreateFileRequest = {
    filePath: string;
};

export type CreateFileResponseType = {
    status: ResponseStatus;
};

export type CreateFileResponse = {
    response: CreateFileResponseType;
};

export type CreateDirectoryRequest = {
    dirPath: string;
};

export type CreateDirectoryResponseType = {
    status: ResponseStatus;
};

export type CreateDirectoryResponse = {
    response: CreateFileResponseType;
};
