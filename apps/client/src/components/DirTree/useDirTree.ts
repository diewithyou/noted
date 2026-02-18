import { confirmDialog } from "primereact/confirmdialog";
import type {
    TreeDragDropEvent,
    TreeExpandedKeysType,
    TreeNodeClickEvent,
} from "primereact/tree";
import { useCallback, useEffect, useState } from "react";

import { fetchDirTree, move } from "../../services/FileService";
import { useGlobalStore } from "../../store/global/useGlobalStore";

export const useDirTree = () => {
    const setTreeNodes = useGlobalStore((action) => action.setTreeNodes);
    const setTreeNodes2 = useGlobalStore((action) => action.setTreeNodes2);
    const treeNodes = useGlobalStore((state) => state.treeNodes);

    const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>({});

    const getDirTree = useCallback(() => {
        fetchDirTree().then((response) => {
            if (response.status?.success && response?.tree) {
                console.log("tree", response);
                setTreeNodes(response.tree);
            }
        });
    }, [setTreeNodes]);

    const onNodeClick = useCallback(
        (e: TreeNodeClickEvent) => {
            const node = e.node;
            console.log("test", e);

            if (node.data === "d" && node.key) {
                const _expandedKeys = { ...expandedKeys };

                if (_expandedKeys[node.key]) {
                    delete _expandedKeys[node.key];
                } else {
                    _expandedKeys[node.key] = true;
                }

                setExpandedKeys(_expandedKeys);
            } else {
                // TODO open file
            }
        },
        [expandedKeys],
    );

    const handleMoveFileDialogAccept = useCallback(
        (from: string, to: string) => {
            move({ oldPath: from, newPath: to }).then((response) => {
                if (response.status.success) {
                    getDirTree();
                }
            });
        },
        [getDirTree],
    );

    const handleMoveFileDialogReject = useCallback(() => {}, []);

    const moveFileDialog = useCallback(
        (item: string, from: string, to: string) => {
            confirmDialog({
                message: `Are you sure you want to move '${item}' into '${to}'?`,
                header: "Move File",
                icon: "pi pi-exclamation-circle",
                acceptLabel: "Move",
                defaultFocus: "accept",
                accept: () => handleMoveFileDialogAccept(from, `${to}/${item}`),
                reject: handleMoveFileDialogReject,
            });
        },
        [handleMoveFileDialogAccept, handleMoveFileDialogReject],
    );

    const onDragDrop = useCallback(
        (e: TreeDragDropEvent) => {
            console.log("e", e);
            if (e.dropNode?.data === "d") {
                moveFileDialog(
                    e.dragNode.label as string,
                    e.dragNode.key as string,
                    e.dropNode.key as string,
                );
            }
            if (!e.dropNode) {
                moveFileDialog(
                    e.dragNode.label as string,
                    e.dragNode.key as string,
                    "/",
                );
            }
        },
        [moveFileDialog],
    );

    useEffect(() => {
        getDirTree();
    }, [getDirTree]);

    return {
        treeNodes,
        onNodeClick,
        expandedKeys,
        setExpandedKeys,
        onDragDrop,
        setTreeNodes2,
        getDirTree,
    };
};
