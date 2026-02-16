import type { DirTree } from "@noted/types";
import type { TreeNode } from "primereact/treenode";
import { create } from "zustand";

import type { GlobalState, GlobalStore } from "./useGlobalStore.types";

interface MyTreeNode extends TreeNode {
    expandedIcon?: string;
    collapsedIcon?: string;
}

const globalInitialState: GlobalState = {
    leftDrawer: true,
    dirTree: { name: "/", path: "", type: "d" },
    treeNodes: [],
};

export const useGlobalStore = create<GlobalStore>()((set) => ({
    ...globalInitialState,
    setLeftDrawer: (leftDrawer) => set({ leftDrawer }),
    setDirTree: (dirTree) => set({ dirTree }),
    setTreeNodes: (dirTree) => {
        const transformToTree = (node: DirTree): TreeNode => {
            const newNode: MyTreeNode = {
                key: node.path,
                label: node.name,
                data: node.name,
            };

            if (node.type === "d") {
                newNode.children = node.children?.map(transformToTree) || [];
                newNode.expandedIcon = "pi pi-folder-open";
                newNode.collapsedIcon = "pi pi-folder";
            } else {
                newNode.icon = "pi pi-file";
            }

            return newNode;
        };

        console.log("transformToTree", transformToTree(dirTree));

        set({ treeNodes: [transformToTree(dirTree)] });
    },
}));
