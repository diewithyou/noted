import { Menubar } from "primereact/menubar";

export const TopBar = () => {
    return (
        <Menubar
            className="w-full justify-content-between"
            start={<div>die with you</div>}
            model={[{ label: "text" }]}
        />
    );
};
