import { ContextMenu } from "primereact/contextmenu";
import { InputText } from "primereact/inputtext";
import {
    Tree,
    type TreeDragDropEvent,
    type TreeExpandedKeysType,
    type TreeNodeClickEvent,
} from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { useCallback, useEffect, useRef, useState } from "react";

import { useDirTree } from "./useDirTree";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
    createDir,
    createFile,
    move,
    remove,
} from "../../services/FileService";

export const DirTree = () => {
    const {
        expandedKeys,
        onDragDrop,
        onNodeClick,
        setExpandedKeys,
        treeNodes,
        setTreeNodes2,
        getDirTree,
    } = useDirTree();

    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const cm = useRef<any>(null);

    const [renamingKey, setRenamingKey] = useState<string | null>(null);
    const [tempName, setTempName] = useState("");

    const showInput = (type: "f" | "d") => {
        const newTreeNodes = [...treeNodes];

        if (!selectedKey) {
            setTreeNodes2([
                {
                    key: "temp-input",
                    type: "input",
                    data: type, // 'f' dla pliku, 'd' dla folderu
                    parentPath: "",
                    icon: type === "d" ? "pi pi-folder" : "pi pi-file",
                },
                ...newTreeNodes,
            ]);
            return;
        }

        const insertPlaceholder = (list: TreeNode[]): boolean => {
            for (let node of list) {
                if (node.key === selectedKey && node.data === "d") {
                    node.expanded = true;
                    node.children = [
                        {
                            key: "temp-input",
                            type: "input",
                            data: type,
                            parentPath: node.key,
                            icon: type === "d" ? "pi pi-folder" : "pi pi-file",
                        },
                        ...(node.children || []),
                    ];
                    return true;
                }
                if (node.children && insertPlaceholder(node.children))
                    return true;
            }
            return false;
        };

        insertPlaceholder(newTreeNodes);
        setTreeNodes2(newTreeNodes);
    };

    const handleSave = async (
        parentPath: string,
        name: string,
        type: "f" | "d",
    ) => {
        if (!name) {
            getDirTree();
            return;
        }

        const filePath = parentPath ? `${parentPath}/${name}` : name;

        if (type === "d") {
            createDir({ dirPath: filePath }).then((response) => {
                if (response.status.success) {
                    getDirTree();
                }
            });
        } else {
            createFile({ filePath: filePath }).then((response) => {
                if (response.status.success) {
                    getDirTree();
                }
            });
        }
    };

    const findNode = (list: TreeNode[], key: string): TreeNode | null => {
        for (let node of list) {
            if (node.key === key) return node;
            if (node.children) {
                const found = findNode(node.children, key);
                if (found) return found;
            }
        }
        return null;
    };

    const handleRename = async (oldPath: string, newName: string) => {
        if (!newName || newName === oldPath.split("/").pop()) {
            setRenamingKey(null);
            return;
        }

        const pathParts = oldPath.split("/");
        pathParts[pathParts.length - 1] = newName;
        const newPath = pathParts.join("/");

        move({ oldPath, newPath });

        setRenamingKey(null);
        getDirTree();
    };

    const handleDelete = async (pathToDelete: string) => {
        try {
            remove({ path: pathToDelete }).then((response) => {
                if (response.status.success) {
                    getDirTree();
                    setSelectedKey(null);
                }
            });
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const getMenuModel = () => {
        const node = findNode(treeNodes, selectedKey!);

        const isFile = node?.data === "f";

        return isFile
            ? [
                  {
                      label: "Rename",
                      icon: "pi pi-pencil",
                      command: () => {
                          const node = findNode(treeNodes, selectedKey!);
                          if (node) {
                              setTempName(node.label as string);
                              setRenamingKey(selectedKey);
                          }
                      },
                  },
                  {
                      label: "Delete",
                      icon: "pi pi-trash",
                      className: "text-red-500",
                      command: () => {
                          if (
                              window.confirm(
                                  `Are you sure you want to delete ${selectedKey}?`,
                              )
                          ) {
                              handleDelete(selectedKey!);
                          }
                      },
                  },
              ]
            : [
                  {
                      label: "New File",
                      icon: "pi pi-file-plus",
                      command: () => showInput("f"),
                  },
                  {
                      label: "New Folder",
                      icon: "pi pi-folder-plus",
                      command: () => showInput("d"),
                  },
                  {
                      label: "Rename",
                      icon: "pi pi-pencil",
                      command: () => {
                          const node = findNode(treeNodes, selectedKey!);
                          if (node) {
                              setTempName(node.label as string);
                              setRenamingKey(selectedKey);
                          }
                      },
                  },
                  {
                      label: "Delete",
                      icon: "pi pi-trash",
                      className: "text-red-500",
                      command: () => {
                          if (
                              window.confirm(
                                  `Are you sure you want to delete ${selectedKey}?`,
                              )
                          ) {
                              handleDelete(selectedKey!);
                          }
                      },
                  },
              ];
    };

    // const menuModel = [
    //     {
    //         label: "New File",
    //         icon: "pi pi-file-plus",
    //         command: () => showInput("f"),
    //     },
    //     {
    //         label: "New Folder",
    //         icon: "pi pi-folder-plus",
    //         command: () => showInput("d"),
    //     },
    //     {
    //         label: "Rename",
    //         icon: "pi pi-pencil",
    //         command: () => {
    //             const node = findNode(treeNodes, selectedKey!);
    //             if (node) {
    //                 setTempName(node.label as string);
    //                 setRenamingKey(selectedKey);
    //             }
    //         },
    //     },
    //     {
    //         label: "Delete",
    //         icon: "pi pi-trash",
    //         className: "text-red-500",
    //         command: () => {
    //             if (
    //                 window.confirm(
    //                     `Are you sure you want to delete ${selectedKey}?`,
    //                 )
    //             ) {
    //                 handleDelete(selectedKey!);
    //             }
    //         },
    //     },
    // ];

    const nodeTemplate = (node: any) => {
        if (node.type === "input") {
            return (
                <div className="flex align-items-center">
                    <InputText
                        autoFocus
                        className="p-inputtext-sm py-0"
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter")
                                handleSave(
                                    node.parentPath,
                                    e.target.value,
                                    node.data,
                                );
                            if (e.key === "Escape") getDirTree();
                        }}
                        onBlur={() => getDirTree()}
                    />
                </div>
            );
        }

        if (renamingKey === node.key) {
            return (
                <div className="flex align-items-center">
                    <InputText
                        value={tempName}
                        autoFocus
                        className="p-inputtext-sm py-0"
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter")
                                handleRename(node.key, tempName);
                            if (e.key === "Escape") setRenamingKey(null);
                        }}
                        onBlur={() => setRenamingKey(null)}
                    />
                </div>
            );
        }

        return (
            <div className="flex align-items-center">
                <span>{node.label}</span>
            </div>
        );
    };

    return (
        <>
            <ContextMenu model={getMenuModel()} ref={cm} />
            <div
                className="w-full"
                onContextMenu={(e) => {
                    if (
                        (e.target as HTMLElement).classList.contains("p-tree")
                    ) {
                        setSelectedKey(null);
                        cm.current.show(e);
                    }
                }}
            >
                <Tree
                    value={treeNodes}
                    className="w-full h-screen flex flex-column pr-0"
                    togglerTemplate={() => <span style={{ width: 0 }} />}
                    onNodeClick={onNodeClick}
                    expandedKeys={expandedKeys}
                    onToggle={(e) => setExpandedKeys(e.value)}
                    dragdropScope="DirectoryTree"
                    onDragDrop={onDragDrop}
                    nodeTemplate={nodeTemplate}
                    onContextMenu={(e) => cm.current.show(e.originalEvent)}
                    contextMenuSelectionKey={selectedKey ?? ""}
                    onContextMenuSelectionChange={(e) =>
                        setSelectedKey(e.value as string)
                    }
                    pt={{
                        node: () => ({
                            style: {
                                cursor: "pointer",
                                padding: 0,
                            },
                        }),
                        content: () => ({
                            style: {
                                padding: 1,
                            },
                        }),
                        droppoint: { className: "h-auto" },
                        container: { className: "overflow-y-auto" },
                        header: { className: "pr-3" },
                    }}
                />
            </div>
            <ConfirmDialog />
        </>
    );
};

