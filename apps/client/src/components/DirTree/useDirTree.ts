import { useEffect } from "react";

import { fetchDirTree } from "../../services/FileService";
import { useGlobalStore } from "../../store/global/useGlobalStore";

export const useDirTree = () => {
    const setDirTree = useGlobalStore((action) => action.setDirTree);
    const setTreeNodes = useGlobalStore((action) => action.setTreeNodes);
    const dirTree = useGlobalStore((state) => state.dirTree);
    const treeNodes = useGlobalStore((state) => state.treeNodes);

    console.log("treeNodes", treeNodes);

    useEffect(() => {
        fetchDirTree().then((response) => {
            if (response.status?.success && response?.tree) {
                setDirTree(response.tree);
                setTreeNodes(response.tree);
            }
        });
    }, [setDirTree, setTreeNodes]);

    return {
        dirTree,
        treeNodes,
    };
};
