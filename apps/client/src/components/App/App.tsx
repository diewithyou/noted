import { Editor, type EditorTextChangeEvent } from "primereact/editor";
import { useState } from "react";

import { FileTree } from "../FileTree/FileTree";

export const App = () => {
    const [text, setText] = useState<string>("");

    return (
        <div className="flex w-screen h-screen">
            <div
                className="block bg-primary sm:w-20rem w-full h-full"
                style={{ minWidth: "20rem" }}
            >
                <FileTree />
            </div>
            <div className="hidden sm:block">
                <Editor
                    value={text}
                    onTextChange={(e: EditorTextChangeEvent) =>
                        setText(e.htmlValue as string)
                    }
                    style={{ height: "320px" }}
                />
            </div>
        </div>
    );
};

export default App;
