import MDEditor from "@uiw/react-md-editor";
import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useState } from "react";

import { fetchFile } from "../../services/FileService";

export const TabsContainer = () => {
    const [value, setValue] = useState<string | undefined>("");

    useEffect(() => {
        console.log("[DEBUG] Test");
        const ttt = async () => {
            const ee = await fetchFile("test.md");

            // console.log({ ee });

            setValue(ee.content);
        };

        ttt();
    }, []);

    return (
        <div className="h-full overflow-hidden">
            <TabView
                className="flex flex-column h-full"
                pt={{
                    panelContainer: {
                        className: "h-full p-0",
                    },
                }}
            >
                <TabPanel header="Header I" className="h-full">
                    <MDEditor
                        value={value}
                        onChange={setValue}
                        data-color-mode="dark"
                        height="100%"
                        style={{ fontSize: "30px" }}
                        textareaProps={{
                            style: {
                                fontSize: "28px",
                            },
                        }}
                    />
                </TabPanel>
                <TabPanel header="Header II">
                    <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur,
                        adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>
                <TabPanel header="Header III">
                    <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                    </p>
                </TabPanel>
            </TabView>
        </div>
    );
};
