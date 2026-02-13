export interface FileNode {
    name: string;
    path: string;
    type: "file" | "directory";
    size?: number;
    children?: FileNode[];
    error?: string;
}

export interface FileContentResponse {
    content: string;
    path: string;
}
