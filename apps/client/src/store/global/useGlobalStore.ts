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
    // dirTree: [],
    treeNodes: [],
};

export const useGlobalStore = create<GlobalStore>()((set) => ({
    ...globalInitialState,
    setLeftDrawer: (leftDrawer) => set({ leftDrawer }),
    // setDirTree: (dirTree) => set({ dirTree }),
    setTreeNodes: (dirTree) => {
        const mapApiToTreeNodes = (data: DirTree[]): TreeNode[] => {
            return data.map((item) => {
                const isFolder = item.type === "d";

                const treeNode: MyTreeNode = {
                    key: item.path,
                    label: item.name,
                    data: item.type,

                    children:
                        item.children && item.children.length > 0
                            ? mapApiToTreeNodes(item.children)
                            : [],
                };

                if (isFolder) {
                    treeNode.expandedIcon = "pi pi-folder-open";
                    treeNode.collapsedIcon = "pi pi-folder";
                } else {
                    treeNode.icon = "pi pi-file";
                }

                return treeNode;
            });
        };

        set({ treeNodes: mapApiToTreeNodes(dirTree) });
    },
}));
