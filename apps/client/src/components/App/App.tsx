import { FileTree } from "../FileTree";
import { TabsContainer } from "../TabsContainer";
import { TopBar } from "../TobBar";

export const App = () => {
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