// export const DirTree = () => {
//     const { dirTree, treeNodes } = useDirTree();
//     const [nodes, setNodes] = useState<TreeNode[]>([]);
//     const [editingKey, setEditingKey] = useState<string | null>(null);
//     const [tempLabel, setTempLabel] = useState("");
//     const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>({});
//     const cm = useRef<ContextMenu>(null);
//     const menu = [
//         {
//             label: "Copy",
//             icon: "pi pi-copy",
//             command: () => {},
//         },
//         {
//             label: "Rename",
//             icon: "pi pi-pencil",
//             command: () => {},
//         },
//         {
//             label: "Remove",
//             icon: "pi pi-trash",
//             command: () => {},
//         },
//     ];

//     const onNodeClick = (e: any) => {
//         const node = e.node;
//         console.log("test");

//         // Sprawdzamy, czy węzeł ma dzieci (tylko takie można rozwijać)
//         if (node.children && node.children.length > 0) {
//             console.log("abc");
//             let _expandedKeys = { ...expandedKeys };

//             if (_expandedKeys[node.key]) {
//                 // Jeśli jest już rozwinięty - usuwamy klucz (zwijamy)
//                 console.log("zamykam");
//                 delete _expandedKeys[node.key];
//             } else {
//                 // Jeśli jest zwinięty - dodajemy klucz (rozwijamy)
//                 console.log("otwieram", node);
//                 _expandedKeys[node.key] = true;
//             }

