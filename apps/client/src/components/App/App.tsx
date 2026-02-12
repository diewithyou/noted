import { useEffect } from "react";

import { FileTree } from "../FileTree";
import { TabsContainer } from "../TabsContainer";
import { TopBar } from "../TobBar";

const fetchDirTree = async () => {
    const response = await fetch("http://192.168.1.17:5172/api/files/tree", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log({ response });

    const data = await response.json();
    console.log(data);
};

export const App = () => {
    useEffect(() => {
        const aaa = fetchDirTree();

        console.log({ aaa });
    }, []);

    return (
        <div className="flex w-screen h-screen">
            <div
                className="block bg-primary sm:w-20rem w-full h-full"
                style={{ minWidth: "20rem" }}
            >
                <FileTree />
            </div>
            <div className="hidden sm:flex flex-column w-full h-full">
                <TopBar />
                <TabsContainer />
            </div>
        </div>
    );
};

export default App;
