import type { DirTree } from "@noted/types";
import type { TreeNode } from "primereact/treenode";

export type GlobalState = {
    leftDrawer: boolean;
    // dirTree: DirTree[];
    treeNodes: TreeNode[];
};

export type GlobalActions = {
    setLeftDrawer: (leftDrawer: boolean) => void;
    // setDirTree: (dirTree: DirTree[]) => void;
    setTreeNodes: (dirTree: DirTree[]) => void;
};

export type GlobalStore = GlobalState & GlobalActions;