//             setExpandedKeys(_expandedKeys);
//         }
//     };

//     const updateNodeLabel = (
//         data: any[],
//         key: string,
//         newLabel: string,
//     ): any[] => {
//         return data.map((node) => {
//             if (node.key === key) {
//                 return { ...node, label: newLabel };
//             }
//             if (node.children) {
//                 return {
//                     ...node,
//                     children: updateNodeLabel(node.children, key, newLabel),
//                 };
//             }
//             return node;
//         });
//     };

//     const startEditing = (node: any) => {
//         setEditingKey(node.key);
//         setTempLabel(node.label);
//     };

//     const saveName = (key: string) => {
//         // Tutaj musisz napisać funkcję, która przejdzie przez Twoje drzewo
//         // i zaktualizuje 'label' dla węzła o danym 'key'
//         const newNodes = updateNodeLabel(nodes, key, tempLabel);
//         setNodes(newNodes);
//         setEditingKey(null);
//     };

//     const nodeTemplate = (node: any) => {
//         if (editingKey === node.key) {
//             return (
//                 <InputText
//                     value={tempLabel}
//                     onChange={(e) => setTempLabel(e.target.value)}
//                     onBlur={() => saveName(node.key)} // Zapisz przy utracie focusu
//                     onKeyDown={(e) => {
//                         if (e.key === "Enter") saveName(node.key);
//                         if (e.key === "Escape") setEditingKey(null); // Anuluj
//                     }}
//                     autoFocus
//                     className="outline-none p-0 w-full"
//                 />
//             );
//         }

//         return (
//             <span onDoubleClick={() => startEditing(node)}>{node.label}</span>
//         );
//     };

//     useEffect(() => {
//         NodeService.getTreeNodes().then((data) => setNodes(data));
//     }, []);

//     // console.log({ expandedKeys });

//     return (
//         <>
//             <ContextMenu model={menu} ref={cm} />
//             <Tree
//                 value={treeNodes}
//                 // value={nodes}
//                 dragdropScope="demo"
//                 onDragDrop={(e: TreeDragDropEvent) => setNodes(e.value)}
//                 className="w-full h-screen flex flex-column pr-0"
//                 onContextMenu={(e) =>
//                     (cm.current as ContextMenu).show(e.originalEvent)
//                 }
//                 nodeTemplate={nodeTemplate}
//                 togglerTemplate={() => <span style={{ width: 0 }} />}
//                 onNodeClick={onNodeClick}
//                 expandedKeys={expandedKeys}
//                 onToggle={(e) => setExpandedKeys(e.value)}
//                 filter
//                 filterMode="lenient"
//                 filterPlaceholder="Search"
//                 pt={{
//                     node: () => ({
//                         style: {
//                             cursor: "pointer",
//                             padding: 0,
//                         },
//                     }),
//                     content: () => ({
//                         style: {
//                             padding: 1,
//                         },
//                     }),
//                     droppoint: "h-auto",
//                     container: "overflow-y-auto",
//                     header: "pr-3",
//                 }}
//             />
//         </>
//     );
// };

const NodeService = {
    getTreeNodesData() {
        return [
            {
                key: "0",
                label: "Documents",
                data: "Documents Folder",
                expandedIcon: "pi pi-folder-open",
                collapsedIcon: "pi pi-folder",
                children: [
                    {
                        key: "0-0",
                        label: "Work",
                        data: "Work Folder",
                        expandedIcon: "pi pi-folder-open",
                        collapsedIcon: "pi pi-folder",
                        children: [
                            {
                                key: "0-0-0",
                                label: "Expenses.doc",
                                icon: "pi pi-file",
                                data: "Expenses Document",
                            },
                            {
                                key: "0-0-1",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-2",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-3",
                                label: "To jest test bardzo długje nazwy no i jeszcze dłuższej jeszcze kilka słów.doc",
                                icon: "pi pi-file",
                                data: "To jest test bardzo długiej nazwy",
                            },
                            {
                                key: "0-0-4",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-5",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-6",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-7",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-8",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-9",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-10",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-11",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-12",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-13",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-14",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-15",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-16",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-17",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-18",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-19",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-20",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-21",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-22",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-23",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-24",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-25",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                            {
                                key: "0-0-26",
                                label: "Resume.doc",
                                icon: "pi pi-file",
                                data: "Resume Document",
                            },
                        ],
                    },
                    {
                        key: "0-1",
                        label: "Home",
                        data: "Home Folder",
                        expandedIcon: "pi pi-folder-open",
                        collapsedIcon: "pi pi-folder",
                        children: [
                            {
                                key: "0-1-0",
                                label: "Invoices.txt",
                                icon: "pi pi-file",
                                data: "Invoices for this month",
                            },
                        ],
                    },
                ],
            },
            {
                key: "1",
                label: "Events",
                data: "Events Folder",
                expandedIcon: "pi pi-folder-open",
                collapsedIcon: "pi pi-folder",
                children: [
                    {
                        key: "1-0",
                        label: "Meeting",
                        icon: "pi pi-calendar-plus",
                        data: "Meeting",
                    },
                    {
                        key: "1-1",
                        label: "Product Launch",
                        icon: "pi pi-calendar-plus",
                        data: "Product Launch",
                    },
                    {
                        key: "1-2",
                        label: "Report Review",
                        icon: "pi pi-calendar-plus",
                        data: "Report Review",
                    },
                ],
            },
            {
                key: "2",
                label: "Movies",
                data: "Movies Folder",
                expandedIcon: "pi pi-folder-open",
                collapsedIcon: "pi pi-folder",
                children: [
                    {
                        key: "2-0",
                        expandedIcon: "pi pi-folder-open",
                        collapsedIcon: "pi pi-folder",
                        label: "Al Pacino",
                        data: "Pacino Movies",
                        children: [
                            {
                                key: "2-0-0",
                                label: "Scarface",
                                icon: "pi pi-video",
                                data: "Scarface Movie",
                            },
                            {
                                key: "2-0-1",
                                label: "Serpico",
                                icon: "pi pi-video",
                                data: "Serpico Movie",
                            },
                        ],
                    },
                    {
                        key: "2-1",
                        label: "Robert De Niro",
                        expandedIcon: "pi pi-folder-open",
                        collapsedIcon: "pi pi-folder",
                        data: "De Niro Movies",
                        children: [
                            {
                                key: "2-1-0",
                                label: "Goodfellas",
                                icon: "pi pi-video",
                                data: "Goodfellas Movie",
                            },
                            {
                                key: "2-1-1",
                                label: "Untouchables",
                                icon: "pi pi-video",
                                data: "Untouchables Movie",
                            },
                        ],
                    },
                ],
            },
        ];
    },

    getTreeTableNodesData() {
        return [
            {
                key: "0",
                data: {
                    name: "Applications",
                    size: "100kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "0-0",
                        data: {
                            name: "React",
                            size: "25kb",
                            type: "Folder",
                        },
                        children: [
                            {
                                key: "0-0-0",
                                data: {
                                    name: "react.app",
                                    size: "10kb",
                                    type: "Application",
                                },
                            },
                            {
                                key: "0-0-1",
                                data: {
                                    name: "native.app",
                                    size: "10kb",
                                    type: "Application",
                                },
                            },
                            {
                                key: "0-0-2",
                                data: {
                                    name: "mobile.app",
                                    size: "5kb",
                                    type: "Application",
                                },
                            },
                        ],
                    },
                    {
                        key: "0-1",
                        data: {
                            name: "editor.app",
                            size: "25kb",
                            type: "Application",
                        },
                    },
                    {
                        key: "0-2",
                        data: {
                            name: "settings.app",
                            size: "50kb",
                            type: "Application",
                        },
                    },
                ],
            },
            {
                key: "1",
                data: {
                    name: "Cloud",
                    size: "20kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "1-0",
                        data: {
                            name: "backup-1.zip",
                            size: "10kb",
                            type: "Zip",
                        },
                    },
                    {
                        key: "1-1",
                        data: {
                            name: "backup-2.zip",
                            size: "10kb",
                            type: "Zip",
                        },
                    },
                ],
            },
            {
                key: "2",
                data: {
                    name: "Desktop",
                    size: "150kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "2-0",
                        data: {
                            name: "note-meeting.txt",
                            size: "50kb",
                            type: "Text",
                        },
                    },
                    {
                        key: "2-1",
                        data: {
                            name: "note-todo.txt",
                            size: "100kb",
                            type: "Text",
                        },
                    },
                ],
            },
            {
                key: "3",
                data: {
                    name: "Documents",
                    size: "75kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "3-0",
                        data: {
                            name: "Work",
                            size: "55kb",
                            type: "Folder",
                        },
                        children: [
                            {
                                key: "3-0-0",
                                data: {
                                    name: "Expenses.doc",
                                    size: "30kb",
                                    type: "Document",
                                },
                            },
                            {
                                key: "3-0-1",
                                data: {
                                    name: "Resume.doc",
                                    size: "25kb",
                                    type: "Resume",
                                },
                            },
                        ],
                    },
                    {
                        key: "3-1",
                        data: {
                            name: "Home",
                            size: "20kb",
                            type: "Folder",
                        },
                        children: [
                            {
                                key: "3-1-0",
                                data: {
                                    name: "Invoices",
                                    size: "20kb",
                                    type: "Text",
                                },
                            },
                        ],
                    },
                ],
            },
            {
                key: "4",
                data: {
                    name: "Downloads",
                    size: "25kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "4-0",
                        data: {
                            name: "Spanish",
                            size: "10kb",
                            type: "Folder",
                        },
                        children: [
                            {
                                key: "4-0-0",
                                data: {
                                    name: "tutorial-a1.txt",
                                    size: "5kb",
                                    type: "Text",
                                },
                            },
                            {
                                key: "4-0-1",
                                data: {
                                    name: "tutorial-a2.txt",
                                    size: "5kb",
                                    type: "Text",
                                },
                            },
                        ],
                    },
                    {
                        key: "4-1",
                        data: {
                            name: "Travel",
                            size: "15kb",
                            type: "Text",
                        },
                        children: [
                            {
                                key: "4-1-0",
                                data: {
                                    name: "Hotel.pdf",
                                    size: "10kb",
                                    type: "PDF",
                                },
                            },
                            {
                                key: "4-1-1",
                                data: {
                                    name: "Flight.pdf",
                                    size: "5kb",
                                    type: "PDF",
                                },
                            },
                        ],
                    },
                ],
            },
            {
                key: "5",
                data: {
                    name: "Main",
                    size: "50kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "5-0",
                        data: {
                            name: "bin",
                            size: "50kb",
                            type: "Link",
                        },
                    },
                    {
                        key: "5-1",
                        data: {
                            name: "etc",
                            size: "100kb",
                            type: "Link",
                        },
                    },
                    {
                        key: "5-2",
                        data: {
                            name: "var",
                            size: "100kb",
                            type: "Link",
                        },
                    },
                ],
            },
            {
                key: "6",
                data: {
                    name: "Other",
                    size: "5kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "6-0",
                        data: {
                            name: "todo.txt",
                            size: "3kb",
                            type: "Text",
                        },
                    },
                    {
                        key: "6-1",
                        data: {
                            name: "logo.png",
                            size: "2kb",
                            type: "Picture",
                        },
                    },
                ],
            },
            {
                key: "7",
                data: {
                    name: "Pictures",
                    size: "150kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "7-0",
                        data: {
                            name: "barcelona.jpg",
                            size: "90kb",
                            type: "Picture",
                        },
                    },
                    {
                        key: "7-1",
                        data: {
                            name: "primeng.png",
                            size: "30kb",
                            type: "Picture",
                        },
                    },
                    {
                        key: "7-2",
                        data: {
                            name: "prime.jpg",
                            size: "30kb",
                            type: "Picture",
                        },
                    },
                ],
            },
            {
                key: "8",
                data: {
                    name: "Videos",
                    size: "1500kb",
                    type: "Folder",
                },
                children: [
                    {
                        key: "8-0",
                        data: {
                            name: "primefaces.mkv",
                            size: "1000kb",
                            type: "Video",
                        },
                    },
                    {
                        key: "8-1",
                        data: {
                            name: "intro.avi",
                            size: "500kb",
                            type: "Video",
                        },
                    },
                ],
            },
        ];
    },

    getTreeTableNodes() {
        return Promise.resolve(this.getTreeTableNodesData());
    },

    getTreeNodes() {
        return Promise.resolve(this.getTreeNodesData());
    },
};
